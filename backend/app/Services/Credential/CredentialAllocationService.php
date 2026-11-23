<?php

namespace App\Services\Credential;

use App\Models\GameCredential;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CredentialAllocationService
{
  /**
   * Concurrency Control: Reserve an available credential for a product to prevent double allocation.
   *
   * @param Product $product
   * @param User $user
   * @param OrderItem|null $orderItem
   * @param int $minutes
   * @return GameCredential|null
   */
  public function reserveCredential(
    Product $product,
    User $user,
    ?OrderItem $orderItem = null,
    int $minutes = 15
  ): ?GameCredential {
    return DB::transaction(function () use ($product, $user, $orderItem, $minutes) {
      $credential = GameCredential::where('product_id', $product->id)
        ->where('status', GameCredential::STATUS_AVAILABLE)
        ->lockForUpdate()
        ->first();

      if (!$credential) {
        return null;
      }

      $credential->update([
        'status'                    => GameCredential::STATUS_RESERVED,
        'assigned_to_user_id'       => $user->id,
        'assigned_to_order_item_id' => $orderItem?->id,
        'reserved_until'            => now()->addMinutes($minutes),
      ]);

      return $credential;
    });
  }

  /**
   * Automated Allocation: Assign and deliver a credential upon payment fulfillment.
   *
   * @param OrderItem $orderItem
   * @param User $user
   * @return GameCredential|null
   */
  public function allocateCredential(OrderItem $orderItem, User $user): ?GameCredential
  {
    return DB::transaction(function () use ($orderItem, $user) {
      // 1. Check if a credential was already reserved specifically for this order item
      $credential = GameCredential::where('assigned_to_order_item_id', $orderItem->id)
        ->lockForUpdate()
        ->first();

      // 2. If not found, look for any reserved credential for this user & product or an available one
      if (!$credential) {
        $credential = GameCredential::where('product_id', $orderItem->purchasable_id)
          ->where(function ($query) use ($user) {
            $query->where('status', GameCredential::STATUS_AVAILABLE)
              ->orWhere(function ($sub) use ($user) {
                $sub->where('status', GameCredential::STATUS_RESERVED)
                  ->where('assigned_to_user_id', $user->id);
              });
          })
          ->lockForUpdate()
          ->first();
      }

      if (!$credential) {
        Log::warning('No game credential available for allocation', [
          'product_id' => $orderItem->purchasable_id,
          'order_item' => $orderItem->id,
          'user_id'    => $user->id,
        ]);
        return null;
      }

      // 3. Mark credential as sold and permanently link to user
      $credential->update([
        'status'                    => GameCredential::STATUS_SOLD,
        'assigned_to_user_id'       => $user->id,
        'assigned_to_order_item_id' => $orderItem->id,
        'reserved_until'            => null,
      ]);

      // Ensure user owned games relationship is synced
      $user->ownedGames()->syncWithoutDetaching([$orderItem->purchasable_id]);

      return $credential;
    });
  }

  /**
   * Release reserved credentials back to available state when an order expires or is cancelled.
   *
   * @param Order $order
   * @return int Number of credentials released
   */
  public function releaseReservation(Order $order): int
  {
    $itemIds = $order->items->pluck('id')->all();

    if (empty($itemIds)) {
      return 0;
    }

    return DB::transaction(function () use ($itemIds) {
      return GameCredential::whereIn('assigned_to_order_item_id', $itemIds)
        ->where('status', GameCredential::STATUS_RESERVED)
        ->update([
          'status'                    => GameCredential::STATUS_AVAILABLE,
          'assigned_to_user_id'       => null,
          'assigned_to_order_item_id' => null,
          'reserved_until'            => null,
        ]);
    });
  }

  /**
   * Release all expired reservations across the entire system.
   *
   * @return int Number of credentials returned to stock
   */
  public function releaseExpiredReservations(): int
  {
    return DB::transaction(function () {
      return GameCredential::where('status', GameCredential::STATUS_RESERVED)
        ->where('reserved_until', '<', now())
        ->update([
          'status'                    => GameCredential::STATUS_AVAILABLE,
          'assigned_to_user_id'       => null,
          'assigned_to_order_item_id' => null,
          'reserved_until'            => null,
        ]);
    });
  }
}
