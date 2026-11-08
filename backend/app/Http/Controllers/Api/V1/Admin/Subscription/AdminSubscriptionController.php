<?php

namespace App\Http\Controllers\Api\V1\Admin\Subscription;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Subscription\AdminSubscriptionFeatureSyncRequest;
use App\Http\Requests\Api\V1\Admin\Subscription\AdminSubscriptionProductAttachRequest;
use App\Http\Requests\Api\V1\Admin\Subscription\AdminSubscriptionProductDetachRequest;
use App\Http\Requests\Api\V1\Admin\Subscription\AdminSubscriptionProductListRequest;
use App\Http\Requests\Api\V1\Admin\Subscription\AdminSubscriptionUpdateRequest;
use App\Repositories\Contracts\Api\V1\Admin\Subscription\AdminSubscriptionRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSubscriptionController extends Controller
{
  public function __construct(
    protected AdminSubscriptionRepositoryInterface $subscriptionRepository
  ) {}

  /**
   * Subscription dashboard overview.
   *
   * @return JsonResponse
   */
  public function index(): JsonResponse
  {
    $data = $this->subscriptionRepository->getDashboard();

    return response()->json([
      'success' => true,
      'message' => 'Subscription dashboard retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * List active subscribers with pagination.
   *
   * @param Request $request
   * @return JsonResponse
   */
  public function activeSubs(Request $request): JsonResponse
  {
    $page = (int) $request->input('page', 1);
    $perPage = (int) $request->input('per_page', 10);

    $data = $this->subscriptionRepository->getActiveSubscribers($page, $perPage);

    return response()->json([
      'success' => true,
      'message' => 'Subscription users retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Update subscription plan.
   *
   * @param AdminSubscriptionUpdateRequest $request
   * @param int $subscriptionId
   * @return JsonResponse
   */
  public function update(AdminSubscriptionUpdateRequest $request, int $subscriptionId): JsonResponse
  {
    $plan = $this->subscriptionRepository->updatePlan($subscriptionId, $request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Subscription plan updated successfully',
      'data'    => [
        'id'              => $plan->id,
        'name'            => $plan->name,
        'price'           => (int) $plan->price,
        'duration_months' => (int) ($plan->duration_months ?: max(1, (int) round($plan->duration_days / 30))),
        'updated_at'      => $plan->updated_at ? $plan->updated_at->toIso8601String() : null,
      ],
    ]);
  }

  /**
   * Get benefits of a subscription plan.
   *
   * @param int $subscriptionId
   * @return JsonResponse
   */
  public function features(int $subscriptionId): JsonResponse
  {
    $data = $this->subscriptionRepository->getPlanFeatures($subscriptionId);

    return response()->json([
      'success' => true,
      'message' => 'Subscription dashboard retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Sync/update benefits of a subscription plan.
   *
   * @param AdminSubscriptionFeatureSyncRequest $request
   * @param int $subscriptionId
   * @return JsonResponse
   */
  public function syncFeatures(AdminSubscriptionFeatureSyncRequest $request, int $subscriptionId): JsonResponse
  {
    $data = $this->subscriptionRepository->syncPlanFeatures($subscriptionId, $request->validated('benefits'));

    return response()->json([
      'success' => true,
      'message' => 'Subscription benefits updated successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Delete a benefit from a subscription plan.
   *
   * @param int $subscriptionId
   * @param int $featureId
   * @return JsonResponse
   */
  public function deleteFeature(int $subscriptionId, int $featureId): JsonResponse
  {
    $data = $this->subscriptionRepository->deletePlanFeature($subscriptionId, $featureId);

    return response()->json([
      'success' => true,
      'message' => 'Subscription benefit deleted successfully',
      'data'    => $data,
    ]);
  }

  /**
   * List games included in subscription.
   *
   * @param AdminSubscriptionProductListRequest $request
   * @return JsonResponse
   */
  public function products(AdminSubscriptionProductListRequest $request): JsonResponse
  {
    $data = $this->subscriptionRepository->getSubscriptionProducts($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Subscription games retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Add games to subscription.
   *
   * @param AdminSubscriptionProductAttachRequest $request
   * @return JsonResponse
   */
  public function addProducts(AdminSubscriptionProductAttachRequest $request): JsonResponse
  {
    $data = $this->subscriptionRepository->addSubscriptionProducts($request->validated('product_ids'));

    return response()->json([
      'success' => true,
      'message' => 'Games added to subscription successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Remove games from subscription.
   *
   * @param AdminSubscriptionProductDetachRequest $request
   * @param int|null $productId
   * @return JsonResponse
   */
  public function removeProduct(AdminSubscriptionProductDetachRequest $request, ?int $productId = null): JsonResponse
  {
    $productIds = $request->validated('product_ids') ?? [];
    $data = $this->subscriptionRepository->removeSubscriptionProduct($productId, $productIds);

    return response()->json([
      'success' => true,
      'message' => 'Game removed from subscription successfully',
      'data'    => $data,
    ]);
  }
}

