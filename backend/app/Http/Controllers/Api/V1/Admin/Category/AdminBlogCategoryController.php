<?php

namespace App\Http\Controllers\Api\V1\Admin\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Category\AdminBlogCategoryIndexRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminBlogCategoryStoreRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminBlogCategoryUpdateRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminBlogSubCategoryIndexRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminBlogSubCategoryStoreRequest;
use App\Repositories\Contracts\Api\V1\Admin\Category\AdminBlogCategoryRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminBlogCategoryController extends Controller
{
  public function __construct(
    protected AdminBlogCategoryRepositoryInterface $categoryRepository
  ) {}

  /**
   * List all blog categories with their sub-categories.
   *
   * @param AdminBlogCategoryIndexRequest $request
   * @return JsonResponse
   */
  public function index(AdminBlogCategoryIndexRequest $request): JsonResponse
  {
    $data = $this->categoryRepository->getCategories($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Blog categories retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Get single blog category details with its sub-categories.
   *
   * @param int $id
   * @return JsonResponse
   */
  public function show(int $id): JsonResponse
  {
    $data = $this->categoryRepository->getCategoryById($id);

    return response()->json([
      'success' => true,
      'message' => 'Blog category retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Create a new blog root category.
   *
   * @param AdminBlogCategoryStoreRequest $request
   * @return JsonResponse
   */
  public function store(AdminBlogCategoryStoreRequest $request): JsonResponse
  {
    $data = $this->categoryRepository->createCategory($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Blog category created successfully',
      'data'    => $data,
    ], 201);
  }

  /**
   * Update an existing blog root category.
   *
   * @param AdminBlogCategoryUpdateRequest $request
   * @param int $id
   * @return JsonResponse
   */
  public function update(AdminBlogCategoryUpdateRequest $request, int $id): JsonResponse
  {
    $data = $this->categoryRepository->updateCategory($id, $request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Blog category updated successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Delete a blog category.
   *
   * @param int $id
   * @return JsonResponse
   */
  public function destroy(int $id): JsonResponse
  {
    $this->categoryRepository->deleteCategory($id);

    return response()->json([
      'success' => true,
      'message' => 'Blog category deleted successfully',
      'data'    => null,
    ]);
  }

  /**
   * Get sub-categories for a specific blog category.
   *
   * @param AdminBlogSubCategoryIndexRequest $request
   * @param int $categoryId
   * @return JsonResponse
   */
  public function subCategories(AdminBlogSubCategoryIndexRequest $request, int $categoryId): JsonResponse
  {
    $data = $this->categoryRepository->getSubCategories($request->validated(), $categoryId);

    return response()->json([
      'success' => true,
      'message' => 'Blog sub-categories retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Create a sub-category directly under a category.
   *
   * @param AdminBlogSubCategoryStoreRequest $request
   * @param int $categoryId
   * @return JsonResponse
   */
  public function storeSubCategory(AdminBlogSubCategoryStoreRequest $request, int $categoryId): JsonResponse
  {
    $data = $this->categoryRepository->createSubCategory($request->validated(), $categoryId);

    return response()->json([
      'success' => true,
      'message' => 'Blog sub-category created successfully',
      'data'    => $data,
    ], 201);
  }
}

