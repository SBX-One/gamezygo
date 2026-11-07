<?php

namespace App\Http\Resources\Api\V1\User\Profile;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProfileResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    $user = $this->resource['user'] ?? $this->resource;

    if ($user instanceof User) {
      $user->loadMissing('avatar');
    }

    $totalGames = $this->resource['total_games_owned'] ?? (
      $user instanceof User ? $user->ownedGames()->count() : 0
    );

    $rankings = $this->resource['rankings'] ?? [
      'weekly'   => 1,
      'monthly'  => 1,
      'all_time' => 1,
    ];

    $recentTransactions = $this->resource['recent_transactions'] ?? (
      $user instanceof User ? $user->orders()->withCount('items')->latest()->take(3)->get() : []
    );

    $avatarUrl = ($user instanceof User && $user->avatar)
      ? (filter_var($user->avatar->file_path, FILTER_VALIDATE_URL) ? $user->avatar->file_path : Storage::disk('public')->url($user->avatar->file_path))
      : ($user->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($user->name ?? 'User'));

    return [
      'id'                  => $user->id,
      'name'                => $user->name,
      'email'               => $user->email,
      'phone'               => $user->phone,
      'avatar'              => ($user instanceof User && $user->avatar) ? [
        'id'        => $user->avatar->id,
        'file_name' => $user->avatar->file_name,
        'file_type' => $user->avatar->file_type,
        'file_size' => (int) $user->avatar->file_size,
        'url'       => filter_var($user->avatar->file_path, FILTER_VALIDATE_URL) ? $user->avatar->file_path : Storage::disk('public')->url($user->avatar->file_path),
      ] : null,
      'avatar_url'          => $avatarUrl,
      'status'              => $user->status,
      'joined_at'           => $user->created_at,
      'total_transaction'   => (int) ($user->total_transaction ?? 0),
      'total_points'        => (int) ($user->total_points ?? 0),
      'total_games_owned'   => (int) $totalGames,
      'rankings'            => [
        'weekly'   => (int) ($rankings['weekly'] ?? 1),
        'monthly'  => (int) ($rankings['monthly'] ?? 1),
        'all_time' => (int) ($rankings['all_time'] ?? 1),
      ],
      'recent_transactions' => collect($recentTransactions)->map(function ($order) {
        return [
          'id'              => $order->id,
          'order_code'      => $order->order_code,
          'subtotal_price'  => (int) $order->subtotal_price,
          'discount_amount' => (int) ($order->discount_amount ?? 0),
          'total_price'     => (int) $order->total_price,
          'status'          => $order->status,
          'paid_at'         => $order->paid_at,
          'created_at'      => $order->created_at,
          'total_items'     => (int) ($order->items_count ?? ($order->relationLoaded('items') ? $order->items->count() : 0)),
        ];
      })->values(),
    ];
  }
}
