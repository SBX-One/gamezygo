<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductGameAccount;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\ProductSpecificationRequirement;
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
        $name = fake()->unique()->words(3, true);
        $slug = str()->slug($name) . '-' . fake()->unique()->numberBetween(100, 9999);

        return [
            'name'                         => ucfirst($name),
            'slug'                         => $slug,
            'description'                  => fake()->text(),
            'price'                        => fake()->numberBetween(50000, 800000),
            'discount_price'               => fake()->numberBetween(0, 400000),
            'product_launcher_category_id' => ProductLauncherCategory::first()?->id ?? ProductLauncherCategory::factory(),
            'product_instruction_id'       => ProductInstruction::first()?->id ?? ProductInstruction::factory(),
            'steam_url'                    => fake()->url(),
            'status'                       => fake()->randomElement(['listing', 'pre-order', 'archive']),
            'is_subscription_supported'    => fake()->boolean(70),
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
