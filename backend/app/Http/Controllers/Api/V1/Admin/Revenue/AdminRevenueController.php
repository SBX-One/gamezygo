<?php

namespace App\Http\Controllers\Api\V1\Admin\Revenue;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Revenue\AdminRevenueIndexRequest;
use App\Http\Resources\Api\V1\Admin\Revenue\AdminRevenueProductResource;
use App\Http\Resources\Api\V1\Admin\Revenue\AdminRevenueResource;
use App\Repositories\Contracts\Api\V1\Admin\Revenue\AdminRevenueRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminRevenueController extends Controller
{
  public function __construct(
    protected AdminRevenueRepositoryInterface $revenueRepository
  ) {}

  /**
   * Get revenue dashboard analytics.
   *
   * @param AdminRevenueIndexRequest $request
   * @return JsonResponse
   */
  public function index(AdminRevenueIndexRequest $request): JsonResponse
  {
    $data = $this->revenueRepository->getRevenueDashboard($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Revenue dashboard data retrieved successfully',
      'data'    => (new AdminRevenueResource($data))->resolve($request),
    ]);
  }

  /**
   * Get revenue metrics for a specific product.
   *
   * @param int $id
   * @return JsonResponse
   */
  public function productRevenue(int $id): JsonResponse
  {
    $data = $this->revenueRepository->getProductRevenue($id);

    return response()->json([
      'success' => true,
      'message' => 'Revenue dashboard data retrieved successfully',
      'data'    => (new AdminRevenueProductResource($data))->resolve(request()),
    ]);
  }
}

