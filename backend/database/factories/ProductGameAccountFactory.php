<?php

namespace Database\Factories;

use App\Models\ProductGameAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductGameAccount>
 */
class ProductGameAccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => fake()->name(),
            'password' => fake()->password(),
        ];
    }
}
