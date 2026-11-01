<?php

namespace App\Repositories\Api\V1\User\Payment;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscription;
use App\Repositories\Contracts\Api\V1\User\Payment\PaymentRepositoryInterface;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\DB;

class PaymentRepository implements PaymentRepositoryInterface
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
  ): Payment {
    return Payment::updateOrCreate(
      ['order_id' => $order->id],
      [
        'payment_method'    => $paymentMethod,
        'gateway_reference' => $gatewayReference,
        'amount'            => $amount,
        'status'            => 'pending',
        'expired_at'        => $expiredAt,
        'paid_at'           => null,
      ]
    );
  }

  /**
   * Find payment by gateway reference or ID belonging to a user.
   *
   * @param User $user
   * @param string $reference
   * @return Payment|null
   */
  public function findPaymentByReference(User $user, string $reference): ?Payment
  {
    return Payment::whereHas('order', function ($query) use ($user) {
      $query->where('user_id', $user->id);
    })->where(function ($query) use ($reference) {
      $query->where('gateway_reference', $reference);
      if (is_numeric($reference)) {
        $query->orWhere('id', (int) $reference);
      }
    })->first();
  }

  /**
   * Find order by gateway reference or order code/id belonging to a user.
   *
   * @param User $user
   * @param string $reference
   * @return Order|null
   */
  public function findOrderByReference(User $user, string $reference): ?Order
  {
    return Order::where('user_id', $user->id)
      ->where(function ($query) use ($reference) {
        $query->where('order_code', $reference)
          ->orWhereHas('payment', function ($pQuery) use ($reference) {
            $pQuery->where('gateway_reference', $reference);
          });

        if (is_numeric($reference)) {
          $query->orWhere('id', (int) $reference)
            ->orWhereHas('payment', function ($pQuery) use ($reference) {
              $pQuery->where('id', (int) $reference);
            });
        }
      })
      ->with([
        'items.purchasable' => function (MorphTo $morphTo) {
          $morphTo->morphWith([
            Product::class => ['files'],
          ]);
        },
        'payment',
      ])
      ->first();
  }

  /**
   * Fulfill order upon successful payment confirmation.
   *
   * @param Payment $payment
   * @return Order
   */
  public function fulfillOrder(Payment $payment): Order
  {
    return DB::transaction(function () use ($payment) {
      $now = now();

      $payment->update([
        'status'  => 'success',
        'paid_at' => $now,
      ]);

      $order = $payment->order;
      $order->update([
        'status'  => 'paid',
        'paid_at' => $now,
      ]);

      // Increment voucher usage if applied
      if ($order->voucher_id) {
        $order->voucher()->increment('total_usage');
      }

      // Deliver games or activate subscription
      foreach ($order->items as $item) {
        if ($item->purchasable instanceof Product) {
          $order->user->ownedGames()->syncWithoutDetaching([$item->purchasable_id]);
        } elseif ($item->purchasable instanceof SubscriptionPlan) {
          $plan = $item->purchasable;

          // Extend if user has an existing active subscription, else start from now
          $latestActiveSub = UserSubscription::where('user_id', $order->user_id)
            ->where('status', 'active')
            ->where('expired_at', '>', $now)
            ->orderByDesc('expired_at')
            ->first();

          $startedAt = $latestActiveSub ? $latestActiveSub->expired_at : $now;
          $expiredAt = $startedAt->copy()->addDays($plan->duration_days);

          UserSubscription::create([
            'user_id'              => $order->user_id,
            'subscription_plan_id' => $plan->id,
            'order_item_id'        => $item->id,
            'started_at'           => $startedAt,
            'expired_at'           => $expiredAt,
            'status'               => 'active',
          ]);
        }
      }

      return $order->fresh([
        'items.purchasable' => function (MorphTo $morphTo) {
          $morphTo->morphWith([
            Product::class => ['files'],
          ]);
        },
        'payment',
      ]);
    });
  }
}
