<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'success', 'failed', 'expired']);

        return [
            'payment_method'    => fake()->randomElement(['qris', 'bca_va', 'gopay', 'mandiri_va', 'shopeepay']),
            'gateway_reference' => 'TRX-' . fake()->unique()->numerify('##########'),
            'amount'            => fake()->numberBetween(10000, 500000),
            'status'            => $status,
            'paid_at'           => $status === 'success' ? now()->subMinutes(fake()->numberBetween(1, 120)) : null,
            'expired_at'        => now()->addHours(2),
        ];
    }
}
