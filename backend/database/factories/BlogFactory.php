<?php

namespace Database\Factories;

use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Blog>
 */
class BlogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence();
        $status = fake()->randomElement(['draft', 'published', 'archived']);

        return [
            'banner_file_url'   => fake()->imageUrl(1200, 600, 'news'),
            'title'             => $title,
            'slug'              => str()->slug($title) . '-' . fake()->unique()->numberBetween(100, 999),
            'short_description' => fake()->paragraph(),
            'content'           => fake()->paragraphs(5, true),
            'blog_category_id'  => BlogCategory::inRandomOrder()->first()?->id ?? BlogCategory::factory(),
            'author_id'         => User::inRandomOrder()->first()?->id ?? User::factory(),
            'status'            => $status,
            'meta_title'        => $title,
            'meta_description'  => fake()->sentence(),
            'published_at'      => $status === 'published' ? fake()->dateTimeBetween('-1 year', 'now') : null,
        ];
    }
}
