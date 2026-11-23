<?php

namespace App\Models;

use Database\Factories\CommunityTagFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'name',
    'slug',
])]
class CommunityTag extends Model
{
    /** @use HasFactory<CommunityTagFactory> */
    use HasFactory;

    public function communities(): BelongsToMany
    {
        return $this->belongsToMany(Community::class, 'community_community_tags');
    }
}
