<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\CustomSection;
use App\Models\GenreCategory;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminCustomSectionTest extends TestCase
{
  use RefreshDatabase;

  protected Admin $admin;
  protected string $adminToken;
  protected ProductLauncherCategory $defaultLauncher;
  protected ProductInstruction $defaultInstruction;

  protected function setUp(): void
  {
    parent::setUp();

    $this->admin = Admin::create([
      'name'     => 'Main Admin',
      'email'    => 'admin@gamezygo.com',
      'password' => Hash::make('secretadmin123'),
    ]);

    $this->adminToken = auth('admin')->tokenById($this->admin->id);

    $this->defaultLauncher = ProductLauncherCategory::create([
      'name' => 'Steam',
      'slug' => 'steam',
    ]);

    $this->defaultInstruction = ProductInstruction::create([
      'title'   => 'Default Guide',
      'content' => 'Guide content',
    ]);
  }

  public function test_unauthenticated_requests_are_rejected(): void
  {
    $response = $this->getJson('/api/v1/admin/custom-sections');

    $response->assertStatus(401);
  }

  public function test_customer_user_is_forbidden_from_custom_sections(): void
  {
    $user = User::create([
      'name'     => 'Customer',
      'email'    => 'user@example.com',
      'password' => Hash::make('password123'),
      'status'   => 'active',
    ]);

    $userToken = auth('api')->tokenById($user->id);

    $response = $this->withHeader('Authorization', "Bearer {$userToken}")
      ->getJson('/api/v1/admin/custom-sections');

    $this->assertTrue(in_array($response->status(), [401, 403]));
  }

  public function test_admin_can_list_custom_sections_with_products(): void
  {
    $cat1 = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
    $cat2 = GenreCategory::create(['name' => 'Adventure', 'slug' => 'adventure']);

    $p1 = Product::create([
      'name'                         => "Assassin's Creed Black Flag Resynced",
      'slug'                         => 'assassins-creed-black-flag-resynced',
      'description'                  => 'Pirate adventure',
      'price'                        => 439000,
      'discount_price'               => 307300,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://store.steampowered.com/app/242050/',
      'status'                       => 'listing',
    ]);
    $p1->genreCategories()->attach([$cat1->id, $cat2->id]);

    $section = CustomSection::create([
      'title'        => 'Tawaran Khusus!',
      'slug'         => 'tawaran-khusus',
      'order_number' => 1,
      'is_active'    => true,
      'display_type' => 'manual',
    ]);

    $section->products()->attach($p1->id, ['order_number' => 1]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/custom-sections');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          '*' => [
            'id',
            'title',
            'slug',
            'display_type',
            'auto_rule',
            'order_number',
            'is_active',
            'total_products',
            'custom_section_products' => [
              '*' => [
                'id',
                'name',
                'slug',
                'thumbnail',
                'price',
                'discount_price',
                'discount',
                'sort_order',
                'categories' => [
                  '*' => [
                    'id',
                    'name',
                    'slug',
                  ],
                ],
              ],
            ],
          ],
        ],
      ])
      ->assertJsonPath('success', true)
      ->assertJsonPath('data.0.title', 'Tawaran Khusus!')
      ->assertJsonPath('data.0.total_products', 1)
      ->assertJsonPath('data.0.custom_section_products.0.name', "Assassin's Creed Black Flag Resynced")
      ->assertJsonPath('data.0.custom_section_products.0.discount', 30);
  }

  public function test_admin_can_create_custom_section(): void
  {
    $payload = [
      'name' => 'Game Terpopuler',
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson('/api/v1/admin/custom-sections', $payload);

    $response->assertStatus(201)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Product section created successfully')
      ->assertJsonPath('data.name', 'Game Terpopuler')
      ->assertJsonPath('data.sort_order', 1)
      ->assertJsonPath('data.total_products', 0)
      ->assertJsonPath('data.products', []);

    $this->assertDatabaseHas('custom_sections', [
      'title' => 'Game Terpopuler',
      'slug'  => 'game-terpopuler',
    ]);
  }

  public function test_admin_can_update_custom_section(): void
  {
    $section = CustomSection::create([
      'title'        => 'Game Terpopuler',
      'slug'         => 'game-terpopuler',
      'order_number' => 3,
      'is_active'    => true,
    ]);

    $payload = [
      'name' => 'Best Selling Games',
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->putJson("/api/v1/admin/custom-sections/{$section->id}", $payload);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Product section updated successfully')
      ->assertJsonPath('data.id', $section->id)
      ->assertJsonPath('data.name', 'Best Selling Games')
      ->assertJsonPath('data.sort_order', 3)
      ->assertJsonPath('data.total_products', 0);

    $this->assertDatabaseHas('custom_sections', [
      'id'    => $section->id,
      'title' => 'Best Selling Games',
    ]);
  }

  public function test_admin_can_delete_custom_section(): void
  {
    $section = CustomSection::create([
      'title'        => 'Section to Delete',
      'slug'         => 'section-to-delete',
      'order_number' => 1,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson("/api/v1/admin/custom-sections/{$section->id}");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Product section deleted successfully')
      ->assertJsonPath('data', null);

    $this->assertDatabaseMissing('custom_sections', [
      'id' => $section->id,
    ]);
  }

  public function test_admin_can_reorder_custom_sections(): void
  {
    $s1 = CustomSection::create(['title' => 'Sec 1', 'slug' => 'sec-1', 'order_number' => 1]);
    $s2 = CustomSection::create(['title' => 'Sec 2', 'slug' => 'sec-2', 'order_number' => 2]);
    $s3 = CustomSection::create(['title' => 'Sec 3', 'slug' => 'sec-3', 'order_number' => 3]);

    $payload = [
      'section_ids' => [$s3->id, $s1->id, $s2->id],
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson('/api/v1/admin/custom-sections/sort', $payload);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Product sections reordered successfully')
      ->assertJsonPath('data.0.id', $s3->id)
      ->assertJsonPath('data.0.sort_order', 1)
      ->assertJsonPath('data.1.id', $s1->id)
      ->assertJsonPath('data.1.sort_order', 2)
      ->assertJsonPath('data.2.id', $s2->id)
      ->assertJsonPath('data.2.sort_order', 3);

    $this->assertEquals(1, $s3->fresh()->order_number);
    $this->assertEquals(2, $s1->fresh()->order_number);
    $this->assertEquals(3, $s2->fresh()->order_number);
  }

  public function test_admin_can_fetch_all_products_with_filters(): void
  {
    $cat = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);

    $p1 = Product::create([
      'name'                         => 'Grand Theft Auto V',
      'slug'                         => 'grand-theft-auto-v',
      'description'                  => 'GTA 5',
      'price'                        => 480000,
      'discount_price'               => 0,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://store.steampowered.com/app/271590/',
      'status'                       => 'listing',
    ]);
    $p1->genreCategories()->attach($cat->id);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson("/api/v1/admin/custom-sections/all-products?category_ids[]={$cat->id}&min_price=100000&max_price=500000");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Products retrieved successfully')
      ->assertJsonPath('data.0.id', $p1->id)
      ->assertJsonPath('data.0.name', 'Grand Theft Auto V')
      ->assertJsonPath('data.0.price', 480000)
      ->assertJsonPath('data.0.categories.0.name', 'Action');
  }

  public function test_admin_can_add_products_to_section(): void
  {
    $section = CustomSection::create(['title' => 'Trending Games', 'slug' => 'trending-games', 'order_number' => 1]);

    $p1 = Product::create([
      'name'                         => 'Grand Theft Auto V',
      'slug'                         => 'grand-theft-auto-v',
      'description'                  => 'GTA 5',
      'price'                        => 480000,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://store.steampowered.com/app/271590/',
      'status'                       => 'listing',
    ]);

    $p2 = Product::create([
      'name'                         => 'Red Dead Redemption 2',
      'slug'                         => 'red-dead-redemption-2',
      'description'                  => 'RDR 2',
      'price'                        => 640000,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://store.steampowered.com/app/1174180/',
      'status'                       => 'listing',
    ]);

    $payload = [
      'product_ids' => [$p1->id, $p2->id],
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson("/api/v1/admin/custom-sections/{$section->id}/products", $payload);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Products added to section successfully')
      ->assertJsonPath('data.section_id', $section->id)
      ->assertJsonPath('data.total_products', 2)
      ->assertJsonPath('data.added_products.0.id', $p1->id)
      ->assertJsonPath('data.added_products.0.name', 'Grand Theft Auto V')
      ->assertJsonPath('data.added_products.0.sort_order', 1)
      ->assertJsonPath('data.added_products.1.id', $p2->id)
      ->assertJsonPath('data.added_products.1.name', 'Red Dead Redemption 2')
      ->assertJsonPath('data.added_products.1.sort_order', 2);
  }

  public function test_admin_can_remove_single_product_from_section(): void
  {
    $section = CustomSection::create(['title' => 'Trending Games', 'slug' => 'trending-games', 'order_number' => 1]);

    $p1 = Product::create([
      'name'                         => 'Grand Theft Auto V',
      'slug'                         => 'grand-theft-auto-v',
      'description'                  => 'GTA 5',
      'price'                        => 480000,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://store.steampowered.com/app/271590/',
      'status'                       => 'listing',
    ]);

    $section->products()->attach($p1->id, ['order_number' => 1]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson("/api/v1/admin/custom-sections/{$section->id}/products/{$p1->id}");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Product removed from section successfully')
      ->assertJsonPath('data.section_id', $section->id)
      ->assertJsonPath('data.product_id', $p1->id)
      ->assertJsonPath('data.total_products', 0);

    $this->assertDatabaseMissing('custom_section_products', [
      'custom_section_id' => $section->id,
      'product_id'        => $p1->id,
    ]);
  }

  public function test_admin_can_clear_all_products_from_section(): void
  {
    $section = CustomSection::create(['title' => 'Trending Games', 'slug' => 'trending-games', 'order_number' => 1]);

    $p1 = Product::create([
      'name'                         => 'Grand Theft Auto V',
      'slug'                         => 'grand-theft-auto-v',
      'description'                  => 'GTA 5',
      'price'                        => 480000,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://store.steampowered.com/app/271590/',
      'status'                       => 'listing',
    ]);

    $section->products()->attach($p1->id, ['order_number' => 1]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson("/api/v1/admin/custom-sections/{$section->id}/products");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Product section cleared successfully')
      ->assertJsonPath('data.section_id', $section->id)
      ->assertJsonPath('data.total_products', 0)
      ->assertJsonPath('data.products', []);

    $this->assertDatabaseMissing('custom_section_products', [
      'custom_section_id' => $section->id,
    ]);
  }

  public function test_admin_can_reorder_products_within_section(): void
  {
    $section = CustomSection::create(['title' => 'Trending Games', 'slug' => 'trending-games', 'order_number' => 1]);

    $p1 = Product::create([
      'name'                         => 'Product 1',
      'slug'                         => 'product-1',
      'description'                  => 'Desc',
      'price'                        => 100000,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://example.com/1',
      'status'                       => 'listing',
    ]);

    $p2 = Product::create([
      'name'                         => 'Product 2',
      'slug'                         => 'product-2',
      'description'                  => 'Desc',
      'price'                        => 200000,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://example.com/2',
      'status'                       => 'listing',
    ]);

    $section->products()->attach([
      $p1->id => ['order_number' => 1],
      $p2->id => ['order_number' => 2],
    ]);

    $payload = [
      'product_ids' => [$p2->id, $p1->id],
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson("/api/v1/admin/custom-sections/{$section->id}/products/sort", $payload);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Section products reordered successfully')
      ->assertJsonPath('data.section_id', $section->id)
      ->assertJsonPath('data.products.0.id', $p2->id)
      ->assertJsonPath('data.products.0.sort_order', 1)
      ->assertJsonPath('data.products.1.id', $p1->id)
      ->assertJsonPath('data.products.1.sort_order', 2);

    $pivotP2 = DB::table('custom_section_products')->where('custom_section_id', $section->id)->where('product_id', $p2->id)->value('order_number');
    $pivotP1 = DB::table('custom_section_products')->where('custom_section_id', $section->id)->where('product_id', $p1->id)->value('order_number');

    $this->assertEquals(1, $pivotP2);
    $this->assertEquals(2, $pivotP1);
  }
}

