<?php

namespace App\Http\Controllers\Api\V1\User\CustomSection;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\User\CustomSection\CustomSectionCollection;
use App\Services\Api\V1\User\CustomSection\CustomSectionService;
use Illuminate\Http\Request;

class CustomSectionController extends Controller
{
    public function __construct(
        protected CustomSectionService $customSectionService
    ) {
    }

    public function index(Request $request): CustomSectionCollection
    {
        $customSections = $this->customSectionService->getActiveSections();

        return new CustomSectionCollection($customSections);
    }
}
