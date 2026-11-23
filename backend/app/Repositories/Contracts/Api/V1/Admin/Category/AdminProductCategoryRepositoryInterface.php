<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Category;

interface AdminProductCategoryRepositoryInterface
{
    /**
     * Get list of product categories (root) with sub-categories.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getCategories(array $filters): array;

    /**
     * Get single product category by ID with its sub-categories.
     *
     * @return array<string, mixed>
     */
    public function getCategoryById(int $id): array;

    /**
     * Create a new product root category.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createCategory(array $data): array;

    /**
     * Update an existing product root category.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateCategory(int $id, array $data): array;

    /**
     * Delete a product category.
     */
    public function deleteCategory(int $id): void;

    /**
     * Get list of product sub-categories (with parent category details).
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getSubCategories(array $filters, ?int $categoryId = null): array;

    /**
     * Get single product sub-category by ID.
     *
     * @return array<string, mixed>
     */
    public function getSubCategoryById(int $id): array;

    /**
     * Create a new product sub-category.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createSubCategory(array $data, ?int $categoryId = null): array;

    /**
     * Update an existing product sub-category.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateSubCategory(int $id, array $data): array;

    /**
     * Delete a product sub-category.
     */
    public function deleteSubCategory(int $id): void;
}
