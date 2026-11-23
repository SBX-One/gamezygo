<?php

namespace App\Models;

use Database\Factories\VoucherFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'name',
    'code',
    'discount_type',
    'discount_amount',
    'discount_value',
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
    /** @use HasFactory<VoucherFactory> */
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'expired_at' => 'datetime',
            'is_active' => 'boolean',
            'discount_amount' => 'integer',
            'discount_value' => 'integer',
            'max_discount' => 'integer',
            'min_purchase' => 'integer',
            'slot' => 'integer',
            'usage_limit_per_user' => 'integer',
            'total_usage' => 'integer',
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

    public function getNormalizedDiscountTypeAttribute(): string
    {
        return in_array($this->discount_type, ['percentage', 'percent']) ? 'percent' : 'fixed';
    }

    public function getDiscountValAttribute(): int
    {
        return (int) ($this->discount_value ?? $this->discount_amount ?? 0);
    }

    public function getDiscountLabelAttribute(): string
    {
        $val = $this->discount_val;
        if ($this->normalized_discount_type === 'percent') {
            return "{$val}%";
        }

        return 'Rp '.number_format($val, 0, ',', '.');
    }

    public function calculateStatus(): string
    {
        if (! $this->is_active) {
            return 'inactive';
        }

        $rawStatus = strtolower((string) ($this->attributes['status'] ?? ''));
        if ($rawStatus === 'draft') {
            return 'draft';
        }

        $now = now();
        if ($this->started_at && $this->started_at->isFuture()) {
            return 'scheduled';
        }

        if ($this->expired_at && $this->expired_at->isPast()) {
            return 'expired';
        }

        if ($this->slot > 0 && $this->total_usage >= $this->slot) {
            return 'exhausted';
        }

        return 'active';
    }
}
