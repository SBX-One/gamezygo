<?php

namespace App\Repositories\Api\V1\User\Review;

use App\Models\Review;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Review\ReviewRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ReviewRepository implements ReviewRepositoryInterface
{
    /**
     * Get approved reviews with user and images relations.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getApprovedReviews(array $filters = []): Collection
    {
        $productId = $filters['product_id'] ?? null;
        $productSlug = $filters['product_slug'] ?? null;
        $rating = $filters['rating'] ?? null;

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

    /**
     * Get reviews created by the authenticated user.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getUserReviews(User $user, array $filters = []): Collection
    {
        $query = $user->reviews()
            ->with(['user', 'images']);

        if (! empty($filters['product_id'])) {
            $query->where('product_id', $filters['product_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['rating'])) {
            $query->where('rating', (int) $filters['rating']);
        }

        return $query->orderByDesc('created_at')->get();
    }

    /**
     * Find a review by its ID.
     */
    public function findReviewById(int $id): ?Review
    {
        return Review::with(['user', 'images'])->find($id);
    }

    /**
     * Find a review belonging to a specific user.
     */
    public function findUserReview(User $user, int $id): ?Review
    {
        return $user->reviews()->with(['user', 'images'])->where('id', $id)->first();
    }

    /**
     * Create a new review for a user with polymorphic images.
     *
     * @param  array<string, mixed>  $data
     * @param  array<UploadedFile>  $images
     */
    public function createReview(User $user, array $data, array $images = []): Review
    {
        $review = $user->reviews()->create([
            'product_id' => $data['product_id'] ?? null,
            'order_item_id' => $data['order_item_id'] ?? null,
            'rating' => (int) $data['rating'],
            'review' => $data['review'],
            'status' => $data['status'] ?? 'pending',
        ]);

        foreach ($images as $file) {
            if ($file instanceof UploadedFile) {
                $path = Storage::disk('public')->putFile('reviews/'.$review->id, $file);
                $review->images()->create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_type' => $file->getClientMimeType() ?? $file->extension(),
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        return $review->load(['user', 'images']);
    }

    /**
     * Update an existing review and optionally attach new images.
     *
     * @param  array<string, mixed>  $data
     * @param  array<UploadedFile>  $images
     */
    public function updateReview(Review $review, array $data, array $images = []): Review
    {
        $updateData = [];

        if (isset($data['rating'])) {
            $updateData['rating'] = (int) $data['rating'];
        }

        if (isset($data['review'])) {
            $updateData['review'] = $data['review'];
        }

        if (! empty($updateData)) {
            $review->update($updateData);
        }

        foreach ($images as $file) {
            if ($file instanceof UploadedFile) {
                $path = Storage::disk('public')->putFile('reviews/'.$review->id, $file);
                $review->images()->create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_type' => $file->getClientMimeType() ?? $file->extension(),
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        return $review->load(['user', 'images']);
    }

    /**
     * Delete a review and its polymorphic image files.
     */
    public function deleteReview(Review $review): bool
    {
        foreach ($review->images as $image) {
            if ($image->file_path && ! filter_var($image->file_path, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($image->file_path);
            }
            $image->delete();
        }

        return (bool) $review->delete();
    }
}
