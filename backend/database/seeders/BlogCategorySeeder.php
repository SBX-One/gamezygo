<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Gaming News', 'Tips & Tricks', 'Promotions', 'Game Reviews', 'Updates'];

        foreach ($categories as $categoryName) {
            BlogCategory::create([
                'name' => $categoryName,
                'slug' => str()->slug($categoryName),
            ]);
        }
    }
}
