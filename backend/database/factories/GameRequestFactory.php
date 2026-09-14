<?php

namespace Database\Factories;

use App\Models\GameRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GameRequest>
 */
class GameRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'reviewed', 'available', 'rejected']);

        return [
            'user_id'    => User::inRandomOrder()->first()?->id ?? User::factory(),
            'name'       => fake()->words(3, true),
            'steam_url'  => 'https://store.steampowered.com/app/' . fake()->numberBetween(100000, 999999),
            'note'       => fake()->sentence(),
            'status'     => $status,
            'admin_note' => $status !== 'pending' ? fake()->sentence() : null,
        ];
    }
}
