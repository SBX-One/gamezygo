<?php

namespace Database\Factories;

use App\Models\ProductLauncherCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductLauncherCategory>
 */
class ProductLauncherCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => ucfirst($name),
            'slug' => str()->slug($name),
        ];
    }
}
