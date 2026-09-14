<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::inRandomOrder()->first();

        return [
            'order_id'         => Order::inRandomOrder()->first()?->id ?? Order::factory(),
            'purchasable_type' => Product::class,
            'purchasable_id'   => $product?->id ?? Product::factory(),
            'price'            => $product?->price ?? fake()->numberBetween(10000, 100000),
        ];
    }
}
