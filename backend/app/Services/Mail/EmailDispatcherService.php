<?php

namespace App\Services\Mail;

use App\Events\OrderFulfilledEvent;
use App\Mail\OrderDeliveryMail;
use App\Models\GameCredential;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class EmailDispatcherService
{
  /**
   * Dispatch order delivery email asynchronously through Redis Queue.
   *
   * @param Order $order
   * @param array<int, array<string, mixed>> $credentials
   * @return bool
   */
  public function dispatchOrderDelivery(Order $order, array $credentials = []): bool
  {
    try {
      event(new OrderFulfilledEvent($order, $credentials));
      return true;
    } catch (Throwable $e) {
      Log::error("EmailDispatcherService failed to dispatch OrderFulfilledEvent: " . $e->getMessage(), [
        'order_id' => $order->id,
      ]);
      return false;
    }
  }

  /**
   * Send order delivery email directly (synchronously or queued depending on mailer).
   *
   * @param Order $order
   * @param array<int, array<string, mixed>> $credentials
   * @return bool
   */
  public function sendOrderDeliveryNow(Order $order, array $credentials = []): bool
  {
    $user = $order->user;
    if (!$user || empty($user->email)) {
      return false;
    }

    try {
      Mail::to($user->email)->send(new OrderDeliveryMail($order, $credentials));
      return true;
    } catch (Throwable $e) {
      Log::error("EmailDispatcherService failed to send email directly: " . $e->getMessage(), [
        'order_id' => $order->id,
      ]);
      return false;
    }
  }
}
