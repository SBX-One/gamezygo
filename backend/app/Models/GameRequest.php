<?php

namespace App\Models;

use Database\Factories\GameRequestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'user_id',
    'name',
    'steam_url',
    'request_count',
    'note',
    'status',
    'admin_note',
    'is_pinned',
    'product_id',
    'reviewed_at',
    'last_requested_at',
])]
class GameRequest extends Model
{
    /** @use HasFactory<GameRequestFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'request_count' => 'integer',
            'is_pinned' => 'boolean',
            'reviewed_at' => 'datetime',
            'last_requested_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function voters(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'game_request_users')->withTimestamps();
    }

    public function getProductNameAttribute(): ?string
    {
        return $this->name ?? $this->product?->name;
    }

    public function getTotalRequestsAttribute(): int
    {
        return (int) ($this->request_count ?? 1);
    }
}
