<?php

namespace App\Repositories\Api\V1\Admin\Community;

use App\Models\Community;
use App\Models\CommunityTag;
use App\Repositories\Contracts\Api\V1\Admin\Community\AdminCommunityRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AdminCommunityRepository implements AdminCommunityRepositoryInterface
{
    /**
     * Get list of communities with filters.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getCommunities(array $filters): array
    {
        $query = Community::with('tags');

        // 1. Search
        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('link', 'like', "%{$search}%");
            });
        }

        // 2. Tag IDs filter
        if (! empty($filters['tag_ids']) && is_array($filters['tag_ids'])) {
            $tagIds = $filters['tag_ids'];
            $query->whereHas('tags', function ($q) use ($tagIds) {
                $q->whereIn('community_tags.id', $tagIds);
            });
        }

        // 3. Active status filter
        if (isset($filters['is_active'])) {
            $isActive = filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $isActive);
        }

        // 4. Sorting
        $sortBy = $filters['sort_by'] ?? 'position';
        if ($sortBy === 'latest') {
            $query->orderByDesc('created_at');
        } elseif ($sortBy === 'oldest') {
            $query->orderBy('created_at');
        } elseif ($sortBy === 'name') {
            $query->orderBy('name');
        } else {
            $query->orderBy('order_number')->orderByDesc('created_at');
        }

        // 5. Pagination / List
        if (isset($filters['per_page']) || isset($filters['page'])) {
            $perPage = (int) ($filters['per_page'] ?? 10);
            $page = (int) ($filters['page'] ?? 1);
            $paginator = $query->paginate($perPage, ['*'], 'page', $page);

            $items = collect($paginator->items())->map(function (Community $item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'banner_file_url' => $item->banner_file_url,
                    'link' => $item->link,
                    'is_active' => (bool) $item->is_active,
                    'order_number' => (int) $item->order_number,
                    'tags' => $item->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name])->values()->all(),
                    'created_at' => $item->created_at?->toISOString(),
                    'updated_at' => $item->updated_at?->toISOString(),
                ];
            })->values()->all();

            return [
                'total_communities' => $paginator->total(),
                'communities' => $items,
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

        $items = $all->map(function (Community $item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'banner_file_url' => $item->banner_file_url,
                'link' => $item->link,
                'is_active' => (bool) $item->is_active,
                'order_number' => (int) $item->order_number,
                'tags' => $item->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name])->values()->all(),
                'created_at' => $item->created_at?->toISOString(),
                'updated_at' => $item->updated_at?->toISOString(),
            ];
        })->values()->all();

        return [
            'total_communities' => count($items),
            'communities' => $items,
        ];
    }

    /**
     * Get single community by ID.
     *
     * @return array<string, mixed>
     */
    public function getCommunityById(int $id): array
    {
        $item = Community::with('tags')->findOrFail($id);

        return [
            'id' => $item->id,
            'name' => $item->name,
            'banner_file_url' => $item->banner_file_url,
            'link' => $item->link,
            'is_active' => (bool) $item->is_active,
            'order_number' => (int) $item->order_number,
            'tags' => $item->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name])->values()->all(),
            'created_at' => $item->created_at?->toISOString(),
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Create a new community.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createCommunity(array $data): array
    {
        $bannerUrl = null;
        if (isset($data['banner_file'])) {
            if ($data['banner_file'] instanceof UploadedFile) {
                $path = Storage::disk('public')->putFile('communities', $data['banner_file']);
                $bannerUrl = Storage::disk('public')->url($path);
            } elseif (is_string($data['banner_file'])) {
                $bannerUrl = $data['banner_file'];
            }
        }

        $orderNumber = isset($data['order_number'])
          ? (int) $data['order_number']
          : ((Community::max('order_number') ?? 0) + 1);

        $isActive = isset($data['is_active'])
          ? filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN)
          : true;

        $item = Community::create([
            'name' => $data['name'],
            'banner_file_url' => $bannerUrl,
            'link' => $data['link'] ?? null,
            'order_number' => $orderNumber,
            'is_active' => $isActive,
        ]);

        if (! empty($data['tag_ids']) && is_array($data['tag_ids'])) {
            $item->tags()->sync($data['tag_ids']);
        }

        $item->load('tags');

        return [
            'id' => $item->id,
            'name' => $item->name,
            'banner_file_url' => $item->banner_file_url,
            'link' => $item->link,
            'is_active' => (bool) $item->is_active,
            'order_number' => (int) $item->order_number,
            'tags' => $item->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name])->values()->all(),
            'created_at' => $item->created_at?->toISOString(),
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Update community by ID.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateCommunity(int $id, array $data): array
    {
        $item = Community::findOrFail($id);

        if (isset($data['banner_file'])) {
            if ($data['banner_file'] instanceof UploadedFile) {
                $path = Storage::disk('public')->putFile('communities', $data['banner_file']);
                $item->banner_file_url = Storage::disk('public')->url($path);
            } elseif (is_string($data['banner_file'])) {
                $item->banner_file_url = $data['banner_file'];
            }
        }

        if (isset($data['name'])) {
            $item->name = $data['name'];
        }

        if (isset($data['link'])) {
            $item->link = $data['link'];
        }

        if (isset($data['order_number'])) {
            $item->order_number = (int) $data['order_number'];
        }

        if (isset($data['is_active'])) {
            $item->is_active = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        $item->save();

        if (isset($data['tag_ids']) && is_array($data['tag_ids'])) {
            $item->tags()->sync($data['tag_ids']);
        }

        $item->load('tags');

        return [
            'id' => $item->id,
            'name' => $item->name,
            'banner_file_url' => $item->banner_file_url,
            'link' => $item->link,
            'is_active' => (bool) $item->is_active,
            'order_number' => (int) $item->order_number,
            'tags' => $item->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name])->values()->all(),
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Update active status of community.
     *
     * @return array<string, mixed>
     */
    public function updateStatus(int $id, bool $isActive): array
    {
        $item = Community::findOrFail($id);
        $item->is_active = $isActive;
        $item->save();

        return [
            'id' => $item->id,
            'name' => $item->name,
            'is_active' => (bool) $item->is_active,
        ];
    }

    /**
     * Sort communities by array of IDs.
     *
     * @param  array<int>  $communityIds
     * @return array<string, mixed>
     */
    public function sortCommunities(array $communityIds): array
    {
        $result = [];
        foreach ($communityIds as $index => $id) {
            $orderNumber = $index + 1;
            Community::where('id', $id)->update(['order_number' => $orderNumber]);
            $result[] = [
                'id' => (int) $id,
                'order_number' => $orderNumber,
            ];
        }

        app(RedisCacheService::class)->flushTags(RedisCacheService::TAG_COMMUNITIES);

        return [
            'communities' => $result,
        ];
    }

    /**
     * Delete community by ID.
     */
    public function deleteCommunity(int $id): void
    {
        $item = Community::findOrFail($id);
        $item->delete();
    }

    /**
     * Get available community tags.
     *
     * @return array<int, array{id: int, name: string}>
     */
    public function getTags(): array
    {
        return CommunityTag::select('id', 'name')->orderBy('name')->get()->toArray();
    }
}
