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
     */
    public function findPaymentByReference(User $user, string $reference): ?Payment;

    /**
     * Find order by gateway reference or order code/id belonging to a user.
     */
    public function findOrderByReference(User $user, string $reference): ?Order;

    /**
     * Fulfill order upon successful payment confirmation.
     */
    public function fulfillOrder(Payment $payment): Order;
}
