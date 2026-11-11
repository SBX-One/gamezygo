<?php

namespace App\Http\Controllers\Api\V1\Admin\Faq;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Faq\AdminFaqBulkDeleteRequest;
use App\Http\Requests\Api\V1\Admin\Faq\AdminFaqIndexRequest;
use App\Http\Requests\Api\V1\Admin\Faq\AdminFaqSortRequest;
use App\Http\Requests\Api\V1\Admin\Faq\AdminFaqStatusRequest;
use App\Http\Requests\Api\V1\Admin\Faq\AdminFaqStoreRequest;
use App\Http\Requests\Api\V1\Admin\Faq\AdminFaqUpdateRequest;
use App\Repositories\Contracts\Api\V1\Admin\Faq\AdminFaqRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminFaqController extends Controller
{
  public function __construct(
    protected AdminFaqRepositoryInterface $faqRepository
  ) {}

  /**
   * List FAQs with search, page filter, and pagination.
   *
   * @param AdminFaqIndexRequest $request
   * @return JsonResponse
   */
  public function index(AdminFaqIndexRequest $request): JsonResponse
  {
    $data = $this->faqRepository->getFaqs($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'FAQs retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Get available page placements for FAQs.
   *
   * @return JsonResponse
   */
  public function pages(): JsonResponse
  {
    $data = $this->faqRepository->getAvailablePages();

    return response()->json([
      'success' => true,
      'message' => 'FAQ pages retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Show single FAQ details.
   *
   * @param int $faqId
   * @return JsonResponse
   */
  public function show(int $faqId): JsonResponse
  {
    $data = $this->faqRepository->getFaqById($faqId);

    return response()->json([
      'success' => true,
      'message' => 'FAQ retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Create a new FAQ.
   *
   * @param AdminFaqStoreRequest $request
   * @return JsonResponse
   */
  public function store(AdminFaqStoreRequest $request): JsonResponse
  {
    $data = $this->faqRepository->createFaq($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'FAQ created successfully',
      'data'    => $data,
    ], 201);
  }

  /**
   * Update FAQ by ID.
   *
   * @param AdminFaqUpdateRequest $request
   * @param int $faqId
   * @return JsonResponse
   */
  public function update(AdminFaqUpdateRequest $request, int $faqId): JsonResponse
  {
    $data = $this->faqRepository->updateFaq($faqId, $request->validated());

    return response()->json([
      'success' => true,
      'message' => 'FAQ updated successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Update active status of FAQ.
   *
   * @param AdminFaqStatusRequest $request
   * @param int $faqId
   * @return JsonResponse
   */
  public function status(AdminFaqStatusRequest $request, int $faqId): JsonResponse
  {
    $isActive = (bool) $request->validated('is_active');
    $data = $this->faqRepository->updateStatus($faqId, $isActive);
    $actionText = $isActive ? 'activated' : 'deactivated';

    return response()->json([
      'success' => true,
      'message' => "FAQ {$actionText} successfully",
      'data'    => $data,
    ]);
  }

  /**
   * Reorder multiple FAQs.
   *
   * @param AdminFaqSortRequest $request
   * @return JsonResponse
   */
  public function sort(AdminFaqSortRequest $request): JsonResponse
  {
    $this->faqRepository->reorderFaqs($request->validated('orders'));

    return response()->json([
      'success' => true,
      'message' => 'FAQ order updated successfully',
      'data'    => null,
    ]);
  }

  /**
   * Delete single FAQ or bulk delete.
   *
   * @param AdminFaqBulkDeleteRequest $request
   * @param int|null $faqId
   * @return JsonResponse
   */
  public function destroy(AdminFaqBulkDeleteRequest $request, ?int $faqId = null): JsonResponse
  {
    if ($faqId) {
      $this->faqRepository->deleteFaq($faqId);
    } elseif ($request->filled('ids')) {
      $this->faqRepository->deleteFaqs($request->validated('ids'));
    }

    return response()->json([
      'success' => true,
      'message' => 'FAQ deleted successfully',
      'data'    => null,
    ]);
  }
}

