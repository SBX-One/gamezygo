<?php

namespace App\Http\Controllers\Api\V1\Admin\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Category\AdminProductCategoryIndexRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminProductCategoryStoreRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminProductCategoryUpdateRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminProductSubCategoryIndexRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminProductSubCategoryStoreRequest;
use App\Repositories\Contracts\Api\V1\Admin\Category\AdminProductCategoryRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminProductCategoryController extends Controller
{
  public function __construct(
    protected AdminProductCategoryRepositoryInterface $categoryRepository
  ) {}

  /**
   * List all product categories with their sub-categories.
   *
   * @param AdminProductCategoryIndexRequest $request
   * @return JsonResponse
   */
  public function index(AdminProductCategoryIndexRequest $request): JsonResponse
  {
    $data = $this->categoryRepository->getCategories($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Product categories retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Get single product category details with its sub-categories.
   *
   * @param int $id
   * @return JsonResponse
   */
  public function show(int $id): JsonResponse
  {
    $data = $this->categoryRepository->getCategoryById($id);

    return response()->json([
      'success' => true,
      'message' => 'Product category retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Create a new product root category.
   *
   * @param AdminProductCategoryStoreRequest $request
   * @return JsonResponse
   */
  public function store(AdminProductCategoryStoreRequest $request): JsonResponse
  {
    $data = $this->categoryRepository->createCategory($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Product category created successfully',
      'data'    => $data,
    ], 201);
  }

  /**
   * Update an existing product root category.
   *
   * @param AdminProductCategoryUpdateRequest $request
   * @param int $id
   * @return JsonResponse
   */
  public function update(AdminProductCategoryUpdateRequest $request, int $id): JsonResponse
  {
    $data = $this->categoryRepository->updateCategory($id, $request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Product category updated successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Delete a product category.
   *
   * @param int $id
   * @return JsonResponse
   */
  public function destroy(int $id): JsonResponse
  {
    $this->categoryRepository->deleteCategory($id);

    return response()->json([
      'success' => true,
      'message' => 'Product category deleted successfully',
      'data'    => null,
    ]);
  }

  /**
   * Get sub-categories for a specific product category.
   *
   * @param AdminProductSubCategoryIndexRequest $request
   * @param int $categoryId
   * @return JsonResponse
   */
  public function subCategories(AdminProductSubCategoryIndexRequest $request, int $categoryId): JsonResponse
  {
    $data = $this->categoryRepository->getSubCategories($request->validated(), $categoryId);

    return response()->json([
      'success' => true,
      'message' => 'Product sub-categories retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Create a sub-category directly under a category.
   *
   * @param AdminProductSubCategoryStoreRequest $request
   * @param int $categoryId
   * @return JsonResponse
   */
  public function storeSubCategory(AdminProductSubCategoryStoreRequest $request, int $categoryId): JsonResponse
  {
    $data = $this->categoryRepository->createSubCategory($request->validated(), $categoryId);

    return response()->json([
      'success' => true,
      'message' => 'Product sub-category created successfully',
      'data'    => $data,
    ], 201);
  }
}

