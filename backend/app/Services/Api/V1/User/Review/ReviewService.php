<?php

namespace App\Services\Api\V1\User\Review;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Review\ReviewRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\UploadedFile;

class ReviewService
{
    public function __construct(
        protected ReviewRepositoryInterface $reviewRepository,
        protected RedisCacheService $cacheService
    ) {}

    /**
     * Fetch approved reviews with user and images.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getApprovedReviews(array $filters = []): Collection
    {
        $cacheKey = 'reviews:approved:list:'.md5(json_encode($filters));

        return $this->cacheService->remember(
            $cacheKey,
            RedisCacheService::TTL_SHORT,
            fn () => $this->reviewRepository->getApprovedReviews($filters),
            [RedisCacheService::TAG_REVIEWS]
        );
    }

    /**
     * Fetch authenticated user's own reviews.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getUserReviews(User $user, array $filters = []): Collection
    {
        return $this->reviewRepository->getUserReviews($user, $filters);
    }

    /**
     * Create a new review by user, linking product_id and order_item_id as appropriate.
     *
     * @param  array<string, mixed>  $data
     * @param  array<UploadedFile>  $images
     */
    public function createReview(User $user, array $data, array $images = []): Review
    {
        // If order_item_id is provided, resolve product_id from order item if missing
        if (! empty($data['order_item_id'])) {
            $orderItem = OrderItem::find($data['order_item_id']);
            if ($orderItem && empty($data['product_id'])) {
                $data['product_id'] = $orderItem->purchasable_id;
            }
        } elseif (! empty($data['product_id']) && empty($data['order_item_id'])) {
            // Look up if user has an order item for this product
            $orderItem = OrderItem::whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
                ->where('purchasable_id', $data['product_id'])
                ->first();

            if ($orderItem) {
                $data['order_item_id'] = $orderItem->id;
            }
        }

        return $this->reviewRepository->createReview($user, $data, $images);
    }

    /**
     * Update an existing review by user with authorization check.
     *
     * @param  array<string, mixed>  $data
     * @param  array<UploadedFile>  $images
     *
     * @throws ModelNotFoundException
     * @throws AuthorizationException
     */
    public function updateReview(User $user, int $id, array $data, array $images = []): Review
    {
        $review = $this->reviewRepository->findReviewById($id);

        if (! $review) {
            throw new ModelNotFoundException('Review not found');
        }

        if ($review->user_id !== $user->id) {
            throw new AuthorizationException('You are not authorized to update this review');
        }

        return $this->reviewRepository->updateReview($review, $data, $images);
    }

    /**
     * Delete an existing review by user with authorization check.
     *
     * @throws ModelNotFoundException
     * @throws AuthorizationException
     */
    public function deleteReview(User $user, int $id): bool
    {
        $review = $this->reviewRepository->findReviewById($id);

        if (! $review) {
            throw new ModelNotFoundException('Review not found');
        }

        if ($review->user_id !== $user->id) {
            throw new AuthorizationException('You are not authorized to delete this review');
        }

        return $this->reviewRepository->deleteReview($review);
    }
}
