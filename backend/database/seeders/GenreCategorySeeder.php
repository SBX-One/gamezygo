<?php

namespace Database\Seeders;

use App\Models\GenreCategory;
use Illuminate\Database\Seeder;

class GenreCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genres = [
            'Action',
            'RPG',
            'Strategy',
            'Adventure',
            'Simulation',
            'Sports',
            'Racing',
            'FPS',
            'Open World',
            'Horror',
            'Fighting',
            'Survival',
        ];

        foreach ($genres as $genre) {
            GenreCategory::firstOrCreate(
                ['slug' => str()->slug($genre)],
                ['name' => $genre]
            );
        }
    }
}
