<?php

namespace Database\Factories;

use App\Models\ProductInstruction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductInstruction>
 */
class ProductInstructionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->title(),
            'content' => fake()->text(),
        ];
    }
}
