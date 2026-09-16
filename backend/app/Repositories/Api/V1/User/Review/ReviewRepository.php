<?php

namespace App\Repositories\Api\V1\User\Review;

use App\Models\Review;
use App\Repositories\Contracts\Api\V1\User\Review\ReviewRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ReviewRepository implements ReviewRepositoryInterface
{
    /**
     * Get approved reviews with user and images relations.
     *
     * @param array<string, mixed> $filters
     * @return Collection
     */
    public function getApprovedReviews(array $filters = []): Collection
    {
        $productId   = $filters['product_id'] ?? null;
        $productSlug = $filters['product_slug'] ?? null;
        $rating      = $filters['rating'] ?? null;

        return Review::query()
            ->where('status', 'approved')
            ->with(['user', 'images'])
            ->when($productId, function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->when($productSlug, function ($query) use ($productSlug) {
                $query->whereHas('product', function ($q) use ($productSlug) {
                    $q->where('slug', $productSlug);
                });
            })
            ->when($rating, function ($query) use ($rating) {
                $query->where('rating', (int) $rating);
            })
            ->orderByDesc('created_at')
            ->get();
    }
}
