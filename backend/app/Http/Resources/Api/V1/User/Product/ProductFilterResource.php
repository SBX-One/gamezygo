<?php

namespace App\Http\Resources\Api\V1\User\Product;

use App\Http\Resources\Api\V1\User\GenreCategory\GenreCategoryResource;
use App\Http\Resources\Api\V1\User\ProductLauncherCategory\ProductLauncherCategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductFilterResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'categories' => GenreCategoryResource::collection($this->resource['categories'] ?? []),
            'launcher' => ProductLauncherCategoryResource::collection($this->resource['launcher'] ?? []),
            'statuses' => $this->resource['statuses'] ?? [
                [
                    'label' => 'Active',
                    'value' => true,
                ],
                [
                    'label' => 'Inactive',
                    'value' => false,
                ],
            ],
            'price_range' => [
                'min' => (int) ($this->resource['price_range']['min'] ?? 0),
                'max' => (int) ($this->resource['price_range']['max'] ?? 1500000),
            ],
            'sort_options' => $this->resource['sort_options'] ?? [
                [
                    'label' => 'Terbaru',
                    'value' => 'latest',
                ],
                [
                    'label' => 'Terlama',
                    'value' => 'oldest',
                ],
                [
                    'label' => 'Nama A-Z',
                    'value' => 'a_z',
                ],
                [
                    'label' => 'Nama Z-A',
                    'value' => 'z_a',
                ],
            ],
        ];
    }
}
