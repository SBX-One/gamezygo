<?php

namespace App\Repositories\Api\V1\User\Faq;

use App\Models\Faq;
use App\Repositories\Contracts\Api\V1\User\Faq\FaqRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class FaqRepository implements FaqRepositoryInterface
{
    /**
     * Get active FAQs ordered by order_number.
     *
     * @param string|null $page
     * @return Collection
     */
    public function getActiveFaqs(?string $page = null): Collection
    {
        $query = Faq::query()->where('is_active', true);

        if ($page) {
            $query->where('page', $page);
        }

        return $query->orderBy('order_number')->get();
    }
}
