<?php

namespace App\Http\Controllers\Api\V1\User\Faq;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\User\Faq\FaqCollection;
use App\Services\Api\V1\User\Faq\FaqService;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function __construct(
        protected FaqService $faqService
    ) {}

    public function index(Request $request): FaqCollection
    {
        $faqs = $this->faqService->getActiveFaqs($request->query('page'));

        return new FaqCollection($faqs);
    }
}
