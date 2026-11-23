<?php

namespace App\Http\Resources\Api\V1\User\Review;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ReviewCollection extends ResourceCollection
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
            'message' => 'Reviews retrieved successfully',
            'data' => ReviewResource::collection($this->collection),
        ];
    }
}
