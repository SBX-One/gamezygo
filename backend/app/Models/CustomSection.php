<?php

namespace App\Models;

use Database\Factories\CustomSectionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'title',
    'slug',
    'display_type',
    'auto_rule',
    'order_number',
    'is_active',
])]
class CustomSection extends Model
{
    /** @use HasFactory<CustomSectionFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'custom_section_products')
            ->withPivot('order_number')
            ->withTimestamps();
    }
}
