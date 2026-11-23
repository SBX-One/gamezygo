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
        static $products;
        static $orders;

        $products ??= Product::all();
        $orders ??= Order::all();

        $product = $products->isNotEmpty() ? $products->random() : null;
        $orderId = $orders->isNotEmpty() ? $orders->random()->id : Order::factory();

        return [
            'order_id' => $orderId,
            'purchasable_type' => Product::class,
            'purchasable_id' => $product?->id ?? Product::factory(),
            'price' => $product?->price ?? fake()->numberBetween(10000, 100000),
        ];
    }
}
