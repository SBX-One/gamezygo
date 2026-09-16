<?php

namespace Database\Seeders;

use App\Models\CustomSection;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CustomSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::pluck('id');

        if ($products->isEmpty()) {
            return;
        }

        $manualSection = CustomSection::updateOrCreate(
            ['slug' => 'tawaran-khusus'],
            [
                'title'        => 'Tawaran Khusus!',
                'display_type' => 'manual',
                'auto_rule'    => null,
                'order_number' => 1,
                'is_active'    => true,
            ]
        );

        $selectedProducts = $products->random(min(5, $products->count()));
        $syncData = [];
        $order = 1;
        foreach ($selectedProducts as $productId) {
            $syncData[$productId] = ['order_number' => $order++];
        }
        $manualSection->products()->sync($syncData);

        CustomSection::updateOrCreate(
            ['slug' => 'game-terlaris-dan-populer'],
            [
                'title'        => 'Game Terlaris & Populer',
                'display_type' => 'auto',
                'auto_rule'    => 'best_seller',
                'order_number' => 2,
                'is_active'    => true,
            ]
        );

        CustomSection::updateOrCreate(
            ['slug' => 'rilis-terbaru'],
            [
                'title'        => 'Rilis Terbaru',
                'display_type' => 'auto',
                'auto_rule'    => 'newest',
                'order_number' => 3,
                'is_active'    => true,
            ]
        );

        CustomSection::updateOrCreate(
            ['slug' => 'diskon-spesial-minggu-ini'],
            [
                'title'        => 'Diskon Spesial Minggu Ini',
                'display_type' => 'auto',
                'auto_rule'    => 'discounted',
                'order_number' => 4,
                'is_active'    => true,
            ]
        );
    }
}
