<?php

namespace App\Http\Resources\Api\V1\User\Product;

use App\Http\Resources\Api\V1\User\GenreCategory\GenreCategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'slug'           => $this->slug,
            'thumbnail'      => $this->thumbnail,
            'price'          => $this->price,
            'discount_price' => $this->discount_price,
            'discount'       => $this->discount,
            'categories'     => GenreCategoryResource::collection(
                $this->whenLoaded('genreCategories')
            )
        ];
    }
}
