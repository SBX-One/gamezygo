<?php

namespace App\Repositories\Api\V1\Admin\Announcement;

use App\Models\Announcement;
use App\Repositories\Contracts\Api\V1\Admin\Announcement\AdminAnnouncementRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AdminAnnouncementRepository implements AdminAnnouncementRepositoryInterface
{
    /**
     * Get list of announcements with filters.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getAnnouncements(array $filters): array
    {
        $query = Announcement::query();

        // 1. Search
        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('link', 'like', "%{$search}%")
                    ->orWhere('banner_file_url', 'like', "%{$search}%");
            });
        }

        // 2. Publish status filter
        if (isset($filters['is_publish'])) {
            $isPublish = filter_var($filters['is_publish'], FILTER_VALIDATE_BOOLEAN);
            $query->where('is_published', $isPublish);
        }

        // 3. Sorting
        $sortBy = $filters['sort_by'] ?? 'sort';
        if ($sortBy === 'latest') {
            $query->orderByDesc('created_at');
        } elseif ($sortBy === 'oldest') {
            $query->orderBy('created_at');
        } else {
            $query->orderBy('sort_order')->orderByDesc('created_at');
        }

        // 4. Pagination / List
        if (isset($filters['per_page']) || isset($filters['page'])) {
            $perPage = (int) ($filters['per_page'] ?? 10);
            $page = (int) ($filters['page'] ?? 1);
            $paginator = $query->paginate($perPage, ['*'], 'page', $page);

            $items = collect($paginator->items())->map(function (Announcement $item) {
                return [
                    'id' => $item->id,
                    'banner_file_url' => $item->banner_file_url,
                    'link' => $item->link,
                    'is_publish' => (bool) $item->is_published,
                    'sort' => (int) $item->sort_order,
                    'created_at' => $item->created_at?->toISOString(),
                    'updated_at' => $item->updated_at?->toISOString(),
                ];
            })->values()->all();

            return [
                'total_announcements' => $paginator->total(),
                'announcements' => $items,
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'from' => $paginator->firstItem(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'to' => $paginator->lastItem(),
                    'total' => $paginator->total(),
                ],
            ];
        }

        $all = $query->get();

        $items = $all->map(function (Announcement $item) {
            return [
                'id' => $item->id,
                'banner_file_url' => $item->banner_file_url,
                'link' => $item->link,
                'is_publish' => (bool) $item->is_published,
                'sort' => (int) $item->sort_order,
                'created_at' => $item->created_at?->toISOString(),
                'updated_at' => $item->updated_at?->toISOString(),
            ];
        })->values()->all();

        return [
            'total_announcements' => count($items),
            'announcements' => $items,
        ];
    }

    /**
     * Get single announcement by ID.
     *
     * @return array<string, mixed>
     */
    public function getAnnouncementById(int $id): array
    {
        $item = Announcement::findOrFail($id);

        return [
            'id' => $item->id,
            'banner_file_url' => $item->banner_file_url,
            'link' => $item->link,
            'is_publish' => (bool) $item->is_published,
            'sort' => (int) $item->sort_order,
            'created_at' => $item->created_at?->toISOString(),
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Create a new announcement banner.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createAnnouncement(array $data): array
    {
        $bannerUrl = null;
        if (isset($data['banner_file'])) {
            if ($data['banner_file'] instanceof UploadedFile) {
                $path = Storage::disk('public')->putFile('announcements', $data['banner_file']);
                $bannerUrl = Storage::disk('public')->url($path);
            } elseif (is_string($data['banner_file'])) {
                $bannerUrl = $data['banner_file'];
            }
        }

        $sortOrder = isset($data['sort']) ? (int) $data['sort'] : ((Announcement::max('sort_order') ?? 0) + 1);
        $isPublished = isset($data['is_publish']) ? filter_var($data['is_publish'], FILTER_VALIDATE_BOOLEAN) : false;

        $item = Announcement::create([
            'banner_file_url' => $bannerUrl ?? '',
            'link' => $data['link'] ?? null,
            'sort_order' => $sortOrder,
            'is_published' => $isPublished,
        ]);

        return [
            'id' => $item->id,
            'banner_file_url' => $item->banner_file_url,
            'link' => $item->link,
            'is_publish' => (bool) $item->is_published,
            'sort' => (int) $item->sort_order,
            'created_at' => $item->created_at?->toISOString(),
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Update announcement banner by ID.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateAnnouncement(int $id, array $data): array
    {
        $item = Announcement::findOrFail($id);

        if (isset($data['banner_file'])) {
            if ($data['banner_file'] instanceof UploadedFile) {
                $path = Storage::disk('public')->putFile('announcements', $data['banner_file']);
                $item->banner_file_url = Storage::disk('public')->url($path);
            } elseif (is_string($data['banner_file'])) {
                $item->banner_file_url = $data['banner_file'];
            }
        }

        if (isset($data['link'])) {
            $item->link = $data['link'];
        }

        if (isset($data['sort'])) {
            $item->sort_order = (int) $data['sort'];
        }

        if (isset($data['is_publish'])) {
            $item->is_published = filter_var($data['is_publish'], FILTER_VALIDATE_BOOLEAN);
        }

        $item->save();

        return [
            'id' => $item->id,
            'banner_file_url' => $item->banner_file_url,
            'link' => $item->link,
            'is_publish' => (bool) $item->is_published,
            'sort' => (int) $item->sort_order,
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Update publish status of announcement.
     *
     * @return array<string, mixed>
     */
    public function updatePublish(int $id, bool $isPublish): array
    {
        $item = Announcement::findOrFail($id);
        $item->is_published = $isPublish;
        $item->save();

        return [
            'id' => $item->id,
            'is_publish' => (bool) $item->is_published,
        ];
    }

    /**
     * Sort announcements by array of IDs.
     *
     * @param  array<int>  $announcementIds
     */
    public function sortAnnouncements(array $announcementIds): void
    {
        foreach ($announcementIds as $index => $id) {
            Announcement::where('id', $id)->update([
                'sort_order' => $index + 1,
            ]);
        }

        app(RedisCacheService::class)->flushTags(RedisCacheService::TAG_ANNOUNCEMENTS);
    }

    /**
     * Delete announcement by ID.
     */
    public function deleteAnnouncement(int $id): void
    {
        $item = Announcement::findOrFail($id);
        $item->delete();
    }
}
