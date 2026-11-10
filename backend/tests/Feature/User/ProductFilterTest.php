<?php

namespace Tests\Feature\User;

use App\Models\GenreCategory;
use App\Models\Product;
use App\Models\ProductLauncherCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductFilterTest extends TestCase
{
  use RefreshDatabase;

  public function test_guest_can_retrieve_product_filters_successfully(): void
  {
    $genre1 = GenreCategory::create([
      'name' => 'Action',
      'slug' => 'action',
    ]);
    $genre2 = GenreCategory::create([
      'name' => 'Adventure',
      'slug' => 'adventure',
    ]);
    $genre3 = GenreCategory::create([
      'name' => 'Open World',
      'slug' => 'open-world',
    ]);

    $launcher = ProductLauncherCategory::create([
      'name' => 'Steam',
      'slug' => 'steam',
    ]);

    $response = $this->getJson('/api/v1/products/filters');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Product filters retrieved successfully',
        'data'    => [
          'categories'   => [
            [
              'id'   => $genre1->id,
              'name' => 'Action',
              'slug' => 'action',
            ],
            [
              'id'   => $genre2->id,
              'name' => 'Adventure',
              'slug' => 'adventure',
            ],
            [
              'id'   => $genre3->id,
              'name' => 'Open World',
              'slug' => 'open-world',
            ],
          ],
          'launcher'     => [
            [
              'id'   => $launcher->id,
              'name' => 'Steam',
              'slug' => 'steam',
            ],
          ],
          'statuses'     => [
            [
              'label' => 'Active',
              'value' => true,
            ],
            [
              'label' => 'Inactive',
              'value' => false,
            ],
          ],
          'price_range'  => [
            'min' => 0,
            'max' => 1500000,
          ],
          'sort_options' => [
            [
              'label' => 'Terbaru',
              'value' => 'latest',
            ],
            [
              'label' => 'Terlama',
              'value' => 'oldest',
            ],
            [
              'label' => 'Nama A-Z',
              'value' => 'a_z',
            ],
            [
              'label' => 'Nama Z-A',
              'value' => 'z_a',
            ],
          ],
        ],
      ]);
  }

  public function test_filters_price_range_expands_if_product_price_exceeds_default_max(): void
  {
    $launcher = ProductLauncherCategory::create([
      'name' => 'Steam',
      'slug' => 'steam',
    ]);

    Product::factory()->create([
      'product_launcher_category_id' => $launcher->id,
      'price'                        => 2500000,
    ]);

    $response = $this->getJson('/api/v1/products/filters');

    $response->assertStatus(200)
      ->assertJsonPath('data.price_range.min', 0)
      ->assertJsonPath('data.price_range.max', 2500000);
  }

  public function test_filters_route_does_not_conflict_with_product_detail_route(): void
  {
    $product = Product::factory()->create([
      'slug' => 'grand-theft-auto-v',
      'name' => 'Grand Theft Auto V',
    ]);

    $filtersResponse = $this->getJson('/api/v1/products/filters');
    $filtersResponse->assertStatus(200)
      ->assertJsonPath('message', 'Product filters retrieved successfully');

    $detailResponse = $this->getJson("/api/v1/products/{$product->slug}");
    $detailResponse->assertStatus(200)
      ->assertJsonPath('data.name', 'Grand Theft Auto V');
  }
}
