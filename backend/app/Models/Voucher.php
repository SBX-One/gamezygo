<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'code',
    'discount_type',
    'discount_amount',
    'max_discount',
    'min_purchase',
    'applies_to',
    'target_type',
    'product_scope',
    'slot',
    'usage_limit_per_user',
    'total_usage',
    'started_at',
    'expired_at',
    'status',
    'is_active',
])]
class Voucher extends Model
{
    /** @use HasFactory<\Database\Factories\VoucherFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'expired_at' => 'datetime',
            'is_active'  => 'boolean',
        ];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'voucher_users');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'voucher_products');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
