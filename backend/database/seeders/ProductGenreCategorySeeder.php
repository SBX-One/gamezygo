<?php

namespace Database\Seeders;

use App\Models\GenreCategory;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductGenreCategorySeeder extends Seeder
{
    public function run(): void
    {
        $productIds = Product::query()->pluck('id');
        $genreCategoryIds = GenreCategory::query()->pluck('id');

        $data = [];

        for ($i = 0; $i < 100; $i++) {
            $data[] = [
                'product_id' => $productIds->random(),
                'genre_category_id' => $genreCategoryIds->random(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('product_genre_categories')->insert($data);
    }
}
