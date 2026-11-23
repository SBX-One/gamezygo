<?php

namespace App\Repositories\Api\V1\User\Community;

use App\Models\Community;
use App\Models\CommunityTag;
use App\Repositories\Contracts\Api\V1\User\Community\CommunityRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CommunityRepository implements CommunityRepositoryInterface
{
    /**
     * Get active communities with optional filters and pagination.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getActiveCommunities(array $filters = []): LengthAwarePaginator|Collection
    {
        $query = Community::query()
            ->with('tags')
            ->where('is_active', true);

        // 1. Search by name or link
        if (! empty($filters['search'])) {
            $search = trim((string) $filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('link', 'like', "%{$search}%");
            });
        }

        // 2. Filter by tag_id or tag_ids
        if (! empty($filters['tag_id'])) {
            $tagId = (int) $filters['tag_id'];
            $query->whereHas('tags', function ($q) use ($tagId) {
                $q->where('community_tags.id', $tagId);
            });
        } elseif (! empty($filters['tag_ids']) && is_array($filters['tag_ids'])) {
            $tagIds = array_map('intval', $filters['tag_ids']);
            $query->whereHas('tags', function ($q) use ($tagIds) {
                $q->whereIn('community_tags.id', $tagIds);
            });
        }

        // 3. Filter by tag slug or tag name
        if (! empty($filters['tag'])) {
            $tagSlug = trim((string) $filters['tag']);
            $query->whereHas('tags', function ($q) use ($tagSlug) {
                $q->where('community_tags.slug', $tagSlug)
                    ->orWhere('community_tags.name', 'like', "%{$tagSlug}%");
            });
        }

        // 4. Sorting
        $sortBy = strtolower((string) ($filters['sort_by'] ?? 'position'));
        if ($sortBy === 'latest' || $sortBy === 'newest') {
            $query->orderByDesc('created_at');
        } elseif ($sortBy === 'oldest') {
            $query->orderBy('created_at');
        } elseif ($sortBy === 'name' || $sortBy === 'a-z') {
            $query->orderBy('name', 'asc');
        } elseif ($sortBy === 'z-a') {
            $query->orderBy('name', 'desc');
        } else {
            // Default: position (order_number) then newest
            $query->orderBy('order_number', 'asc')->orderByDesc('created_at');
        }

        // 5. Pagination vs Get All
        if (isset($filters['per_page']) || isset($filters['page'])) {
            $perPage = (int) ($filters['per_page'] ?? 10);
            $page = (int) ($filters['page'] ?? 1);

            return $query->paginate($perPage, ['*'], 'page', $page);
        }

        return $query->get();
    }

    /**
     * Get single active community by ID.
     */
    public function getActiveCommunityById(int $id): ?Community
    {
        return Community::query()
            ->with('tags')
            ->where('is_active', true)
            ->find($id);
    }

    /**
     * Get available community tags.
     */
    public function getActiveTags(): Collection
    {
        return CommunityTag::query()
            ->whereHas('communities', function ($q) {
                $q->where('is_active', true);
            })
            ->orderBy('name', 'asc')
            ->get();
    }
}
