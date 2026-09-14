<?php

namespace Database\Factories;

use App\Models\GenreCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GenreCategory>
 */
class GenreCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'slug' => fake()->slug(),
        ];
    }
}
