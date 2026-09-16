<?php

namespace App\Http\Resources\Api\V1\User\CustomSection;

use App\Http\Resources\Api\V1\User\Product\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomSectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                      => $this->id,
            'title'                   => $this->title,
            'slug'                    => $this->slug,
            'auto_rule'               => $this->auto_rule,
            'order_number'            => $this->order_number,
            'custom_section_products' => ProductResource::collection(
                $this->whenLoaded('products')
            ),
        ];
    }
}
