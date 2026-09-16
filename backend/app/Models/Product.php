<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[Fillable([
    'name',
    'slug',
    'description',
    'price',
    'discount_price',
    'product_launcher_category_id',
    'product_instruction_id',
    'steam_url',
    'status',
    'is_subscription_supported',
])]
class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    public function genreCategories(): BelongsToMany
    {
        return $this->belongsToMany(GenreCategory::class, 'product_genre_categories');
    }

    public function productLauncherCategory(): BelongsTo
    {
        return $this->belongsTo(ProductLauncherCategory::class, 'product_launcher_category_id');
    }

    public function productInstruction(): BelongsTo
    {
        return $this->belongsTo(ProductInstruction::class, 'product_instruction_id');
    }

    public function specificationRequirements(): HasMany
    {
        return $this->hasMany(ProductSpecificationRequirement::class);
    }

    public function gameAccounts(): HasOne
    {
        return $this->hasOne(ProductGameAccount::class);
    }

    public function userOwnedGames(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_owned_games');
    }

    public function vouchers(): BelongsToMany
    {
        return $this->belongsToMany(Voucher::class, 'voucher_products');
    }

    public function usersCart(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_cart_items');
    }

    public function usersWishlists(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_wishlists');
    }

    public function orderItems(): MorphMany
    {
        return $this->morphMany(OrderItem::class, 'purchasable');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function customSections(): BelongsToMany
    {
        return $this->belongsToMany(CustomSection::class, 'custom_section_products')
            ->withPivot('order_number')
            ->withTimestamps();
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'related');
    }

    public function getDiscountAttribute(): int
    {
        if ($this->price > 0 && $this->discount_price > 0 && $this->discount_price < $this->price) {
            return (int) round((($this->price - $this->discount_price) / $this->price) * 100);
        }
        return 0;
    }
}
