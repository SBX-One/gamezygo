<?php

namespace App\Listeners;

use App\Events\OrderFulfilledEvent;
use App\Mail\OrderDeliveryMail;
use App\Models\GameCredential;
use App\Models\Product;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendOrderDeliveryEmailListener implements ShouldQueue
{
  use InteractsWithQueue;

  /**
   * Handle the event.
   */
  public function handle(OrderFulfilledEvent $event): void
  {
    $order = $event->order;
    $user = $order->user;

    if (!$user || empty($user->email)) {
      Log::warning("Order #{$order->id} fulfilled but user has no email address.");
      return;
    }

    $credentials = $event->credentials;

    // If credentials were not passed in the event payload, query them for this order
    if (empty($credentials)) {
      $itemIds = $order->items->pluck('id')->all();

      $allocatedCreds = GameCredential::whereIn('assigned_to_order_item_id', $itemIds)
        ->with('product')
        ->get();

      $credentials = $allocatedCreds->map(function (GameCredential $cred) {
        return [
          'game_title'   => $cred->product?->name ?? 'Game Account',
          'username'     => $this->safeDecrypt($cred->username),
          'password'     => $this->safeDecrypt($cred->password),
          'access_token' => $cred->access_token ? $this->safeDecrypt($cred->access_token) : null,
        ];
      })->all();
    }

    try {
      Mail::to($user->email)->send(new OrderDeliveryMail($order, $credentials));
      Log::info("Order delivery email sent successfully to {$user->email} for Order #{$order->order_code}");
    } catch (Throwable $e) {
      Log::error("Failed to send order delivery email for Order #{$order->order_code}: " . $e->getMessage(), [
        'order_id' => $order->id,
        'user_id'  => $user->id,
      ]);
    }
  }

  /**
   * Decrypt string safely.
   */
  private function safeDecrypt(?string $value): ?string
  {
    if (empty($value)) {
      return null;
    }

    try {
      return Crypt::decryptString($value);
    } catch (Throwable) {
      return $value;
    }
  }
}
