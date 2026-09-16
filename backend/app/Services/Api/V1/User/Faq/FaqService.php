<?php

namespace App\Services\Api\V1\User\Faq;

use App\Repositories\Contracts\Api\V1\User\Faq\FaqRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class FaqService
{
    public function __construct(
        protected FaqRepositoryInterface $faqRepository
    ) {
    }

    /**
     * Fetch active FAQs.
     *
     * @return Collection
     */
    public function getActiveFaqs(): Collection
    {
        return $this->faqRepository->getActiveFaqs();
    }
}
