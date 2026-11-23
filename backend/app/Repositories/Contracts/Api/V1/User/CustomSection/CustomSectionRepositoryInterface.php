<?php

namespace App\Repositories\Contracts\Api\V1\User\CustomSection;

use Illuminate\Database\Eloquent\Collection;

interface CustomSectionRepositoryInterface
{
    /**
     * Get active custom sections ordered by order_number with loaded products.
     */
    public function getActiveSections(): Collection;
}
