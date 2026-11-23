<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Voucher>
 */
class VoucherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Voucher '.fake()->name(),
            'code' => fake()->unique()->bothify('VOUCHER-????-####'),
            'discount_type' => fake()->randomElement(['percentage', 'fixed']),
            'discount_amount' => fake()->numberBetween(1, 100),
            'max_discount' => fake()->numberBetween(1, 1000),
            'min_purchase' => fake()->numberBetween(1, 1000),
            'applies_to' => fake()->randomElement(['all', 'one_time', 'subscription']),
            'target_type' => fake()->randomElement(['all_users', 'specific_users']),
            'product_scope' => fake()->randomElement(['all_products', 'specific_products']),
            'slot' => fake()->numberBetween(1, 100),
            'usage_limit_per_user' => fake()->numberBetween(1, 100),
            'total_usage' => fake()->numberBetween(1, 1000),
            'started_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'expired_at' => fake()->dateTimeBetween('now', '+1 year'),
            'is_active' => fake()->randomElement([true, false]),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Voucher $voucher) {
            static $productIds;
            static $userIds;

            $productIds ??= Product::pluck('id');
            $userIds ??= User::pluck('id');

            if ($voucher->product_scope === 'specific_products' && $productIds->isNotEmpty()) {
                $limit = min(5, $productIds->count());
                $voucher->products()->attach($productIds->random($limit));
            }

            if ($voucher->target_type === 'specific_users' && $userIds->isNotEmpty()) {
                $limit = min(5, $userIds->count());
                $voucher->users()->attach($userIds->random($limit));
            }
        });
    }
}
