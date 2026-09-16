<?php

namespace App\Http\Resources\Api\V1\User\Blog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class BlogCollection extends ResourceCollection
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
            'message' => 'Blogs retrieved successfully',
            'data'    => BlogResource::collection($this->collection),
        ];
    }
}
