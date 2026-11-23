<?php

namespace Database\Factories;

use App\Models\ProductSpecificationRequirement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductSpecificationRequirement>
 */
class ProductSpecificationRequirementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'label' => fake()->name(),
            'requirement' => fake()->text(),
            'type' => fake()->randomElement(['minimum', 'recommended']),
        ];
    }
}
