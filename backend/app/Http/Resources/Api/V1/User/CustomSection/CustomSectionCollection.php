<?php

namespace App\Http\Resources\Api\V1\User\CustomSection;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CustomSectionCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'message' => 'Custom sections retrieved successfully',
            'data'    => CustomSectionResource::collection($this->collection),
        ];
    }
}
