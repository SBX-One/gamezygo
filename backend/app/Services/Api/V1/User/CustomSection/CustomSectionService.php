<?php

namespace App\Services\Api\V1\User\CustomSection;

use App\Repositories\Contracts\Api\V1\User\CustomSection\CustomSectionRepositoryInterface;
use App\Services\Cache\RedisCacheService;
use Illuminate\Database\Eloquent\Collection;

class CustomSectionService
{
    public function __construct(
        protected CustomSectionRepositoryInterface $customSectionRepository,
        protected RedisCacheService $cacheService
    ) {
    }

    /**
     * Fetch active custom sections with products.
     *
     * @return Collection
     */
    public function getActiveSections(): Collection
    {
        return $this->cacheService->remember(
            'custom_sections:active',
            RedisCacheService::TTL_LONG,
            fn () => $this->customSectionRepository->getActiveSections(),
            [RedisCacheService::TAG_CUSTOM_SECTIONS, RedisCacheService::TAG_PRODUCTS]
        );
    }
}
