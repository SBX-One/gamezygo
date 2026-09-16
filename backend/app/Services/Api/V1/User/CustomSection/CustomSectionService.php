<?php

namespace App\Services\Api\V1\User\CustomSection;

use App\Repositories\Contracts\Api\V1\User\CustomSection\CustomSectionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CustomSectionService
{
    public function __construct(
        protected CustomSectionRepositoryInterface $customSectionRepository
    ) {
    }

    /**
     * Fetch active custom sections with products.
     *
     * @return Collection
     */
    public function getActiveSections(): Collection
    {
        return $this->customSectionRepository->getActiveSections();
    }
}
