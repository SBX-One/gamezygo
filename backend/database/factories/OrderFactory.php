<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        static $sequence = 1;
        static $userIds;
        static $voucherIds;

        $userIds ??= User::pluck('id');
        $voucherIds ??= Voucher::pluck('id');

        $dateString = now()->format('Ymd');
        $orderCode  = 'ORD-' . $dateString . '-' . str_pad((string) $sequence++, 5, '0', STR_PAD_LEFT);

        $hasVoucher     = $voucherIds->isNotEmpty() && fake()->boolean(40);
        $voucherId      = $hasVoucher ? $voucherIds->random() : null;
        $subtotalPrice  = fake()->numberBetween(50000, 500000);
        $discountAmount = $hasVoucher ? fake()->numberBetween(5000, 50000) : 0;
        $totalPrice     = max(0, $subtotalPrice - $discountAmount);

        return [
            'user_id'         => $userIds->isNotEmpty() ? $userIds->random() : User::factory(),
            'order_code'      => $orderCode,
            'voucher_id'      => $voucherId,
            'subtotal_price'  => $subtotalPrice,
            'discount_amount' => $discountAmount,
            'total_price'     => $totalPrice,
            'status'          => fake()->randomElement(['pending', 'paid', 'failed', 'refunded', 'expired', 'cancelled']),
            'expired_at'      => now()->addHours(24),
            'paid_at'         => now(),
        ];
    }
}
