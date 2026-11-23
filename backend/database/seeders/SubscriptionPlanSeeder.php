<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use App\Models\SubscriptionPlanFeature;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clean up existing subscription plans and features
        SubscriptionPlanFeature::query()->delete();
        SubscriptionPlan::query()->delete();

        $plans = [
            [
                'id' => 1,
                'name' => 'Paket 1 Bulan',
                'price' => 49000,
                'duration_months' => 1,
                'duration_days' => 30,
                'is_active' => true,
                'benefits' => [
                    'Akses seluruh game subscription',
                    'Download game tanpa batas',
                    'Support selama masa aktif',
                ],
            ],
            [
                'id' => 2,
                'name' => 'Paket 2 Bulan',
                'price' => 89000,
                'duration_months' => 2,
                'duration_days' => 60,
                'is_active' => true,
                'benefits' => [
                    'Akses seluruh game subscription',
                    'Download game tanpa batas',
                    'Prioritas bantuan pelanggan',
                ],
            ],
            [
                'id' => 3,
                'name' => 'Paket 3 Bulan',
                'price' => 129000,
                'duration_months' => 3,
                'duration_days' => 90,
                'is_active' => true,
                'benefits' => [
                    'Akses seluruh game subscription',
                    'Download game tanpa batas',
                    'Prioritas bantuan pelanggan',
                    'Bonus akses game terbaru',
                ],
            ],
        ];

        foreach ($plans as $planData) {
            $benefits = $planData['benefits'];
            unset($planData['benefits']);

            $plan = SubscriptionPlan::create($planData);

            $sortNumber = 1;
            foreach ($benefits as $benefitText) {
                $plan->features()->create([
                    'feature' => $benefitText,
                    'sort_number' => $sortNumber++,
                ]);
            }
        }
    }
}
