<?php

namespace App\Services\Storage;

use App\Models\Announcement;
use App\Models\Community;
use App\Models\File as FileModel;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use League\Flysystem\AwsS3V3\AwsS3V3Adapter;
use Throwable;

class S3StorageService
{
    /**
     * Determine the active storage disk (S3 if configured and supported, otherwise public disk).
     */
    public function getDisk(): string
    {
        $hasAwsKey = ! empty(config('filesystems.disks.s3.key')) && config('filesystems.disks.s3.key') !== 'YOUR_AWS_ACCESS_KEY_ID';
        $hasBucket = ! empty(config('filesystems.disks.s3.bucket'));

        if ($hasAwsKey && $hasBucket && class_exists(AwsS3V3Adapter::class)) {
            return 's3';
        }

        return 'public';
    }

    /**
     * Upload an uploaded file or file content to cloud storage.
     *
     * @return string Public URL of the uploaded asset
     */
    public function upload(UploadedFile|string $file, string $directory = 'media', ?string $filename = null): string
    {
        $disk = $this->getDisk();

        if ($file instanceof UploadedFile) {
            $name = $filename ?: (Str::random(40).'.'.($file->getClientOriginalExtension() ?: 'jpg'));
            $path = $file->storeAs($directory, $name, $disk);

            return Storage::disk($disk)->url($path);
        }

        // If file is already a full remote URL (e.g. Steam image URL or external link), return as-is
        if (filter_var($file, FILTER_VALIDATE_URL)) {
            return $file;
        }

        // Binary content or local file path
        $name = $filename ?: (Str::random(40).'.jpg');
        $path = trim($directory, '/').'/'.$name;
        Storage::disk($disk)->put($path, (string) $file);

        return Storage::disk($disk)->url($path);
    }

    /**
     * Delete a file by URL or relative storage path.
     */
    public function delete(string $pathOrUrl): bool
    {
        $disk = $this->getDisk();
        $relativePath = $this->extractRelativePath($pathOrUrl);

        if (empty($relativePath)) {
            return false;
        }

        try {
            return Storage::disk($disk)->delete($relativePath);
        } catch (Throwable $e) {
            Log::warning("S3StorageService: failed to delete {$relativePath} from disk {$disk}: ".$e->getMessage());

            return false;
        }
    }

    /**
     * Sync a local directory from public storage to AWS S3.
     *
     * @param  string  $directory  Directory inside storage/app/public (e.g. 'products', 'announcements')
     * @return array{total: int, synced: int, skipped: int, failed: int, files: array<string>}
     */
    public function syncLocalDirectoryToS3(string $directory = 'products', bool $dryRun = false): array
    {
        $sourceDisk = 'public';
        $targetDisk = $this->getDisk();

        $files = Storage::disk($sourceDisk)->allFiles($directory);
        $result = [
            'total' => count($files),
            'synced' => 0,
            'skipped' => 0,
            'failed' => 0,
            'files' => [],
        ];

        foreach ($files as $file) {
            if ($dryRun) {
                $result['files'][] = "[Dry Run] Would sync: {$file} -> {$targetDisk}";
                $result['synced']++;

                continue;
            }

            try {
                if ($targetDisk !== $sourceDisk) {
                    $content = Storage::disk($sourceDisk)->get($file);
                    Storage::disk($targetDisk)->put($file, $content);
                }

                $result['synced']++;
                $result['files'][] = $file;
            } catch (Throwable $e) {
                $result['failed']++;
                Log::error("S3 Sync failed for {$file}: ".$e->getMessage());
            }
        }

        return $result;
    }

    /**
     * Sync database records referencing local URLs to S3 cloud storage URLs.
     *
     * @return array{announcements_updated: int, communities_updated: int, files_updated: int}
     */
    public function syncDatabaseAssetsToS3(bool $dryRun = false): array
    {
        $s3BaseUrl = rtrim(config('filesystems.disks.s3.url') ?: 'https://'.config('filesystems.disks.s3.bucket').'.s3.amazonaws.com', '/');
        $stats = [
            'announcements_updated' => 0,
            'communities_updated' => 0,
            'files_updated' => 0,
        ];

        // 1. Announcements
        $announcements = Announcement::where('banner_file_url', 'like', '%/storage/%')->get();
        foreach ($announcements as $item) {
            $path = $this->extractRelativePath($item->banner_file_url);
            if ($path) {
                $stats['announcements_updated']++;
                if (! $dryRun) {
                    $item->update(['banner_file_url' => "{$s3BaseUrl}/{$path}"]);
                }
            }
        }

        // 2. Communities
        $communities = Community::where('banner_file_url', 'like', '%/storage/%')->get();
        foreach ($communities as $item) {
            $path = $this->extractRelativePath($item->banner_file_url);
            if ($path) {
                $stats['communities_updated']++;
                if (! $dryRun) {
                    $item->update(['banner_file_url' => "{$s3BaseUrl}/{$path}"]);
                }
            }
        }

        // 3. Product Files
        $files = FileModel::where('file_path', 'like', '%/storage/%')->get();
        foreach ($files as $file) {
            $path = $this->extractRelativePath($file->file_path);
            if ($path) {
                $stats['files_updated']++;
                if (! $dryRun) {
                    $file->update(['file_path' => "{$s3BaseUrl}/{$path}"]);
                }
            }
        }

        return $stats;
    }

    /**
     * Extract relative storage path from a full URL or storage path.
     */
    public function extractRelativePath(?string $pathOrUrl): ?string
    {
        if (empty($pathOrUrl)) {
            return null;
        }

        if (str_contains($pathOrUrl, '/storage/')) {
            $parts = explode('/storage/', $pathOrUrl);

            return end($parts);
        }

        if (str_contains($pathOrUrl, 's3.amazonaws.com/')) {
            $parts = explode('s3.amazonaws.com/', $pathOrUrl);

            return ltrim(end($parts), '/');
        }

        return ltrim($pathOrUrl, '/');
    }
}
