<?php

namespace Database\Seeders;

use App\Models\ProductLauncherCategory;
use Illuminate\Database\Seeder;

class ProductLauncherCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $launchers = [
            'Steam',
            'Epic Games',
            'Ubisoft Connect',
            'EA App',
            'GOG Galaxy',
            'Battle.net',
            'Xbox PC App',
        ];

        foreach ($launchers as $launcher) {
            ProductLauncherCategory::firstOrCreate(
                ['slug' => str()->slug($launcher)],
                ['name' => $launcher]
            );
        }
    }
}
