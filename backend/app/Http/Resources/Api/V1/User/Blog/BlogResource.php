<?php

namespace App\Http\Resources\Api\V1\User\Blog;

use App\Http\Resources\Api\V1\User\BlogCategory\BlogCategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'banner_file_url'  => $this->banner_file_url,
            'title'            => $this->title,
            'slug'             => $this->slug,
            'sort_description' => $this->short_description,
            'status'           => $this->status,
            'published_at'     => $this->published_at?->toIso8601String(),
            'meta_title'       => $this->meta_title ?? '',
            'meta_desc'        => $this->meta_description ?? '',
            'category'         => new BlogCategoryResource(
                $this->whenLoaded('category')
            ),
        ];
    }
}
