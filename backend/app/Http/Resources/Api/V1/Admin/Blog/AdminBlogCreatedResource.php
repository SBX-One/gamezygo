<?php

namespace App\Http\Resources\Api\V1\Admin\Blog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminBlogCreatedResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $categoryData = $this->category ? [
            'id' => $this->category->id,
            'name' => $this->category->name,
            'slug' => $this->category->slug,
        ] : null;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'banner_file_url' => $this->banner_file_url ?? 'https://placehold.co/800x450',
            'status' => (string) $this->status,
            'published_at' => $this->published_at ? $this->published_at->toIso8601String() : null,
            'categories' => $categoryData,
            'created_at' => $this->created_at ? $this->created_at->toIso8601String() : null,
        ];
    }
}
