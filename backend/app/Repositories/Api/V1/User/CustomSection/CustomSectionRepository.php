<?php

namespace App\Repositories\Api\V1\User\CustomSection;

use App\Models\CustomSection;
use App\Models\Product;
use App\Repositories\Contracts\Api\V1\User\CustomSection\CustomSectionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CustomSectionRepository implements CustomSectionRepositoryInterface
{
    /**
     * Get active custom sections ordered by order_number with loaded products.
     *
     * @return Collection
     */
    public function getActiveSections(): Collection
    {
        $sections = CustomSection::query()
            ->where('is_active', true)
            ->with(['products.genreCategories'])
            ->orderBy('order_number')
            ->get();

        foreach ($sections as $section) {
            if ($section->display_type === 'auto') {
                $query = Product::query()->with('genreCategories');

                match ($section->auto_rule) {
                    'best_seller' => $query->withCount('orderItems')->orderByDesc('order_items_count'),
                    'newest'      => $query->orderByDesc('created_at'),
                    'discounted'  => $query->whereNotNull('discount_price')->where('discount_price', '>', 0),
                    default       => null,
                };

                $section->setRelation('products', $query->take(8)->get());
            }
        }

        return $sections;
    }
}
