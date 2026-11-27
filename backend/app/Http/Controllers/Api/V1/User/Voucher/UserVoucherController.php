<?php

namespace App\Http\Controllers\Api\V1\User\Voucher;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserVoucherController extends Controller
{
  /**
   * Get available vouchers for authenticated user.
   */
  public function index(Request $request): JsonResponse
  {
    $user = $request->user();
    $now = now();

    $vouchers = Voucher::query()
      ->where('is_active', true)
      ->where(function ($q) use ($now) {
        $q->whereNull('started_at')->orWhere('started_at', '<=', $now);
      })
      ->where(function ($q) use ($now) {
        $q->whereNull('expired_at')->orWhere('expired_at', '>=', $now);
      })
      ->where(function ($q) use ($user) {
        $q->where('target_type', 'all_users')
          ->orWhere(function ($sq) use ($user) {
            $sq->where('target_type', 'specific_users')
              ->whereHas('users', function ($uq) use ($user) {
                $uq->where('users.id', $user->id);
              });
          });
      })
      ->latest()
      ->get()
      ->map(function (Voucher $voucher) {
        return [
          'id'             => $voucher->id,
          'name'           => $voucher->name,
          'code'           => $voucher->code,
          'discount_type'  => $voucher->normalized_discount_type,
          'discount_value' => $voucher->discount_val,
          'discount_label' => $voucher->discount_label,
          'max_discount'   => (int) $voucher->max_discount,
          'min_purchase'   => (int) $voucher->min_purchase,
          'expired_at'     => $voucher->expired_at?->toISOString(),
          'is_active'      => (bool) $voucher->is_active,
        ];
      });

    return response()->json([
      'success' => true,
      'message' => 'Vouchers retrieved successfully',
      'data'    => $vouchers,
    ], 200);
  }
}
