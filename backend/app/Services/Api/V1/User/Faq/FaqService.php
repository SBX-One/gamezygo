<?php

namespace App\Services\Api\V1\User\Faq;

use App\Repositories\Contracts\Api\V1\User\Faq\FaqRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Database\Eloquent\Collection;

class FaqService
{
    public function __construct(
        protected FaqRepositoryInterface $faqRepository,
        protected RedisCacheService $cacheService
    ) {
    }

    /**
     * Fetch active FAQs.
     *
     * @param string|null $page
     * @return Collection
     */
    public function getActiveFaqs(?string $page = null): Collection
    {
        $cacheKey = 'faqs:active:' . ($page ?? 'all');

        return $this->cacheService->remember(
            $cacheKey,
            RedisCacheService::TTL_EXTENDED,
            fn () => $this->faqRepository->getActiveFaqs($page),
            [RedisCacheService::TAG_FAQS]
        );
    }
}
