<?php

namespace App\Http\Controllers\Api\V1\Admin\CustomSection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\CustomSection\AdminCustomSectionAllProductsRequest;
use App\Http\Requests\Api\V1\Admin\CustomSection\AdminCustomSectionProductSortRequest;
use App\Http\Requests\Api\V1\Admin\CustomSection\AdminCustomSectionProductStoreRequest;
use App\Http\Requests\Api\V1\Admin\CustomSection\AdminCustomSectionSortRequest;
use App\Http\Requests\Api\V1\Admin\CustomSection\AdminCustomSectionStoreRequest;
use App\Http\Requests\Api\V1\Admin\CustomSection\AdminCustomSectionUpdateRequest;
use App\Http\Resources\Api\V1\Admin\CustomSection\AdminCustomSectionCreatedResource;
use App\Http\Resources\Api\V1\Admin\CustomSection\AdminCustomSectionUpdatedResource;
use App\Repositories\Contracts\Api\V1\Admin\CustomSection\AdminCustomSectionRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminCustomSectionController extends Controller
{
  public function __construct(
    protected AdminCustomSectionRepositoryInterface $customSectionRepository
  ) {}

  /**
   * List all custom sections with their products.
   *
   * @return JsonResponse
   */
  public function index(): JsonResponse
  {
    $sections = $this->customSectionRepository->getSections();

    return response()->json([
      'success' => true,
      'message' => 'Custom sections retrieved successfully',
      'data'    => $sections,
    ]);
  }

  /**
   * Create a new custom section.
   *
   * @param AdminCustomSectionStoreRequest $request
   * @return JsonResponse
   */
  public function store(AdminCustomSectionStoreRequest $request): JsonResponse
  {
    $section = $this->customSectionRepository->createSection($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Product section created successfully',
      'data'    => (new AdminCustomSectionCreatedResource($section))->resolve($request),
    ], 201);
  }

  /**
   * Update an existing custom section.
   *
   * @param AdminCustomSectionUpdateRequest $request
   * @param int $sectionId
   * @return JsonResponse
   */
  public function update(AdminCustomSectionUpdateRequest $request, int $sectionId): JsonResponse
  {
    $section = $this->customSectionRepository->updateSection($sectionId, $request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Product section updated successfully',
      'data'    => (new AdminCustomSectionUpdatedResource($section))->resolve($request),
    ]);
  }

  /**
   * Delete a custom section.
   *
   * @param int $sectionId
   * @return JsonResponse
   */
  public function destroy(int $sectionId): JsonResponse
  {
    $this->customSectionRepository->deleteSection($sectionId);

    return response()->json([
      'success' => true,
      'message' => 'Product section deleted successfully',
      'data'    => null,
    ]);
  }

  /**
   * Reorder custom sections.
   *
   * @param AdminCustomSectionSortRequest $request
   * @return JsonResponse
   */
  public function sortSections(AdminCustomSectionSortRequest $request): JsonResponse
  {
    $data = $this->customSectionRepository->sortSections($request->validated('section_ids'));

    return response()->json([
      'success' => true,
      'message' => 'Product sections reordered successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Get all products to select from for section assignment.
   *
   * @param AdminCustomSectionAllProductsRequest $request
   * @return JsonResponse
   */
  public function allProducts(AdminCustomSectionAllProductsRequest $request): JsonResponse
  {
    $products = $this->customSectionRepository->getAllProducts($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Products retrieved successfully',
      'data'    => $products,
    ]);
  }

  /**
   * Add products to a section.
   *
   * @param AdminCustomSectionProductStoreRequest $request
   * @param int $sectionId
   * @return JsonResponse
   */
  public function addProducts(AdminCustomSectionProductStoreRequest $request, int $sectionId): JsonResponse
  {
    $result = $this->customSectionRepository->addProductsToSection($sectionId, $request->validated('product_ids'));

    return response()->json([
      'success' => true,
      'message' => 'Products added to section successfully',
      'data'    => $result,
    ]);
  }

  /**
   * Remove a single product from a section.
   *
   * @param int $sectionId
   * @param int $productId
   * @return JsonResponse
   */
  public function removeProduct(int $sectionId, int $productId): JsonResponse
  {
    $result = $this->customSectionRepository->removeProductFromSection($sectionId, $productId);

    return response()->json([
      'success' => true,
      'message' => 'Product removed from section successfully',
      'data'    => $result,
    ]);
  }

  /**
   * Clear all products from a section.
   *
   * @param int $sectionId
   * @return JsonResponse
   */
  public function clearProducts(int $sectionId): JsonResponse
  {
    $result = $this->customSectionRepository->clearProductsFromSection($sectionId);

    return response()->json([
      'success' => true,
      'message' => 'Product section cleared successfully',
      'data'    => $result,
    ]);
  }

  /**
   * Reorder products within a section.
   *
   * @param AdminCustomSectionProductSortRequest $request
   * @param int $sectionId
   * @return JsonResponse
   */
  public function sortProducts(AdminCustomSectionProductSortRequest $request, int $sectionId): JsonResponse
  {
    $result = $this->customSectionRepository->sortProductsInSection($sectionId, $request->validated('product_ids'));

    return response()->json([
      'success' => true,
      'message' => 'Section products reordered successfully',
      'data'    => $result,
    ]);
  }
}

