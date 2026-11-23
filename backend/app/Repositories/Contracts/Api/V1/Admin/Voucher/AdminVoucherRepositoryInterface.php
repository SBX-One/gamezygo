<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Voucher;

interface AdminVoucherRepositoryInterface
{
    /**
     * Get paginated vouchers with filters and meta.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getVouchers(array $filters): array;

    /**
     * Create a new voucher.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createVoucher(array $data): array;

    /**
     * Get single voucher detail with products and users.
     *
     * @return array<string, mixed>
     */
    public function getVoucherById(int $id): array;

    /**
     * Update voucher by ID.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateVoucher(int $id, array $data): array;

    /**
     * Update voucher active status.
     *
     * @return array<string, mixed>
     */
    public function updateStatus(int $id, bool $isActive): array;

    /**
     * Bulk delete vouchers by IDs.
     *
     * @param  array<int>  $ids
     * @return array<string, mixed>
     */
    public function deleteVouchers(array $ids): array;

    /**
     * Get voucher analytics and chart.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getAnalytics(int $id, array $filters): array;

    /**
     * Get voucher usage orders history with pagination.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getUsages(int $id, array $filters): array;

    /**
     * Search and get eligible products for voucher targeting.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getEligibleProducts(array $filters): array;

    /**
     * Search and get eligible users for voucher targeting.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getEligibleUsers(array $filters): array;

    /**
     * Export vouchers as CSV string.
     *
     * @param  array<string, mixed>  $filters
     */
    public function exportVouchersCsv(array $filters): string;

    /**
     * Export voucher usages as CSV string.
     *
     * @param  array<string, mixed>  $filters
     */
    public function exportUsagesCsv(int $id, array $filters): string;

    /**
     * Add target products to voucher.
     *
     * @param  array<int>  $productIds
     * @return array<string, mixed>
     */
    public function addProducts(int $voucherId, array $productIds): array;

    /**
     * Remove target products from voucher.
     *
     * @param  array<int>  $productIds
     * @return array<string, mixed>
     */
    public function removeProducts(int $voucherId, array $productIds): array;

    /**
     * Add target users to voucher.
     *
     * @param  array<int>  $userIds
     * @return array<string, mixed>
     */
    public function addUsers(int $voucherId, array $userIds): array;

    /**
     * Remove target users from voucher.
     *
     * @param  array<int>  $userIds
     * @return array<string, mixed>
     */
    public function removeUsers(int $voucherId, array $userIds): array;
}
