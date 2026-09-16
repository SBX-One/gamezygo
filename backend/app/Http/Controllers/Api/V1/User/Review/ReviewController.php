<?php

namespace App\Http\Controllers\Api\V1\User\Review;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\User\Review\ReviewCollection;
use App\Services\Api\V1\User\Review\ReviewService;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function __construct(
        protected ReviewService $reviewService
    ) {
    }

    public function index(Request $request): ReviewCollection
    {
        $filters = $request->only([
            'product_id',
            'product_slug',
            'rating',
        ]);

        $reviews = $this->reviewService->getApprovedReviews($filters);

        return new ReviewCollection($reviews);
    }
}
