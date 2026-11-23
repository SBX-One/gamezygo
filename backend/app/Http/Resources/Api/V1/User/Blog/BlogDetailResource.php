<?php

namespace App\Http\Resources\Api\V1\User\Blog;

use App\Http\Resources\Api\V1\User\BlogCategory\BlogCategoryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'banner_file_url' => $this->banner_file_url,
            'title' => $this->title,
            'slug' => $this->slug,
            'sort_description' => $this->short_description,
            'content' => $this->content,
            'status' => $this->status,
            'published_at' => $this->published_at?->toIso8601String(),
            'category' => new BlogCategoryResource(
                $this->whenLoaded('category')
            ),
            'author' => $this->whenLoaded('author', function () {
                return [
                    'id' => $this->author->id,
                    'name' => $this->author->name,
                ];
            }),
        ];
    }

    /**
     * Customize the response for the resource.
     */
    public function withResponse(Request $request, JsonResponse $response): void
    {
        $response->setData([
            'success' => true,
            'message' => 'Blog retrieved successfully',
            'data' => $this->toArray($request),
        ]);
    }
}
