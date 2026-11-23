<?php

namespace Database\Factories;

use App\Models\Community;
use App\Models\CommunityTag;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Community>
 */
class CommunityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company().' Community',
            'banner_file_url' => fake()->imageUrl(800, 400, 'community'),
            'link' => fake()->url(),
            'order_number' => fake()->numberBetween(1, 50),
            'is_active' => fake()->boolean(90),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Community $community) {
            $tags = CommunityTag::inRandomOrder()->limit(rand(1, 3))->pluck('id');
            if ($tags->isNotEmpty()) {
                $community->tags()->attach($tags);
            }
        });
    }
}
