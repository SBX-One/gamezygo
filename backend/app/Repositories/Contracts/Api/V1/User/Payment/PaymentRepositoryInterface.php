<?php

namespace App\Repositories\Contracts\Api\V1\User\Payment;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use DateTimeInterface;

interface PaymentRepositoryInterface
{
  /**
   * Create or update a payment record for an order.
   *
   * @param Order $order
   * @param string $paymentMethod
   * @param string $gatewayReference
   * @param int $amount
   * @param DateTimeInterface $expiredAt
   * @return Payment
   */
  public function createOrUpdatePayment(
    Order $order,
    string $paymentMethod,
    string $gatewayReference,
    int $amount,
    DateTimeInterface $expiredAt
  ): Payment;

  /**
   * Find payment by gateway reference or ID belonging to a user.
   *
   * @param User $user
   * @param string $reference
   * @return Payment|null
   */
  public function findPaymentByReference(User $user, string $reference): ?Payment;

  /**
   * Find order by gateway reference or order code/id belonging to a user.
   *
   * @param User $user
   * @param string $reference
   * @return Order|null
   */
  public function findOrderByReference(User $user, string $reference): ?Order;

  /**
   * Fulfill order upon successful payment confirmation.
   *
   * @param Payment $payment
   * @return Order
   */
  public function fulfillOrder(Payment $payment): Order;
}
