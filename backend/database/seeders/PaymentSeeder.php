<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $totalOrders = Order::count();
        $targetCount = (int) ($totalOrders * 0.7);

        $orders = Order::whereDoesntHave('payment')
            ->inRandomOrder()
            ->limit($targetCount)
            ->get();

        foreach ($orders as $order) {
            $status = match ($order->status) {
                'paid' => 'success',
                'failed' => 'failed',
                'expired' => 'expired',
                'cancelled' => 'failed',
                default => fake()->randomElement(['pending', 'success', 'failed', 'expired']),
            };

            Payment::factory()->create([
                'order_id' => $order->id,
                'amount' => $order->total_price,
                'status' => $status,
                'paid_at' => $status === 'success' ? now()->subMinutes(fake()->numberBetween(1, 120)) : null,
                'expired_at' => $order->expired_at ?? now()->addHours(2),
            ]);
        }
    }
}
