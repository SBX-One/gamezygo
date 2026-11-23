<?php

namespace App\Http\Controllers\Api\V1\Admin\Voucher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherAnalyticsRequest;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherBulkDeleteRequest;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherEligibleRequest;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherIndexRequest;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherProductDeleteRequest;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherProductStoreRequest;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherStatusRequest;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherStoreRequest;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherUpdateRequest;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherUsageIndexRequest;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherUserDeleteRequest;
use App\Http\Requests\Api\V1\Admin\Voucher\AdminVoucherUserStoreRequest;
use App\Repositories\Contracts\Api\V1\Admin\Voucher\AdminVoucherRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AdminVoucherController extends Controller
{
    public function __construct(
        protected AdminVoucherRepositoryInterface $voucherRepository
    ) {}

    /**
     * List vouchers with filters and pagination.
     */
    public function index(AdminVoucherIndexRequest $request): JsonResponse
    {
        $data = $this->voucherRepository->getVouchers($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Vouchers retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Create a new voucher.
     */
    public function store(AdminVoucherStoreRequest $request): JsonResponse
    {
        $data = $this->voucherRepository->createVoucher($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Voucher created successfully',
            'data' => $data,
        ], 201);
    }

    /**
     * Show voucher details by ID.
     */
    public function show(int $voucherId): JsonResponse
    {
        $data = $this->voucherRepository->getVoucherById($voucherId);

        return response()->json([
            'success' => true,
            'message' => 'Voucher retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Update voucher by ID.
     */
    public function update(AdminVoucherUpdateRequest $request, int $voucherId): JsonResponse
    {
        $data = $this->voucherRepository->updateVoucher($voucherId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Voucher updated successfully',
            'data' => $data,
        ]);
    }

    /**
     * Update active status of voucher.
     */
    public function status(AdminVoucherStatusRequest $request, int $voucherId): JsonResponse
    {
        $isActive = (bool) $request->validated('is_active');
        $data = $this->voucherRepository->updateStatus($voucherId, $isActive);
        $actionText = $isActive ? 'activated' : 'deactivated';

        return response()->json([
            'success' => true,
            'message' => "Voucher {$actionText} successfully",
            'data' => $data,
        ]);
    }

    /**
     * Bulk delete vouchers.
     */
    public function destroy(AdminVoucherBulkDeleteRequest $request): JsonResponse
    {
        $data = $this->voucherRepository->deleteVouchers($request->validated('ids'));

        return response()->json([
            'success' => true,
            'message' => 'Voucher deleted successfully.',
            'data' => $data,
        ]);
    }

    /**
     * Get voucher performance analytics.
     */
    public function analytics(AdminVoucherAnalyticsRequest $request, int $voucherId): JsonResponse
    {
        $data = $this->voucherRepository->getAnalytics($voucherId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Voucher analytics retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Get voucher usage orders history.
     */
    public function usages(AdminVoucherUsageIndexRequest $request, int $voucherId): JsonResponse
    {
        $data = $this->voucherRepository->getUsages($voucherId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Voucher usage history retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Get eligible products for voucher targeting.
     */
    public function eligibleProducts(AdminVoucherEligibleRequest $request): JsonResponse
    {
        $data = $this->voucherRepository->getEligibleProducts($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Eligible products retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Get eligible users for voucher targeting.
     */
    public function eligibleUsers(AdminVoucherEligibleRequest $request): JsonResponse
    {
        $data = $this->voucherRepository->getEligibleUsers($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Eligible users retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Export vouchers as CSV download.
     */
    public function export(AdminVoucherIndexRequest $request): Response
    {
        $csv = $this->voucherRepository->exportVouchersCsv($request->validated());
        $filename = 'vouchers_export_'.now()->format('Ymd_His').'.csv';

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Export voucher usages as CSV download.
     */
    public function exportUsages(AdminVoucherUsageIndexRequest $request, int $voucherId): Response
    {
        $csv = $this->voucherRepository->exportUsagesCsv($voucherId, $request->validated());
        $filename = "voucher_{$voucherId}_usages_".now()->format('Ymd_His').'.csv';

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Add target products to voucher.
     */
    public function addProducts(AdminVoucherProductStoreRequest $request, int $voucherId): JsonResponse
    {
        $data = $this->voucherRepository->addProducts($voucherId, $request->validated('product_ids'));

        return response()->json([
            'success' => true,
            'message' => 'Voucher target products added successfully',
            'data' => $data,
        ]);
    }

    /**
     * Bulk remove target products from voucher.
     */
    public function removeProducts(AdminVoucherProductDeleteRequest $request, int $voucherId): JsonResponse
    {
        $data = $this->voucherRepository->removeProducts($voucherId, $request->validated('product_ids'));

        return response()->json([
            'success' => true,
            'message' => 'Voucher target products removed successfully',
            'data' => $data,
        ]);
    }

    /**
     * Add target users to voucher.
     */
    public function addUsers(AdminVoucherUserStoreRequest $request, int $voucherId): JsonResponse
    {
        $data = $this->voucherRepository->addUsers($voucherId, $request->validated('user_ids'));

        return response()->json([
            'success' => true,
            'message' => 'Voucher target users added successfully',
            'data' => $data,
        ]);
    }

    /**
     * Bulk remove target users from voucher.
     */
    public function removeUsers(AdminVoucherUserDeleteRequest $request, int $voucherId): JsonResponse
    {
        $data = $this->voucherRepository->removeUsers($voucherId, $request->validated('user_ids'));

        return response()->json([
            'success' => true,
            'message' => 'Voucher target users removed successfully',
            'data' => $data,
        ]);
    }
}
