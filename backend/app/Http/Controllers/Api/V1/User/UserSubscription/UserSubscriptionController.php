<?php

namespace App\Http\Controllers\Api\V1\User\UserSubscription;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\UserSubscription\GetSubscriptionProductsRequest;
use App\Http\Resources\Api\V1\User\UserSubscription\SubscriptionProductCollection;
use App\Http\Resources\Api\V1\User\UserSubscription\UserSubscriptionResource;
use App\Services\Api\V1\User\UserSubscription\UserSubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserSubscriptionController extends Controller
{
    public function __construct(
        protected UserSubscriptionService $subscriptionService
    ) {}

    /**
     * Display the authenticated user's current active subscription.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user() ?? auth('api')->user();

        $subscription = $this->subscriptionService->getUserSubscription($user);

        if (! $subscription) {
            return response()->json([
                'success' => false,
                'message' => 'No active subscription found',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Subscription retrieved successfully',
            'data' => (new UserSubscriptionResource($subscription))->resolve(),
        ], 200);
    }

    /**
     * List products included in subscription catalog with filters.
     */
    public function products(GetSubscriptionProductsRequest $request): SubscriptionProductCollection
    {
        $filters = $request->validated();
        if (empty($filters)) {
            $filters = $request->only(['search', 'genre_categories', 'page', 'per_page']);
        }

        $products = $this->subscriptionService->getSubscriptionProducts($filters);

        return new SubscriptionProductCollection($products);
    }
}
