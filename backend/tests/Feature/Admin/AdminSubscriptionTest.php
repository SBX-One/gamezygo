<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\GenreCategory;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\SubscriptionPlan;
use App\Models\SubscriptionPlanFeature;
use App\Models\User;
use App\Models\UserSubscription;
use Database\Seeders\SubscriptionPlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminSubscriptionTest extends TestCase
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

    // Seed standard 3 plans
    (new SubscriptionPlanSeeder())->run();
  }

  public function test_unauthenticated_request_is_rejected(): void
  {
    $response = $this->getJson('/api/v1/admin/subscriptions');

    $response->assertStatus(401);
  }

  public function test_customer_user_is_forbidden_from_subscription_management(): void
  {
    $user = User::create([
      'name'     => 'Customer',
      'email'    => 'customer@example.com',
      'password' => Hash::make('secret123'),
      'status'   => 'active',
    ]);

    $userToken = auth('api')->tokenById($user->id);

    $response = $this->withHeader('Authorization', "Bearer {$userToken}")
      ->getJson('/api/v1/admin/subscriptions');

    $this->assertTrue(in_array($response->status(), [401, 403]));
  }

  public function test_admin_can_retrieve_subscription_dashboard(): void
  {
    $cat = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);

    $game = Product::create([
      'name'                         => "Assassin's Creed Black Flag Resynced",
      'slug'                         => 'assassins-creed-black-flag-resynced',
      'description'                  => 'Pirate game',
      'price'                        => 439000,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://store.steampowered.com/app/242050/',
      'status'                       => 'listing',
      'is_subscription_supported'    => true,
    ]);
    $game->genreCategories()->attach($cat->id);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/subscriptions');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'plans' => [
            '*' => [
              'id',
              'name',
              'price',
              'duration_months',
              'benefits' => [
                '*' => [
                  'id',
                  'description',
                  'sort_order',
                ],
              ],
            ],
          ],
          'subscription_games' => [
            'total',
            'total_value',
            'games' => [
              '*' => [
                'id',
                'name',
                'image_url',
                'categories',
              ],
            ],
          ],
        ],
      ])
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Subscription dashboard retrieved successfully')
      ->assertJsonCount(3, 'data.plans')
      ->assertJsonPath('data.plans.0.name', 'Paket 1 Bulan')
      ->assertJsonPath('data.plans.0.price', 49000)
      ->assertJsonPath('data.plans.0.duration_months', 1)
      ->assertJsonPath('data.plans.1.name', 'Paket 2 Bulan')
      ->assertJsonPath('data.plans.1.duration_months', 2)
      ->assertJsonPath('data.plans.2.name', 'Paket 3 Bulan')
      ->assertJsonPath('data.plans.2.duration_months', 3)
      ->assertJsonPath('data.subscription_games.total', 1)
      ->assertJsonPath('data.subscription_games.total_value', 439000)
      ->assertJsonPath('data.subscription_games.games.0.name', "Assassin's Creed Black Flag Resynced")
      ->assertJsonPath('data.subscription_games.games.0.categories.0', 'Action');
  }

  public function test_admin_can_retrieve_active_subscribers_with_pagination(): void
  {
    $user1 = User::create([
      'name'     => 'User 01',
      'email'    => 'user01@gmail.com',
      'password' => Hash::make('password123'),
      'status'   => 'active',
    ]);

    $plan1 = SubscriptionPlan::first();

    UserSubscription::create([
      'user_id'              => $user1->id,
      'subscription_plan_id' => $plan1->id,
      'status'               => 'active',
      'started_at'           => now(),
      'expired_at'           => now()->addDays(30),
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/subscriptions/active-subs?page=1&per_page=10');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'total_active',
          'users' => [
            '*' => [
              'id',
              'user_id',
              'email',
              'plan' => [
                'id',
                'name',
              ],
              'status',
              'created_at',
              'expires_at',
            ],
          ],
          'pagination' => [
            'current_page',
            'per_page',
            'total',
            'last_page',
          ],
        ],
      ])
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Subscription users retrieved successfully')
      ->assertJsonPath('data.total_active', 1)
      ->assertJsonPath('data.users.0.email', 'user01@gmail.com')
      ->assertJsonPath('data.users.0.plan.name', $plan1->name)
      ->assertJsonPath('data.users.0.status', 'active');
  }

  public function test_admin_can_update_subscription_plan(): void
  {
    $plan = SubscriptionPlan::first();

    $payload = [
      'name'            => 'Paket 1 Bulan Promo',
      'price'           => 59000,
      'duration_months' => 1,
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->putJson("/api/v1/admin/subscriptions/{$plan->id}", $payload);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Subscription plan updated successfully')
      ->assertJsonPath('data.id', $plan->id)
      ->assertJsonPath('data.name', 'Paket 1 Bulan Promo')
      ->assertJsonPath('data.price', 59000)
      ->assertJsonPath('data.duration_months', 1);

    $this->assertDatabaseHas('subscription_plans', [
      'id'    => $plan->id,
      'name'  => 'Paket 1 Bulan Promo',
      'price' => 59000,
    ]);
  }

  public function test_admin_can_retrieve_plan_features(): void
  {
    $plan = SubscriptionPlan::first();

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson("/api/v1/admin/subscriptions/{$plan->id}/features");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Subscription dashboard retrieved successfully')
      ->assertJsonCount(3, 'data')
      ->assertJsonPath('data.0.sort_order', 1);
  }

  public function test_admin_can_sync_plan_features(): void
  {
    $plan = SubscriptionPlan::first();
    $existing = $plan->features()->get();

    $payload = [
      'benefits' => [
        [
          'id'          => $existing[1]->id,
          'description' => 'Download game tanpa batas (Updated)',
        ],
        [
          'id'          => $existing[0]->id,
          'description' => 'Akses seluruh game subscription',
        ],
        [
          'description' => 'Gratis update game terbaru',
        ],
      ],
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->putJson("/api/v1/admin/subscriptions/{$plan->id}/features", $payload);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Subscription benefits updated successfully')
      ->assertJsonPath('data.plan_id', $plan->id)
      ->assertJsonCount(3, 'data.benefits')
      ->assertJsonPath('data.benefits.0.id', $existing[1]->id)
      ->assertJsonPath('data.benefits.0.sort_order', 1)
      ->assertJsonPath('data.benefits.1.id', $existing[0]->id)
      ->assertJsonPath('data.benefits.1.sort_order', 2)
      ->assertJsonPath('data.benefits.2.description', 'Gratis update game terbaru')
      ->assertJsonPath('data.benefits.2.sort_order', 3);

    // Feature 3 was not included, so it was deleted
    $this->assertDatabaseMissing('subscription_plan_features', [
      'id' => $existing[2]->id,
    ]);
  }

  public function test_admin_can_delete_single_benefit(): void
  {
    $plan = SubscriptionPlan::first();
    $feature = $plan->features()->first();

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson("/api/v1/admin/subscriptions/{$plan->id}/features/{$feature->id}");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Subscription benefit deleted successfully')
      ->assertJsonPath('data.subscription_plan_id', $plan->id)
      ->assertJsonPath('data.deleted_benefit_id', $feature->id)
      ->assertJsonPath('data.total_benefits', 2);

    $this->assertDatabaseMissing('subscription_plan_features', [
      'id' => $feature->id,
    ]);
  }

  public function test_admin_can_list_subscription_products_with_filters(): void
  {
    $cat = GenreCategory::create(['name' => 'Adventure', 'slug' => 'adventure']);

    $game = Product::create([
      'name'                         => 'Subnautica 2',
      'slug'                         => 'subnautica-2',
      'description'                  => 'Survival ocean game',
      'price'                        => 350000,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://example.com/subnautica',
      'status'                       => 'listing',
      'is_subscription_supported'    => true,
    ]);
    $game->genreCategories()->attach($cat->id);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson("/api/v1/admin/subscriptions/products?category_ids[]={$cat->id}&min_price=100000&max_price=500000");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Subscription games retrieved successfully')
      ->assertJsonPath('data.total_games', 1)
      ->assertJsonPath('data.games.0.name', 'Subnautica 2')
      ->assertJsonPath('data.games.0.categories.0.name', 'Adventure');
  }

  public function test_admin_can_add_products_to_subscription(): void
  {
    $p1 = Product::create([
      'name'                         => 'Grand Theft Auto V',
      'slug'                         => 'grand-theft-auto-v',
      'description'                  => 'GTA 5',
      'price'                        => 480000,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://store.steampowered.com/app/271590/',
      'status'                       => 'listing',
      'is_subscription_supported'    => false,
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
      'is_subscription_supported'    => false,
    ]);

    $payload = [
      'product_ids' => [$p1->id, $p2->id],
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson('/api/v1/admin/subscriptions/products', $payload);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Games added to subscription successfully')
      ->assertJsonPath('data.total_games', 2)
      ->assertJsonPath('data.added_games.0.id', $p1->id)
      ->assertJsonPath('data.added_games.1.id', $p2->id);

    $this->assertTrue($p1->fresh()->is_subscription_supported);
    $this->assertTrue($p2->fresh()->is_subscription_supported);
  }

  public function test_admin_can_remove_product_from_subscription(): void
  {
    $p1 = Product::create([
      'name'                         => 'Grand Theft Auto V',
      'slug'                         => 'grand-theft-auto-v',
      'description'                  => 'GTA 5',
      'price'                        => 480000,
      'product_launcher_category_id' => $this->defaultLauncher->id,
      'product_instruction_id'       => $this->defaultInstruction->id,
      'steam_url'                    => 'https://store.steampowered.com/app/271590/',
      'status'                       => 'listing',
      'is_subscription_supported'    => true,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson("/api/v1/admin/subscriptions/products/{$p1->id}");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Game removed from subscription successfully')
      ->assertJsonPath('data.product_id', $p1->id)
      ->assertJsonPath('data.total_games', 0);

    $this->assertFalse($p1->fresh()->is_subscription_supported);
  }
}

