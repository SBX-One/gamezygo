<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Faq;

interface AdminFaqRepositoryInterface
{
    /**
     * Get paginated FAQs with filters.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getFaqs(array $filters): array;

    /**
     * Get single FAQ by ID.
     *
     * @return array<string, mixed>
     */
    public function getFaqById(int $id): array;

    /**
     * Create a new FAQ.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createFaq(array $data): array;

    /**
     * Update FAQ by ID.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateFaq(int $id, array $data): array;

    /**
     * Update active status of FAQ.
     *
     * @return array<string, mixed>
     */
    public function updateStatus(int $id, bool $isActive): array;

    /**
     * Reorder multiple FAQs.
     *
     * @param  array<int, array{id: int, order_number: int}>  $orders
     */
    public function reorderFaqs(array $orders): void;

    /**
     * Delete FAQ by ID.
     */
    public function deleteFaq(int $id): void;

    /**
     * Bulk delete FAQs by IDs.
     *
     * @param  array<int>  $ids
     */
    public function deleteFaqs(array $ids): int;

    /**
     * Get list of distinct/available page placements.
     *
     * @return array<string>
     */
    public function getAvailablePages(): array;
}
