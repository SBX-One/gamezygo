<?php

namespace App\Http\Controllers\Api\V1\Admin\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Category\AdminBlogSubCategoryIndexRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminBlogSubCategoryStoreRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminBlogSubCategoryUpdateRequest;
use App\Repositories\Contracts\Api\V1\Admin\Category\AdminBlogCategoryRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminBlogSubCategoryController extends Controller
{
  public function __construct(
    protected AdminBlogCategoryRepositoryInterface $categoryRepository
  ) {}

  /**
   * List all blog sub-categories (with optional category_id filter).
   *
   * @param AdminBlogSubCategoryIndexRequest $request
   * @return JsonResponse
   */
  public function index(AdminBlogSubCategoryIndexRequest $request): JsonResponse
  {
    $data = $this->categoryRepository->getSubCategories($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Blog sub-categories retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Get single blog sub-category details.
   *
   * @param int $id
   * @return JsonResponse
   */
  public function show(int $id): JsonResponse
  {
    $data = $this->categoryRepository->getSubCategoryById($id);

    return response()->json([
      'success' => true,
      'message' => 'Blog sub-category retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Create a new blog sub-category.
   *
   * @param AdminBlogSubCategoryStoreRequest $request
   * @return JsonResponse
   */
  public function store(AdminBlogSubCategoryStoreRequest $request): JsonResponse
  {
    $data = $this->categoryRepository->createSubCategory($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Blog sub-category created successfully',
      'data'    => $data,
    ], 201);
  }

  /**
   * Update an existing blog sub-category.
   *
   * @param AdminBlogSubCategoryUpdateRequest $request
   * @param int $id
   * @return JsonResponse
   */
  public function update(AdminBlogSubCategoryUpdateRequest $request, int $id): JsonResponse
  {
    $data = $this->categoryRepository->updateSubCategory($id, $request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Blog sub-category updated successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Delete a blog sub-category.
   *
   * @param int $id
   * @return JsonResponse
   */
  public function destroy(int $id): JsonResponse
  {
    $this->categoryRepository->deleteSubCategory($id);

    return response()->json([
      'success' => true,
      'message' => 'Blog sub-category deleted successfully',
      'data'    => null,
    ]);
  }
}

