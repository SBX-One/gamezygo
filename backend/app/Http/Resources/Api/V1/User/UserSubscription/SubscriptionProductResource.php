<?php

namespace App\Http\Resources\Api\V1\User\UserSubscription;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $rating = 0.0;
        if (isset($this->attributes['rating']) && $this->attributes['rating'] !== null) {
            $rating = (float) $this->attributes['rating'];
        } elseif (isset($this->reviews_avg_rating) && $this->reviews_avg_rating !== null) {
            $rating = round((float) $this->reviews_avg_rating, 1);
        } elseif ($this->relationLoaded('reviews')) {
            $approvedReviews = $this->reviews->where('status', 'approved');
            $rating = $approvedReviews->count() > 0 ? round((float) $approvedReviews->avg('rating'), 1) : 0.0;
        }

        $genres = $this->relationLoaded('genreCategories')
          ? $this->genreCategories
          : $this->genreCategories()->get();

        $launcher = $this->relationLoaded('productLauncherCategory')
          ? $this->productLauncherCategory
          : $this->productLauncherCategory()->first();

        $priceDiscount = $this->discount_price !== null && $this->discount_price > 0
          ? (int) $this->discount_price
          : (isset($this->price_discount) && $this->price_discount !== null ? (int) $this->price_discount : (int) $this->price);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'thumbnail' => $this->thumbnail,
            'price' => (int) $this->price,
            'price_discount' => $priceDiscount,
            'discount' => (int) $this->discount,
            'rating' => $rating,
            'product_genre_categories' => $genres->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                ];
            })->values()->all(),
            'product_launcher_category' => $launcher ? [
                'id' => $launcher->id,
                'name' => $launcher->name,
                'slug' => $launcher->slug,
            ] : null,
        ];
    }
}
