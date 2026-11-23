<?php

namespace App\Console\Commands;

use App\Services\Storage\S3StorageService;
use Illuminate\Console\Command;

class S3SyncCommand extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'gamezygo:s3-sync
                          {--directory=all : The directory to sync (products, announcements, communities, all)}
                          {--all : Sync all media directories}
                          {--dry-run : Simulate sync operations without transferring files}
                          {--db-update : Update database image URLs to point to S3}';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Sync local public media assets (covers, banners) to AWS S3 bucket';

  /**
   * Execute the console command.
   */
  public function handle(S3StorageService $storageService): int
  {
    $directory = (string) $this->option('directory');
    $dryRun = (bool) $this->option('dry-run');
    $dbUpdate = (bool) $this->option('db-update');

    $activeDisk = $storageService->getDisk();
    $this->info("Target Storage Disk: [{$activeDisk}]");

    if ($dryRun) {
      $this->warn('Running in DRY-RUN mode. No files will actually be uploaded or modified.');
    }

    $directories = ($directory === 'all')
      ? ['products', 'announcements', 'communities', 'avatars', 'blogs']
      : [$directory];

    $totalSynced = 0;
    $totalFailed = 0;

    foreach ($directories as $dir) {
      $this->info("Scanning local directory: [{$dir}]...");
      $result = $storageService->syncLocalDirectoryToS3($dir, $dryRun);

      $this->line("  Found: {$result['total']} file(s) | Synced: {$result['synced']} | Failed: {$result['failed']}");
      $totalSynced += $result['synced'];
      $totalFailed += $result['failed'];
    }

    $this->newLine();
    $this->info("Summary: {$totalSynced} file(s) successfully processed, {$totalFailed} failed.");

    if ($dbUpdate) {
      $this->info('Updating database image URLs to S3 endpoints...');
      $dbStats = $storageService->syncDatabaseAssetsToS3($dryRun);

      $this->line("  Announcements updated: {$dbStats['announcements_updated']}");
      $this->line("  Communities updated:   {$dbStats['communities_updated']}");
      $this->line("  Files updated:         {$dbStats['files_updated']}");
    }

    return Command::SUCCESS;
  }
}
