<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserOwnedGameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = User::query()->pluck('id');
        $productIds = Product::query()->pluck('id');

        $data = [];

        for ($i = 0; $i < 1000; $i++) {
            $data[] = [
                'user_id' => $userIds->random(),
                'product_id' => $productIds->random(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('user_owned_games')->insert($data);
    }
}
