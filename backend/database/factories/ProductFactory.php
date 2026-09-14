<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->sentence();

        return [
            'name'                         => $name,
            'slug'                         => str()->slug($name),
            'description'                  => fake()->text(),
            'price'                        => fake()->randomDigit(),
            'discount_price'               => fake()->randomDigit(),
            'product_launcher_category_id' => ProductLauncherCategory::query()->inRandomOrder()->first()->id,
            'product_instruction_id'       => ProductInstruction::query()->inRandomOrder()->first()->id,
            'steam_url'                    => fake()->url(),
            'status'                       => fake()->randomElement(['listing', 'pre-order', 'archive']),
            'is_subscription_supported'   => fake()->boolean(70),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Product $product) {
            ProductGameAccount::factory()
                ->create([
                    'product_id' => $product->id,
                ]);

            ProductSpecificationRequirement::factory()
                ->count(12)
                ->create([
                    'product_id' => $product->id,
                ]);
        });
    }
}
