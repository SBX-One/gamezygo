<?php

namespace Database\Factories;

use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserSubscription>
 */
class UserSubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $plan = SubscriptionPlan::inRandomOrder()->first();
        $startedAt = fake()->dateTimeBetween('-1 month', 'now');
        $durationDays = $plan?->duration_days ?? 30;
        $expiredAt = (clone $startedAt)->modify("+{$durationDays} days");
        $isActive = $expiredAt > now();

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'subscription_plan_id' => $plan?->id ?? SubscriptionPlan::factory(),
            'started_at' => $startedAt,
            'expired_at' => $expiredAt,
            'status' => $isActive ? 'active' : 'expired',
        ];
    }
}
