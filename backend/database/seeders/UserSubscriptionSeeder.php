<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::inRandomOrder()->limit(50)->get();
        $plans = SubscriptionPlan::all();

        if ($plans->isEmpty() || $users->isEmpty()) {
            return;
        }

        $data = [];

        foreach ($users as $user) {
            $plan = $plans->random();
            $startedAt = now()->subDays(rand(1, 20));
            $expiredAt = (clone $startedAt)->addDays($plan->duration_days);

            $data[] = [
                'user_id' => $user->id,
                'subscription_plan_id' => $plan->id,
                'started_at' => $startedAt,
                'expired_at' => $expiredAt,
                'status' => $expiredAt->isFuture() ? 'active' : 'expired',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('user_subscriptions')->insert($data);
    }
}
