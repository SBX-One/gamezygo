<?php

namespace App\Repositories\Api\V1\Admin\Review;

use App\Models\Review;
use App\Models\ReviewReply;
use App\Repositories\Contracts\Api\V1\Admin\Review\AdminReviewRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Support\Facades\Storage;

class AdminReviewRepository implements AdminReviewRepositoryInterface
{
    /**
     * Get filtered and paginated reviews list with breakdown and meta.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getReviews(array $filters): array
    {
        $query = Review::query()->with([
            'user',
            'product.files',
            'orderItem',
            'replies.admin',
            'replies.user',
            'images',
        ]);

        // Filter by Rating / Star
        if (isset($filters['rating'])) {
            if (is_array($filters['rating'])) {
                $query->whereIn('reviews.rating', array_map('intval', $filters['rating']));
            } else {
                $query->where('reviews.rating', (int) $filters['rating']);
            }
        } elseif (isset($filters['star'])) {
            if (is_array($filters['star'])) {
                $query->whereIn('reviews.rating', array_map('intval', $filters['star']));
            } else {
                $query->where('reviews.rating', (int) $filters['star']);
            }
        }

        // Filter by Status
        if (! empty($filters['status'])) {
            $query->where('reviews.status', $filters['status']);
        }

        // Filter by Product ID
        if (! empty($filters['product_id'])) {
            $query->where('reviews.product_id', (int) $filters['product_id']);
        }

        // Filter by Search (review text, user name, user email, or product name)
        if (! empty($filters['search'])) {
            $searchPattern = '%'.strtolower(trim((string) $filters['search'])).'%';
            $query->where(function ($q) use ($searchPattern) {
                $q->whereRaw('LOWER(reviews.review) LIKE ?', [$searchPattern])
                    ->orWhereHas('user', function ($uq) use ($searchPattern) {
                        $uq->whereRaw('LOWER(name) LIKE ?', [$searchPattern])
                            ->orWhereRaw('LOWER(email) LIKE ?', [$searchPattern]);
                    })
                    ->orWhereHas('product', function ($pq) use ($searchPattern) {
                        $pq->whereRaw('LOWER(name) LIKE ?', [$searchPattern]);
                    });
            });
        }

        // Rating Breakdown calculation
        $breakdownQuery = clone $query;
        $totalFiltered = $breakdownQuery->count();
        $avgRating = $totalFiltered > 0 ? (float) $breakdownQuery->avg('reviews.rating') : 0.0;

        $ratingBreakdown = [
            '5_star' => (clone $query)->where('reviews.rating', 5)->count(),
            '4_star' => (clone $query)->where('reviews.rating', 4)->count(),
            '3_star' => (clone $query)->where('reviews.rating', 3)->count(),
            '2_star' => (clone $query)->where('reviews.rating', 2)->count(),
            '1_star' => (clone $query)->where('reviews.rating', 1)->count(),
            'average_rating' => round($avgRating, 1),
        ];

        // Sorting
        $sortBy = strtolower((string) ($filters['sort_by'] ?? 'latest'));
        if (in_array($sortBy, ['username_asc', 'name_asc', 'a-z'])) {
            $query->join('users', 'reviews.user_id', '=', 'users.id')
                ->orderBy('users.name', 'asc')
                ->select('reviews.*');
        } elseif (in_array($sortBy, ['username_desc', 'name_desc', 'z-a'])) {
            $query->join('users', 'reviews.user_id', '=', 'users.id')
                ->orderBy('users.name', 'desc')
                ->select('reviews.*');
        } elseif ($sortBy === 'email_asc') {
            $query->join('users', 'reviews.user_id', '=', 'users.id')
                ->orderBy('users.email', 'asc')
                ->select('reviews.*');
        } elseif ($sortBy === 'email_desc') {
            $query->join('users', 'reviews.user_id', '=', 'users.id')
                ->orderBy('users.email', 'desc')
                ->select('reviews.*');
        } elseif (in_array($sortBy, ['rating_desc', 'highest_rating'])) {
            $query->orderBy('reviews.rating', 'desc')->orderBy('reviews.id', 'desc');
        } elseif (in_array($sortBy, ['rating_asc', 'lowest_rating'])) {
            $query->orderBy('reviews.rating', 'asc')->orderBy('reviews.id', 'asc');
        } elseif (in_array($sortBy, ['oldest', 'created_at_asc'])) {
            $query->orderBy('reviews.created_at', 'asc')->orderBy('reviews.id', 'asc');
        } else {
            // default: latest
            $query->orderBy('reviews.created_at', 'desc')->orderBy('reviews.id', 'desc');
        }

        $perPage = isset($filters['per_page']) && is_numeric($filters['per_page']) ? (int) $filters['per_page'] : 10;
        $page = isset($filters['page']) && is_numeric($filters['page']) ? (int) $filters['page'] : 1;

        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        $mappedReviews = $paginator->getCollection()->map(function (Review $review) {
            return $this->formatReview($review);
        })->values()->all();

        $meta = [
            'current_page' => $paginator->currentPage(),
            'from' => $paginator->firstItem() ?? 1,
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'to' => $paginator->lastItem() ?? $paginator->count(),
            'total' => $paginator->total(),
        ];

        return [
            'total_reviews' => $paginator->total(),
            'rating_breakdown' => $ratingBreakdown,
            'reviews' => $mappedReviews,
            'meta' => $meta,
        ];
    }

    /**
     * Get single review details by ID.
     *
     * @return array<string, mixed>
     */
    public function getReviewById(int $id): array
    {
        $review = Review::with([
            'user',
            'product.files',
            'orderItem',
            'replies.admin',
            'replies.user',
            'images',
        ])->findOrFail($id);

        return $this->formatReview($review);
    }

    /**
     * Update the status of a review.
     *
     * @return array<string, mixed>
     */
    public function updateStatus(int $id, string $status): array
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => $status]);

        return [
            'id' => $review->id,
            'status' => $review->status,
        ];
    }

    /**
     * Reply to a review as admin.
     *
     * @return array<string, mixed>
     */
    public function replyToReview(int $id, string $message, ?int $adminId = null): array
    {
        $review = Review::findOrFail($id);

        $reply = ReviewReply::create([
            'review_id' => $review->id,
            'user_id' => null,
            'admin_id' => $adminId,
            'message' => trim($message),
        ]);

        return [
            'id' => $reply->id,
            'review_id' => $reply->review_id,
            'author_name' => $reply->admin?->name ?? 'Admin Gamezygo',
            'author_type' => 'admin',
            'message' => $reply->message,
            'created_at' => $reply->created_at?->toISOString(),
            'updated_at' => $reply->updated_at?->toISOString(),
        ];
    }

    /**
     * Delete a single review by ID.
     */
    public function deleteReview(int $id): void
    {
        $review = Review::findOrFail($id);
        $review->replies()->delete();
        $review->delete();
    }

    /**
     * Bulk delete reviews by IDs.
     *
     * @param  array<int>  $ids
     */
    public function bulkDeleteReviews(array $ids): int
    {
        ReviewReply::whereIn('review_id', $ids)->delete();
        $deleted = Review::whereIn('id', $ids)->delete();

        app(RedisCacheService::class)->flushTags([
            RedisCacheService::TAG_REVIEWS,
            RedisCacheService::TAG_PRODUCTS,
        ]);

        return $deleted;
    }

    /**
     * Format Review model into unified response array.
     *
     * @return array<string, mixed>
     */
    protected function formatReview(Review $review): array
    {
        $images = $review->images->map(function ($image) {
            $url = filter_var($image->file_path, FILTER_VALIDATE_URL)
              ? $image->file_path
              : Storage::disk('public')->url($image->file_path);

            return [
                'id' => $image->id,
                'url' => $url,
            ];
        })->values()->all();

        $replies = $review->replies->map(function ($reply) {
            $authorName = $reply->admin?->name ?? $reply->user?->name ?? 'Admin Gamezygo';
            $authorType = $reply->admin_id ? 'admin' : 'user';

            return [
                'id' => $reply->id,
                'author_name' => $authorName,
                'author_type' => $authorType,
                'message' => $reply->message,
                'created_at' => $reply->created_at?->toISOString(),
                'updated_at' => $reply->updated_at?->toISOString(),
            ];
        })->values()->all();

        $productData = null;
        if ($review->product) {
            $firstFile = $review->product->files->first();
            $productThumbnail = $firstFile
              ? (filter_var($firstFile->file_path, FILTER_VALIDATE_URL)
                ? $firstFile->file_path
                : Storage::disk('public')->url($firstFile->file_path))
              : 'https://placehold.co/600x400';

            $productData = [
                'id' => $review->product->id,
                'name' => $review->product->name,
                'slug' => $review->product->slug,
                'thumbnail' => $productThumbnail,
            ];
        }

        $userData = null;
        if ($review->user) {
            $userData = [
                'id' => $review->user->id,
                'name' => $review->user->name,
                'email' => $review->user->email,
                'avatar' => $review->user->avatar ?? 'https://placehold.co/150',
            ];
        }

        return [
            'id' => $review->id,
            'rating' => (int) $review->rating,
            'review' => $review->review,
            'status' => $review->status,
            'user' => $userData,
            'product' => $productData,
            'order_item_id' => $review->order_item_id,
            'images' => $images,
            'replies' => $replies,
            'created_at' => $review->created_at?->toISOString(),
            'updated_at' => $review->updated_at?->toISOString(),
        ];
    }
}
