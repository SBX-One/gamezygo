<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (BlogCategory::count() === 0) {
            $this->call(BlogCategorySeeder::class);
        }

        Blog::factory()->count(20)->create([
            'status'       => 'published',
            'published_at' => now(),
        ]);
    }
}
