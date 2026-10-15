<?php

namespace App\Services\Api\V1\User\Payment;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Order\OrderRepositoryInterface;
use App\Repositories\Contracts\Api\V1\User\Payment\PaymentRepositoryInterface;
use App\Services\Midtrans\MidtransService;
use DomainException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PaymentService
{
  public function __construct(
    protected PaymentRepositoryInterface $paymentRepository,
    protected OrderRepositoryInterface $orderRepository,
    protected MidtransService $midtransService
  ) {}

  /**
   * Process payment creation for an order.
   *
   * @param User $user
   * @param int|string $orderIdentifier
   * @param string $paymentMethod
   * @return array
   * @throws ModelNotFoundException
   * @throws DomainException
   */
  public function processPayment(User $user, int|string $orderIdentifier, string $paymentMethod): array
  {
    $order = $this->orderRepository->findUserOrder($user, $orderIdentifier);

    if (!$order) {
      throw new ModelNotFoundException('Order not found.');
    }

    if ($order->status === 'paid') {
      throw new DomainException('Order has already been paid.');
    }

    if ($order->status === 'expired' || ($order->expired_at && now()->gt($order->expired_at))) {
      if ($order->status !== 'expired') {
        $order->update(['status' => 'expired']);
      }
      throw new DomainException('Order has expired.');
    }

    if (in_array($order->status, ['cancelled', 'failed', 'refunded'], true)) {
      throw new DomainException("Cannot pay for a {$order->status} order.");
    }

    $dateString = now()->format('Ymd');
    $latestPayment = Payment::where('gateway_reference', 'like', "TRX-{$dateString}-%")
      ->orderByDesc('id')
      ->first();

    $sequence = 1;
    if ($latestPayment && preg_match('/TRX-\d{8}-(\d+)/', $latestPayment->gateway_reference, $matches)) {
      $sequence = ((int) $matches[1]) + 1;
    }

    $gatewayReference = 'TRX-' . $dateString . '-' . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);

    while (Payment::where('gateway_reference', $gatewayReference)->exists()) {
      $sequence++;
      $gatewayReference = 'TRX-' . $dateString . '-' . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);
    }

    $paymentExpiredAt = $order->expired_at && $order->expired_at->lt(now()->addMinutes(20))
      ? $order->expired_at
      : now()->addMinutes(20);

    $payment = $this->paymentRepository->createOrUpdatePayment(
      $order,
      $paymentMethod,
      $gatewayReference,
      (int) $order->total_price,
      $paymentExpiredAt
    );

    $gatewayData = $this->midtransService->createSnapTransaction($order, $payment);

    return [
      'payment' => $payment,
      'gateway' => $gatewayData,
    ];
  }

  /**
   * Get payment status and synchronize with Midtrans.
   *
   * @param User $user
   * @param string $reference
   * @return Order
   * @throws ModelNotFoundException
   */
  public function getPaymentStatus(User $user, string $reference): Order
  {
    $order = $this->paymentRepository->findOrderByReference($user, $reference);

    if (!$order) {
      throw new ModelNotFoundException('Order not found.');
    }

    // Synchronize with Midtrans if status is still pending
    if ($order->status === 'pending' && $order->payment && $order->payment->status === 'pending') {
      $midtransStatus = $this->midtransService->checkTransactionStatus($order->payment->gateway_reference);

      if ($midtransStatus && isset($midtransStatus['transaction_status'])) {
        $txStatus = $midtransStatus['transaction_status'];
        $fraudStatus = $midtransStatus['fraud_status'] ?? null;

        if ($txStatus === 'settlement' || ($txStatus === 'capture' && $fraudStatus === 'accept')) {
          $order = $this->paymentRepository->fulfillOrder($order->payment);
        } elseif (in_array($txStatus, ['expire', 'cancel', 'deny'], true)) {
          $status = ($txStatus === 'expire') ? 'expired' : 'failed';
          $order->payment->update(['status' => $status]);
          $order->update(['status' => $status]);
        }
      }
    }

    return $order;
  }
}
