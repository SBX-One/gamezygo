<?php

namespace App\Http\Controllers\Api\V1\Admin\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Category\AdminProductSubCategoryIndexRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminProductSubCategoryStoreRequest;
use App\Http\Requests\Api\V1\Admin\Category\AdminProductSubCategoryUpdateRequest;
use App\Repositories\Contracts\Api\V1\Admin\Category\AdminProductCategoryRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminProductSubCategoryController extends Controller
{
    public function __construct(
        protected AdminProductCategoryRepositoryInterface $categoryRepository
    ) {}

    /**
     * List all product sub-categories (with optional category_id filter).
     */
    public function index(AdminProductSubCategoryIndexRequest $request): JsonResponse
    {
        $data = $this->categoryRepository->getSubCategories($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Product sub-categories retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Get single product sub-category details.
     */
    public function show(int $id): JsonResponse
    {
        $data = $this->categoryRepository->getSubCategoryById($id);

        return response()->json([
            'success' => true,
            'message' => 'Product sub-category retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Create a new product sub-category.
     */
    public function store(AdminProductSubCategoryStoreRequest $request): JsonResponse
    {
        $data = $this->categoryRepository->createSubCategory($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Product sub-category created successfully',
            'data' => $data,
        ], 201);
    }

    /**
     * Update an existing product sub-category.
     */
    public function update(AdminProductSubCategoryUpdateRequest $request, int $id): JsonResponse
    {
        $data = $this->categoryRepository->updateSubCategory($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Product sub-category updated successfully',
            'data' => $data,
        ]);
    }

    /**
     * Delete a product sub-category.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->categoryRepository->deleteSubCategory($id);

        return response()->json([
            'success' => true,
            'message' => 'Product sub-category deleted successfully',
            'data' => null,
        ]);
    }
}
