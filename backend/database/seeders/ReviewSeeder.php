<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = User::pluck('id');
        $productIds = Product::pluck('id');

        if ($userIds->isEmpty() || $productIds->isEmpty()) {
            return;
        }

        $statuses = ['pending', 'approved', 'rejected', 'archived'];
        $data = [];

        for ($i = 0; $i < 200; $i++) {
            $data[] = [
                'user_id'    => $userIds->random(),
                'product_id' => $productIds->random(),
                'review'     => fake()->paragraph(),
                'rating'     => fake()->numberBetween(1, 5),
                'status'     => fake()->randomElement($statuses),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('reviews')->insert($data);
    }
}
