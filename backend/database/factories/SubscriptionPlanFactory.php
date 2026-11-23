<?php

namespace Database\Factories;

use App\Models\SubscriptionPlan;
use App\Models\SubscriptionPlanFeature;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SubscriptionPlan>
 */
class SubscriptionPlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'price' => fake()->numberBetween(10000, 100000),
            'duration_days' => fake()->numberBetween(1, 30),
            'max_concurrent_access' => fake()->numberBetween(1, 4),
            'is_active' => fake()->boolean,
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (SubscriptionPlan $subscriptionPlan) {
            for ($i = 1; $i <= 10; $i++) {
                SubscriptionPlanFeature::factory()->create([
                    'subscription_plan_id' => $subscriptionPlan->id,
                    'sort_number' => $i,
                ]);
            }
        });
    }
}
