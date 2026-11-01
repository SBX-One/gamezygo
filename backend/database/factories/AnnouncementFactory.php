<?php

namespace Database\Factories;

use App\Models\Announcement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Announcement>
 */
class AnnouncementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'banner_file_url' => fake()->imageUrl(1200, 400, 'gaming'),
            'link'            => fake()->url(),
            'sort_order'      => fake()->numberBetween(1, 20),
            'is_published'    => fake()->boolean(80),
        ];
    }
}
