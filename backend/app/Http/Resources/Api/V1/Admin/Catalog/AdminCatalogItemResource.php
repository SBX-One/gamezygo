<?php

namespace App\Http\Resources\Api\V1\Admin\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminCatalogItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $sellingPrice = $this->discount_price > 0 ? (int) $this->discount_price : (int) $this->price;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'image_url' => $this->thumbnail ?? 'https://placehold.co/100x100',
            'categories' => $this->genreCategories->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                ];
            })->values()->all(),
            'price' => $sellingPrice,
            'status' => (string) $this->status,
            'created_at' => $this->created_at ? $this->created_at->toIso8601String() : null,
        ];
    }
}
