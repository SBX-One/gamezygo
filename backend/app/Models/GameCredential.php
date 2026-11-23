<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'product_id',
    'username',
    'password',
    'access_token',
    'status',
    'assigned_to_order_item_id',
    'assigned_to_user_id',
    'reserved_until',
])]
class GameCredential extends Model
{
    use HasFactory;

    public const STATUS_AVAILABLE = 'available';

    public const STATUS_RESERVED = 'reserved';

    public const STATUS_SOLD = 'sold';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'username' => 'encrypted',
            'password' => 'encrypted',
            'access_token' => 'encrypted',
            'reserved_until' => 'datetime',
        ];
    }

    /**
     * Product relation.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Order item relation.
     */
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class, 'assigned_to_order_item_id');
    }

    /**
     * Assigned customer user relation.
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    /**
     * Scope a query to only include available credentials.
     */
    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_AVAILABLE);
    }

    /**
     * Scope a query to only include reserved credentials.
     */
    public function scopeReserved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_RESERVED);
    }

    /**
     * Scope a query to only include sold/allocated credentials.
     */
    public function scopeSold(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_SOLD);
    }

    /**
     * Scope a query to only include credentials assigned to a specific user.
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('assigned_to_user_id', $userId);
    }
}
