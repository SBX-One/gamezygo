<?php

namespace App\Http\Controllers\Api\V1\User\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\Order\CreateOrderRequest;
use App\Http\Resources\Api\V1\User\Order\CreateOrderResource;
use App\Http\Resources\Api\V1\User\Order\OrderDetailResource;
use App\Services\Api\V1\User\Order\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
  public function __construct(
    protected OrderService $orderService
  ) {}

  /**
   * Create a new order.
   *
   * @param CreateOrderRequest $request
   * @return JsonResponse
   */
  public function store(CreateOrderRequest $request): JsonResponse
  {
    $user = $request->user();
    $order = $this->orderService->createOrder($user, $request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Order created successfully',
      'data'    => (new CreateOrderResource($order))->resolve(),
    ], 201);
  }

  /**
   * Get order details by order ID or order code.
   *
   * @param Request $request
   * @param int|string $orderId
   * @return JsonResponse
   */
  public function show(Request $request, int|string $orderId): JsonResponse
  {
    $user = $request->user();
    $order = $this->orderService->getOrderDetails($user, $orderId);

    if (!$order) {
      return response()->json([
        'success' => false,
        'message' => 'Order not found',
        'data'    => null,
      ], 404);
    }

    return response()->json([
      'success' => true,
      'message' => 'Order retrieved successfully',
      'data'    => (new OrderDetailResource($order))->resolve(),
    ], 200);
  }
}
