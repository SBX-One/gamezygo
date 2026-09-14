<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserCartItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = User::pluck('id');
        $productIds = Product::pluck('id');

        $data = [];

        for ($i = 0; $i < 1000; $i++) {
            $data[] = [
                'user_id'    => $userIds->random(),
                'product_id' => $productIds->random(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('user_cart_items')->insert($data);
    }
}
