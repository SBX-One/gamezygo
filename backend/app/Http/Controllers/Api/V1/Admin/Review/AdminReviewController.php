<?php

namespace App\Http\Controllers\Api\V1\Admin\Review;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Review\AdminReviewBulkDeleteRequest;
use App\Http\Requests\Api\V1\Admin\Review\AdminReviewIndexRequest;
use App\Http\Requests\Api\V1\Admin\Review\AdminReviewReplyRequest;
use App\Http\Requests\Api\V1\Admin\Review\AdminReviewStatusRequest;
use App\Repositories\Contracts\Api\V1\Admin\Review\AdminReviewRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminReviewController extends Controller
{
  public function __construct(
    protected AdminReviewRepositoryInterface $reviewRepository
  ) {}

  /**
   * List all reviews with filters (rating, status, search, product) and sorting.
   *
   * @param AdminReviewIndexRequest $request
   * @return JsonResponse
   */
  public function index(AdminReviewIndexRequest $request): JsonResponse
  {
    $data = $this->reviewRepository->getReviews($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Reviews retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Get single review details by ID.
   *
   * @param int $id
   * @return JsonResponse
   */
  public function show(int $id): JsonResponse
  {
    $data = $this->reviewRepository->getReviewById($id);

    return response()->json([
      'success' => true,
      'message' => 'Review retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Update review status (pending, approved, rejected, archived).
   *
   * @param AdminReviewStatusRequest $request
   * @param int $id
   * @return JsonResponse
   */
  public function updateStatus(AdminReviewStatusRequest $request, int $id): JsonResponse
  {
    $data = $this->reviewRepository->updateStatus($id, $request->validated()['status']);

    return response()->json([
      'success' => true,
      'message' => 'Review status updated successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Reply to a review as administrator.
   *
   * @param AdminReviewReplyRequest $request
   * @param int $id
   * @return JsonResponse
   */
  public function reply(AdminReviewReplyRequest $request, int $id): JsonResponse
  {
    $adminId = auth('admin')->id();
    $data = $this->reviewRepository->replyToReview($id, $request->validated()['message'], $adminId);

    return response()->json([
      'success' => true,
      'message' => 'Review reply posted successfully',
      'data'    => $data,
    ], 201);
  }

  /**
   * Delete a single review by ID.
   *
   * @param int $id
   * @return JsonResponse
   */
  public function destroy(int $id): JsonResponse
  {
    $this->reviewRepository->deleteReview($id);

    return response()->json([
      'success' => true,
      'message' => 'Review deleted successfully',
      'data'    => null,
    ]);
  }

  /**
   * Bulk delete reviews by IDs.
   *
   * @param AdminReviewBulkDeleteRequest $request
   * @return JsonResponse
   */
  public function bulkDestroy(AdminReviewBulkDeleteRequest $request): JsonResponse
  {
    $count = $this->reviewRepository->bulkDeleteReviews($request->validated()['review_ids']);

    return response()->json([
      'success' => true,
      'message' => "Successfully deleted {$count} reviews",
      'data'    => [
        'deleted_count' => $count,
      ],
    ]);
  }
}

