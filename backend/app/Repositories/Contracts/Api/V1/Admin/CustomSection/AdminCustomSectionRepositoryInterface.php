<?php

namespace App\Repositories\Contracts\Api\V1\Admin\CustomSection;

use App\Models\CustomSection;
use Illuminate\Support\Collection;

interface AdminCustomSectionRepositoryInterface
{
    /**
     * Get all custom sections with their products.
     */
    public function getSections(): Collection;

    /**
     * Create a new custom section.
     *
     * @param  array<string, mixed>  $data
     */
    public function createSection(array $data): CustomSection;

    /**
     * Update an existing custom section.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateSection(int $id, array $data): CustomSection;

    /**
     * Delete a custom section.
     */
    public function deleteSection(int $id): bool;

    /**
     * Reorder custom sections.
     *
     * @param  array<int>  $sectionIds
     * @return array<int, array{id: int, sort_order: int}>
     */
    public function sortSections(array $sectionIds): array;

    /**
     * Get filtered products list for section selection.
     *
     * @param  array<string, mixed>  $filters
     * @return array<int, array<string, mixed>>
     */
    public function getAllProducts(array $filters): array;

    /**
     * Add products to a section.
     *
     * @param  array<int>  $productIds
     * @return array<string, mixed>
     */
    public function addProductsToSection(int $sectionId, array $productIds): array;

    /**
     * Remove a single product from a section.
     *
     * @return array<string, mixed>
     */
    public function removeProductFromSection(int $sectionId, int $productId): array;

    /**
     * Clear all products from a section.
     *
     * @return array<string, mixed>
     */
    public function clearProductsFromSection(int $sectionId): array;

    /**
     * Reorder products within a section.
     *
     * @param  array<int>  $productIds
     * @return array<string, mixed>
     */
    public function sortProductsInSection(int $sectionId, array $productIds): array;
}
