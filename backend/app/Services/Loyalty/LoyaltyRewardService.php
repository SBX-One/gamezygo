<?php

namespace App\Services\Loyalty;

use App\Models\User;
use App\Models\Voucher;
use Illuminate\Support\Str;

class LoyaltyRewardService
{
  public const POINT_THRESHOLD = 100;

  /**
   * Check if user reached point threshold and generate automatic loyalty reward voucher.
   */
  public function checkAndGenerateRewardVoucher(User $user, int $oldPoints, int $newPoints): ?Voucher
  {
    $oldThresholds = intdiv(max(0, $oldPoints), self::POINT_THRESHOLD);
    $newThresholds = intdiv(max(0, $newPoints), self::POINT_THRESHOLD);

    if ($newThresholds > $oldThresholds) {
      $vouchersToCreate = $newThresholds - $oldThresholds;
      $lastVoucher = null;

      for ($i = 0; $i < $vouchersToCreate; $i++) {
        $lastVoucher = $this->generateRewardVoucher($user);
      }

      return $lastVoucher;
    }

    return null;
  }

  /**
   * Generate an automated loyalty reward voucher for the user.
   */
  public function generateRewardVoucher(User $user): Voucher
  {
    $code = 'LOYALTY100-' . $user->id . '-' . strtoupper(Str::random(5));

    $voucher = Voucher::create([
      'name'                 => 'Loyalty Reward 100 Poin',
      'code'                 => $code,
      'discount_type'        => 'fixed',
      'discount_amount'      => 50000,
      'discount_value'       => 50000,
      'max_discount'         => 50000,
      'min_purchase'         => 0,
      'applies_to'           => 'all',
      'target_type'          => 'specific_users',
      'product_scope'        => 'all_products',
      'slot'                 => 1,
      'usage_limit_per_user' => 1,
      'total_usage'          => 0,
      'is_active'            => true,
      'status'               => 'active',
      'started_at'           => now(),
      'expired_at'           => now()->addDays(30),
    ]);

    $voucher->users()->syncWithoutDetaching([$user->id]);

    return $voucher;
  }
}
