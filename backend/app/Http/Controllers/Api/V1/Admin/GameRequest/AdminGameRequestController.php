<?php

namespace App\Http\Controllers\Api\V1\Admin\GameRequest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\GameRequest\AdminGameRequestIndexRequest;
use App\Http\Requests\Api\V1\Admin\GameRequest\AdminGameRequestStatusUpdateRequest;
use App\Repositories\Contracts\Api\V1\Admin\GameRequest\AdminGameRequestRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminGameRequestController extends Controller
{
  public function __construct(
    protected AdminGameRequestRepositoryInterface $gameRequestRepository
  ) {}

  /**
   * List game requests with pinned and requested games.
   *
   * @param AdminGameRequestIndexRequest $request
   * @return JsonResponse
   */
  public function index(AdminGameRequestIndexRequest $request): JsonResponse
  {
    $data = $this->gameRequestRepository->getGameRequests($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Game requests retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Show game request detail.
   *
   * @param int $gameRequestId
   * @return JsonResponse
   */
  public function show(int $gameRequestId): JsonResponse
  {
    $data = $this->gameRequestRepository->getGameRequestById($gameRequestId);

    return response()->json([
      'success' => true,
      'message' => 'Game request retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Toggle pin status for a game request.
   *
   * @param int $gameRequestId
   * @return JsonResponse
   */
  public function togglePin(int $gameRequestId): JsonResponse
  {
    $result = $this->gameRequestRepository->togglePin($gameRequestId);
    $action = $result['is_pinned'] ? 'pinned' : 'unpinned';

    return response()->json([
      'success' => true,
      'message' => "Game request {$action} successfully",
      'data'    => $result['item'],
    ]);
  }

  /**
   * Bulk update status for multiple game requests.
   *
   * @param AdminGameRequestStatusUpdateRequest $request
   * @return JsonResponse
   */
  public function updateStatus(AdminGameRequestStatusUpdateRequest $request): JsonResponse
  {
    $validated = $request->validated();
    $data = $this->gameRequestRepository->updateStatus($validated['request_ids'], $validated['status']);
    $statusText = strtolower($validated['status']);

    return response()->json([
      'success' => true,
      'message' => "Game requests {$statusText} successfully",
      'data'    => $data,
    ]);
  }
}

