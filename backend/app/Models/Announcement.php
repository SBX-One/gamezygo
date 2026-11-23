<?php

namespace App\Models;

use Database\Factories\AnnouncementFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'banner_file_url',
    'link',
    'sort_order',
    'is_published',
])]
class Announcement extends Model
{
    /** @use HasFactory<AnnouncementFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function getIsPublishAttribute(): bool
    {
        return (bool) $this->is_published;
    }

    public function getSortAttribute(): int
    {
        return (int) $this->sort_order;
    }
}
