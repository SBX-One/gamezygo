<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name'          => 'Basic',
                'price'         => 49000,
                'duration_days' => 30,
                'is_active'     => true,
                'features'      => [
                    'Access to exclusive games',
                    'Monthly game discounts',
                    'Priority customer support',
                ],
            ],
            [
                'name'          => 'Premium',
                'price'         => 99000,
                'duration_days' => 30,
                'is_active'     => true,
                'features'      => [
                    'Access to exclusive games',
                    'Higher monthly game discounts',
                    'Priority customer support',
                    'Exclusive member rewards',
                ],
            ],
            [
                'name'          => 'Ultimate VIP',
                'price'         => 199000,
                'duration_days' => 90,
                'is_active'     => true,
                'features'      => [
                    'Access to all exclusive games catalog',
                    'Maximum monthly game discounts',
                    '24/7 VIP priority support',
                    'Exclusive member rewards & gifts',
                    'Free monthly game pass credits',
                ],
            ],
        ];

        foreach ($plans as $planData) {
            $features = $planData['features'];
            unset($planData['features']);

            $plan = SubscriptionPlan::updateOrCreate(
                ['name' => $planData['name']],
                $planData
            );

            // Re-sync features for testing
            $plan->features()->delete();
            $sortNumber = 1;
            foreach ($features as $featureText) {
                $plan->features()->create([
                    'feature'     => $featureText,
                    'sort_number' => $sortNumber++,
                ]);
            }
        }
    }
}
