<?php

namespace App\Http\Controllers\Api\V1\Admin\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Dashboard\AdminDashboardRequest;
use App\Http\Requests\Api\V1\Admin\Dashboard\AdminRecentTransactionsRequest;
use App\Http\Resources\Api\V1\Admin\Dashboard\AdminDashboardResource;
use App\Http\Resources\Api\V1\Admin\Dashboard\AdminRecentTransactionsResource;
use App\Services\Api\V1\Admin\Dashboard\AdminDashboardService;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
  public function __construct(
    protected AdminDashboardService $adminDashboardService
  ) {
  }

  /**
   * Retrieve aggregated admin dashboard analytics.
   *
   * @param AdminDashboardRequest $request
   * @return JsonResponse
   */
  public function index(AdminDashboardRequest $request): JsonResponse
  {
    $period = (string) $request->input('period', 'today');
    $data = $this->adminDashboardService->getDashboardData($period);

    return response()->json([
      'success' => true,
      'message' => 'Dashboard data retrieved successfully',
      'data'    => (new AdminDashboardResource($data))->resolve(),
    ]);
  }

  /**
   * Retrieve revenue dashboard recent transactions and metrics.
   *
   * @param AdminRecentTransactionsRequest $request
   * @return JsonResponse
   */
  public function recentTransactions(AdminRecentTransactionsRequest $request): JsonResponse
  {
    $limit = (int) $request->input('limit', 10);
    $data = $this->adminDashboardService->getRevenueTransactionsData($limit);

    return response()->json([
      'success' => true,
      'message' => 'Revenue dashboard data retrieved successfully',
      'data'    => (new AdminRecentTransactionsResource($data))->resolve(),
    ]);
  }
}

