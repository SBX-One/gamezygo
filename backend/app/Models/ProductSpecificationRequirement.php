<?php

namespace App\Models;

use Database\Factories\ProductSpecificationRequirementFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'product_id',
    'label',
    'requirement',
    'type',
])]
class ProductSpecificationRequirement extends Model
{
    /** @use HasFactory<ProductSpecificationRequirementFactory> */
    use HasFactory;

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
