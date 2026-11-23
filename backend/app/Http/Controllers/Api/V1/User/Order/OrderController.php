<?php

namespace App\Http\Controllers\Api\V1\User\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\Order\ApplyVoucherRequest;
use App\Http\Requests\Api\V1\User\Order\CreateOrderRequest;
use App\Http\Resources\Api\V1\User\Order\CreateOrderResource;
use App\Http\Resources\Api\V1\User\Order\OrderDetailResource;
use App\Http\Resources\Api\V1\User\Order\OrderVoucherResource;
use App\Services\Api\V1\User\Order\OrderService;
use DomainException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    /**
     * Create a new order.
     */
    public function store(CreateOrderRequest $request): JsonResponse
    {
        $user = $request->user();

        try {
            $order = $this->orderService->createOrder($user, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => (new CreateOrderResource($order))->resolve(),
            ], 201);
        } catch (DomainException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
            ], 422);
        }
    }

    /**
     * Get order details by order ID or order code.
     */
    public function show(Request $request, int|string $orderId): JsonResponse
    {
        $user = $request->user();
        $order = $this->orderService->getOrderDetails($user, $orderId);

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order retrieved successfully',
            'data' => (new OrderDetailResource($order))->resolve(),
        ], 200);
    }

    /**
     * Apply voucher to an order.
     */
    public function applyVoucher(ApplyVoucherRequest $request, int|string $orderId): JsonResponse
    {
        $user = $request->user();
        $voucherCode = $request->validated('voucher_code');

        try {
            $order = $this->orderService->applyVoucher($user, $orderId, $voucherCode);

            return response()->json([
                'success' => true,
                'message' => 'Voucher applied successfully',
                'data' => (new OrderVoucherResource($order))->resolve(),
            ], 200);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'data' => null,
            ], 404);
        } catch (DomainException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
            ], 422);
        }
    }

    /**
     * Remove applied voucher from an order.
     */
    public function removeVoucher(Request $request, int|string $orderId): JsonResponse
    {
        $user = $request->user();

        try {
            $order = $this->orderService->removeVoucher($user, $orderId);

            return response()->json([
                'success' => true,
                'message' => 'Voucher removed successfully',
                'data' => (new OrderVoucherResource($order))->resolve(),
            ], 200);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'data' => null,
            ], 404);
        } catch (DomainException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
            ], 422);
        }
    }
}
