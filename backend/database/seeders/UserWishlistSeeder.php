<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserWishlistSeeder extends Seeder
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

        DB::table('user_wishlists')->insert($data);
    }
}
