<?php

namespace Database\Factories;

use App\Models\CustomSection;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CustomSection>
 */
class CustomSectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->words(3, true);
        $displayType = fake()->randomElement(['manual', 'auto']);

        return [
            'title' => ucfirst($title),
            'slug' => str()->slug($title),
            'display_type' => $displayType,
            'auto_rule' => $displayType === 'auto' ? fake()->randomElement(['best_seller', 'newest', 'discounted']) : null,
            'order_number' => fake()->numberBetween(1, 10),
            'is_active' => fake()->boolean(90),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (CustomSection $customSection) {
            if ($customSection->display_type === 'manual') {
                $products = Product::inRandomOrder()->limit(rand(4, 8))->pluck('id');
                if ($products->isNotEmpty()) {
                    $order = 1;
                    $syncData = [];
                    foreach ($products as $productId) {
                        $syncData[$productId] = ['order_number' => $order++];
                    }
                    $customSection->products()->attach($syncData);
                }
            }
        });
    }
}
