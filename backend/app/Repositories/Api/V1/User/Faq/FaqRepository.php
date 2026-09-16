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
     * @return Collection
     */
    public function getActiveFaqs(): Collection
    {
        return Faq::query()
            ->where('is_active', true)
            ->orderBy('order_number')
            ->get();
    }
}
