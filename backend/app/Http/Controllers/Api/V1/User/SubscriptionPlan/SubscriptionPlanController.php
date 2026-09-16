<?php

namespace App\Http\Controllers\Api\V1\User\SubscriptionPlan;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\User\SubscriptionPlan\SubscriptionPlanCollection;
use App\Services\Api\V1\User\SubscriptionPlan\SubscriptionPlanService;
use Illuminate\Http\Request;

class SubscriptionPlanController extends Controller
{
    public function __construct(
        protected SubscriptionPlanService $subscriptionPlanService
    ) {
    }

    public function index(Request $request): SubscriptionPlanCollection
    {
        $subscriptionPlans = $this->subscriptionPlanService->getActivePlans();

        return new SubscriptionPlanCollection($subscriptionPlans);
    }
}
