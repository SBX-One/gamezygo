<?php

namespace App\Repositories\Contracts\Api\V1\User\Faq;

use Illuminate\Database\Eloquent\Collection;

interface FaqRepositoryInterface
{
    /**
     * Get active FAQs ordered by order_number.
     *
     * @return Collection
     */
    public function getActiveFaqs(): Collection;
}
