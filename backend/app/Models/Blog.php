<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'banner_file_url',
    'title',
    'slug',
    'short_description',
    'content',
    'blog_category_id',
    'blog_sub_category_id',
    'author_id',
    'status',
    'meta_title',
    'meta_description',
    'published_at',
    'total_views',
])]
class Blog extends Model
{
    /** @use HasFactory<\Database\Factories\BlogFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_sub_category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function adminAuthor(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'author_id');
    }

    public function getAuthorDataAttribute(): array
    {
        if ($this->relationLoaded('author') && $this->author) {
            return [
                'id'   => $this->author->id,
                'name' => $this->author->name,
            ];
        }

        if ($this->author_id) {
            $user = User::find($this->author_id);
            if ($user) {
                return ['id' => $user->id, 'name' => $user->name];
            }

            $admin = Admin::find($this->author_id);
            if ($admin) {
                return ['id' => $admin->id, 'name' => $admin->name];
            }
        }

        return [
            'id'   => 1,
            'name' => 'Gamerygo Admin',
        ];
    }
}
