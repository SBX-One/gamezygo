<?php

namespace App\Http\Controllers\Api\V1\User\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\Payment\PayOrderRequest;
use App\Http\Resources\Api\V1\User\Order\OrderDetailResource;
use App\Http\Resources\Api\V1\User\Payment\PaymentResource;
use App\Services\Api\V1\User\Payment\PaymentService;
use DomainException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
  public function __construct(
    protected PaymentService $paymentService
  ) {}

  /**
   * Process payment for an order.
   *
   * @param PayOrderRequest $request
   * @param int|string $orderId
   * @return JsonResponse
   */
  public function pay(PayOrderRequest $request, int|string $orderId): JsonResponse
  {
    $user = $request->user();
    $paymentMethod = $request->validated('payment_method');

    try {
      $result = $this->paymentService->processPayment($user, $orderId, $paymentMethod);
      $payment = $result['payment'];
      $gateway = $result['gateway'];

      return response()->json([
        'success' => true,
        'message' => 'Payment created successfully',
        'data'    => (new PaymentResource($payment, $gateway))->resolve(),
      ], 200);
    } catch (ModelNotFoundException) {
      return response()->json([
        'success' => false,
        'message' => 'Order not found',
        'data'    => null,
      ], 404);
    } catch (DomainException $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage(),
        'data'    => null,
      ], 422);
    }
  }

  /**
   * Check payment status by payment reference or order code.
   *
   * @param Request $request
   * @param string|null $reference
   * @return JsonResponse
   */
  public function status(Request $request, ?string $reference = null): JsonResponse
  {
    $user = $request->user();
    $targetReference = $reference ?? $request->query('references') ?? $request->query('reference');

    if (!$targetReference) {
      return response()->json([
        'success' => false,
        'message' => 'Payment reference is required',
        'data'    => null,
      ], 422);
    }

    try {
      $order = $this->paymentService->getPaymentStatus($user, $targetReference);

      return response()->json([
        'success' => true,
        'message' => 'Order retrieved successfully',
        'data'    => (new OrderDetailResource($order))->resolve(),
      ], 200);
    } catch (ModelNotFoundException) {
      return response()->json([
        'success' => false,
        'message' => 'Order not found',
        'data'    => null,
      ], 404);
    }
  }
}
