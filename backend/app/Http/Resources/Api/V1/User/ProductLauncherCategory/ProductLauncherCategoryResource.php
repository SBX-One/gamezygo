<?php

namespace App\Http\Resources\Api\V1\User\ProductLauncherCategory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductLauncherCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'   => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
        ];
    }
}
