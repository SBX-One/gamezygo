<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\GenreCategory;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminCategoryTest extends TestCase
{
  use RefreshDatabase;

  protected Admin $admin;
  protected string $adminToken;
  protected User $user;

  protected function setUp(): void
  {
    parent::setUp();

    $this->admin = Admin::create([
      'name'     => 'Gamezygo Admin',
      'email'    => 'admin@gamezygo.com',
      'password' => Hash::make('secretadmin123'),
    ]);

    $this->adminToken = auth('admin')->tokenById($this->admin->id);

    $this->user = User::create([
      'name'     => 'Regular User',
      'email'    => 'user@example.com',
      'password' => Hash::make('secret123'),
      'status'   => 'active',
    ]);
  }

  public function test_unauthenticated_request_is_rejected(): void
  {
    $response = $this->getJson('/api/v1/admin/product-categories');
    $response->assertStatus(401);

    $responseBlog = $this->getJson('/api/v1/admin/blog-categories');
    $responseBlog->assertStatus(401);
  }

  public function test_customer_user_is_forbidden(): void
  {
    $userToken = auth('api')->tokenById($this->user->id);

    $response = $this->withHeader('Authorization', "Bearer {$userToken}")
      ->getJson('/api/v1/admin/product-categories');
    $response->assertStatus(401);
  }

  public function test_admin_can_retrieve_product_categories_index(): void
  {
    $action = GenreCategory::create([
      'name'        => 'Action',
      'slug'        => 'action',
      'description' => 'Action packed games',
      'parent_id'   => null,
    ]);

    $sub1 = GenreCategory::create([
      'name'        => 'Hack and Slash',
      'slug'        => 'hack-and-slash',
      'description' => 'Fast melee combat',
      'parent_id'   => $action->id,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/product-categories');

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Product categories retrieved successfully')
      ->assertJsonPath('data.total_categories', 1)
      ->assertJsonPath('data.categories.0.name', 'Action')
      ->assertJsonPath('data.categories.0.total_sub_categories', 1)
      ->assertJsonPath('data.categories.0.sub_categories.0.name', 'Hack and Slash')
      ->assertJsonPath('data.categories.0.sub_categories.0.category_id', $action->id);
  }

  public function test_admin_can_show_single_product_category(): void
  {
    $rpg = GenreCategory::create([
      'name'        => 'Role Playing',
      'slug'        => 'role-playing',
      'description' => 'Immersive RPGs',
      'parent_id'   => null,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson("/api/v1/admin/product-categories/{$rpg->id}");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Product category retrieved successfully')
      ->assertJsonPath('data.id', $rpg->id)
      ->assertJsonPath('data.name', 'Role Playing');
  }

  public function test_admin_can_create_product_category(): void
  {
    $payload = [
      'name'        => 'Strategy',
      'description' => 'Tactical and strategic games',
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson('/api/v1/admin/product-categories', $payload);

    $response->assertStatus(201)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Product category created successfully')
      ->assertJsonPath('data.name', 'Strategy')
      ->assertJsonPath('data.slug', 'strategy');

    $this->assertDatabaseHas('genre_categories', [
      'name'      => 'Strategy',
      'parent_id' => null,
    ]);
  }

  public function test_admin_can_update_product_category(): void
  {
    $cat = GenreCategory::create([
      'name'        => 'Adventure Old',
      'slug'        => 'adventure-old',
      'description' => 'Old description',
      'parent_id'   => null,
    ]);

    $payload = [
      'name'        => 'Adventure New',
      'description' => 'Updated description',
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->putJson("/api/v1/admin/product-categories/{$cat->id}", $payload);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Product category updated successfully')
      ->assertJsonPath('data.name', 'Adventure New')
      ->assertJsonPath('data.description', 'Updated description');

    $this->assertEquals('Adventure New', $cat->fresh()->name);
  }

  public function test_admin_can_delete_product_category(): void
  {
    $cat = GenreCategory::create([
      'name'      => 'To Delete',
      'slug'      => 'to-delete',
      'parent_id' => null,
    ]);

    $sub = GenreCategory::create([
      'name'      => 'Sub To Delete',
      'slug'      => 'sub-to-delete',
      'parent_id' => $cat->id,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson("/api/v1/admin/product-categories/{$cat->id}");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Product category deleted successfully');
  }

  public function test_admin_can_manage_product_sub_categories(): void
  {
    $parent = GenreCategory::create([
      'name'      => 'Simulation',
      'slug'      => 'simulation',
      'parent_id' => null,
    ]);

    // Create via nested route
    $responseNested = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson("/api/v1/admin/product-categories/{$parent->id}/sub-categories", [
        'name'        => 'Flight Sim',
        'description' => 'Realistic flight simulation',
      ]);

    $responseNested->assertStatus(201)
      ->assertJsonPath('success', true)
      ->assertJsonPath('data.name', 'Flight Sim')
      ->assertJsonPath('data.category_id', $parent->id);

    $subId = $responseNested->json('data.id');

    // Create via direct route
    $responseDirect = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson('/api/v1/admin/product-sub-categories', [
        'category_id' => $parent->id,
        'name'        => 'Racing Sim',
      ]);

    $responseDirect->assertStatus(201)
      ->assertJsonPath('success', true)
      ->assertJsonPath('data.name', 'Racing Sim');

    // List sub-categories
    $responseList = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson("/api/v1/admin/product-sub-categories?category_id={$parent->id}");

    $responseList->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('data.total_sub_categories', 2);

    // Update sub-category
    $responseUpdate = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->putJson("/api/v1/admin/product-sub-categories/{$subId}", [
        'name' => 'Flight Simulation Pro',
      ]);

    $responseUpdate->assertStatus(200)
      ->assertJsonPath('data.name', 'Flight Simulation Pro');

    // Delete sub-category
    $responseDelete = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson("/api/v1/admin/product-sub-categories/{$subId}");

    $responseDelete->assertStatus(200)
      ->assertJsonPath('success', true);
  }

  public function test_admin_can_manage_blog_categories_and_sub_categories(): void
  {
    // 1. Create Blog Root Category
    $createCat = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson('/api/v1/admin/blog-categories', [
        'name'        => 'Gaming News',
        'description' => 'Industry headlines and esports news',
      ]);

    $createCat->assertStatus(201)
      ->assertJsonPath('success', true)
      ->assertJsonPath('data.name', 'Gaming News')
      ->assertJsonPath('data.slug', 'gaming-news');

    $catId = $createCat->json('data.id');

    // 2. Create Blog Sub Category via nested route
    $createSubNested = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson("/api/v1/admin/blog-categories/{$catId}/sub-categories", [
        'name'        => 'Esports',
        'description' => 'Competitive gaming coverage',
      ]);

    $createSubNested->assertStatus(201)
      ->assertJsonPath('data.name', 'Esports')
      ->assertJsonPath('data.category_id', $catId);

    $subId = $createSubNested->json('data.id');

    // 3. Create Blog Sub Category via direct route
    $createSubDirect = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson('/api/v1/admin/blog-sub-categories', [
        'category_id' => $catId,
        'name'        => 'PC Hardware',
      ]);

    $createSubDirect->assertStatus(201)
      ->assertJsonPath('data.name', 'PC Hardware');

    // 4. List Blog Categories with Sub Categories
    $listCategories = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/blog-categories');

    $listCategories->assertStatus(200)
      ->assertJsonPath('data.total_categories', 1)
      ->assertJsonPath('data.categories.0.total_sub_categories', 2);

    // 5. Show Blog Category
    $showCat = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson("/api/v1/admin/blog-categories/{$catId}");

    $showCat->assertStatus(200)
      ->assertJsonPath('data.id', $catId)
      ->assertJsonPath('data.name', 'Gaming News');

    // 6. Update Blog Sub Category
    $updateSub = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->putJson("/api/v1/admin/blog-sub-categories/{$subId}", [
        'name' => 'Esports & Tournaments',
      ]);

    $updateSub->assertStatus(200)
      ->assertJsonPath('data.name', 'Esports & Tournaments');

    // 7. Delete Blog Sub Category
    $deleteSub = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson("/api/v1/admin/blog-sub-categories/{$subId}");

    $deleteSub->assertStatus(200)
      ->assertJsonPath('success', true);

    // 8. Delete Blog Category
    $deleteCat = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson("/api/v1/admin/blog-categories/{$catId}");

    $deleteCat->assertStatus(200)
      ->assertJsonPath('success', true);
  }

  public function test_tag_aliases_and_legacy_routes_work(): void
  {
    $cat = GenreCategory::create(['name' => 'Legacy Cat', 'slug' => 'legacy-cat']);
    $sub = GenreCategory::create(['name' => 'Legacy Sub', 'slug' => 'legacy-sub', 'parent_id' => $cat->id]);

    // Test product-tags alias
    $responseTag = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/admin/product-tags');

    $responseTag->assertStatus(200)
      ->assertJsonPath('success', true);

    // Test blog-tags alias
    $responseBlogTag = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/admin/blog-tags');

    $responseBlogTag->assertStatus(200)
      ->assertJsonPath('success', true);

    // Test /api/admin/product-categories without v1
    $responseNoV1 = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/admin/product-categories');

    $responseNoV1->assertStatus(200)
      ->assertJsonPath('success', true);
  }
}

