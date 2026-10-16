<?php

namespace Tests\Feature\User;

use App\Models\GenreCategory;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductGameAccount;
use App\Models\ProductLauncherCategory;
use App\Models\Review;
use App\Models\SubscriptionPlan;
use App\Models\SubscriptionPlanFeature;
use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
  use RefreshDatabase;

  public function test_unauthenticated_user_cannot_access_subscription(): void
  {
    $response = $this->getJson('/api/v1/user/subscription');

    $response->assertStatus(401);
  }

  public function test_unauthenticated_user_cannot_access_subscription_products(): void
  {
    $response = $this->getJson('/api/v1/user/subscription/products');

    $response->assertStatus(401);
  }

  public function test_user_without_active_subscription_returns_404_on_show(): void
  {
    $user = User::create([
      'name'     => 'No Sub User',
      'email'    => 'nosub@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/subscription');

    $response->assertStatus(404)
      ->assertJson([
        'success' => false,
        'message' => 'No active subscription found',
        'data'    => null,
      ]);
  }

  public function test_user_with_expired_subscription_returns_404(): void
  {
    $user = User::create([
      'name'     => 'Expired Sub User',
      'email'    => 'expired@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $plan = SubscriptionPlan::create([
      'name'                  => 'Basic Plan',
      'description'           => 'Basic plan description',
      'price'                 => 49000,
      'duration_days'         => 30,
      'max_concurrent_access' => 1,
      'is_active'             => true,
    ]);

    UserSubscription::create([
      'user_id'              => $user->id,
      'subscription_plan_id' => $plan->id,
      'started_at'           => now()->subDays(60),
      'expired_at'           => now()->subDays(30),
      'status'               => 'expired',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/subscription');

    $response->assertStatus(404)
      ->assertJson([
        'success' => false,
        'message' => 'No active subscription found',
        'data'    => null,
      ]);
  }

  public function test_user_with_active_subscription_can_retrieve_subscription_details(): void
  {
    $user = User::create([
      'name'     => 'Active Sub Gamer',
      'email'    => 'activesub@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $plan = SubscriptionPlan::create([
      'name'                  => 'Premium',
      'description'           => 'Get access to premium games and exclusive benefits.',
      'price'                 => 99000,
      'duration_days'         => 30,
      'max_concurrent_access' => 2,
      'is_active'             => true,
    ]);

    $feature1 = SubscriptionPlanFeature::create([
      'subscription_plan_id' => $plan->id,
      'feature'              => 'Access to 50+ games',
      'sort_number'          => 1,
    ]);

    $feature2 = SubscriptionPlanFeature::create([
      'subscription_plan_id' => $plan->id,
      'feature'              => 'Streaming HD',
      'sort_number'          => 2,
    ]);

    $order = Order::create([
      'user_id'         => $user->id,
      'order_code'      => 'ORD-2026-0001',
      'subtotal_price'  => 99000,
      'discount_amount' => 0,
      'total_price'     => 99000,
      'status'          => 'paid',
      'expired_at'      => now()->addHour(),
      'paid_at'         => now(),
    ]);

    $orderItem = OrderItem::create([
      'order_id'         => $order->id,
      'purchasable_type' => SubscriptionPlan::class,
      'purchasable_id'   => $plan->id,
      'price'            => 99000,
    ]);

    $startedAt = now();
    $expiresAt = now()->addDays(30);

    $sub = UserSubscription::create([
      'user_id'              => $user->id,
      'subscription_plan_id' => $plan->id,
      'order_item_id'        => $orderItem->id,
      'status'               => 'active',
      'started_at'           => $startedAt,
      'expired_at'           => $expiresAt,
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/subscription');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Subscription retrieved successfully',
        'data'    => [
          'id'                   => $sub->id,
          'subscription_plan_id' => $plan->id,
          'order_item_id'        => $orderItem->id,
          'status'               => 'active',
          'subscription_plan'    => [
            'id'                         => $plan->id,
            'name'                       => 'Premium',
            'description'                => 'Get access to premium games and exclusive benefits.',
            'price'                      => 99000,
            'duration_days'              => 30,
            'max_concurrent_access'      => 2,
            'is_active'                  => true,
            'subscription_plan_features' => [
              [
                'id'           => $feature1->id,
                'feature'      => 'Access to 50+ games',
                'order_number' => 1,
              ],
              [
                'id'           => $feature2->id,
                'feature'      => 'Streaming HD',
                'order_number' => 2,
              ],
            ],
          ],
        ],
      ]);

    $this->assertNotNull($response->json('data.started_at'));
    $this->assertNotNull($response->json('data.expires_at'));
  }

  public function test_user_can_retrieve_subscription_products_with_correct_structure(): void
  {
    $user = User::create([
      'name'     => 'Catalog Viewer',
      'email'    => 'catalog@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $launcher = ProductLauncherCategory::factory()->create([
      'name' => 'Steam',
      'slug' => 'steam',
    ]);

    $actionGenre = GenreCategory::factory()->create([
      'name' => 'Action',
      'slug' => 'action',
    ]);

    $adventureGenre = GenreCategory::factory()->create([
      'name' => 'Adventure',
      'slug' => 'adventure',
    ]);

    $product1 = Product::factory()->create([
      'name'                         => "Assassin's Creed Black Flag Resynced",
      'slug'                         => 'assassins-creed-black-flag-resynced',
      'price'                        => 439000,
      'discount_price'               => 307300,
      'is_subscription_supported'    => true,
      'product_launcher_category_id' => $launcher->id,
    ]);
    $product1->genreCategories()->attach([$actionGenre->id, $adventureGenre->id]);

    Review::create([
      'user_id'    => $user->id,
      'product_id' => $product1->id,
      'rating'     => 5,
      'status'     => 'approved',
      'review'     => 'Great game!',
    ]);

    $product2 = Product::factory()->create([
      'name'                         => 'Grand Theft Auto V',
      'slug'                         => 'grand-theft-auto-v',
      'price'                        => 299000,
      'discount_price'               => 239200,
      'is_subscription_supported'    => true,
      'product_launcher_category_id' => $launcher->id,
    ]);
    $product2->genreCategories()->attach([$actionGenre->id]);

    // Product NOT supported in subscription
    $product3 = Product::factory()->create([
      'name'                      => 'Standalone Game Only',
      'slug'                      => 'standalone-game-only',
      'is_subscription_supported' => false,
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/subscription/products');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Subscription products retrieved successfully',
      ]);

    $data = $response->json('data');
    $this->assertCount(2, $data);

    $firstItem = collect($data)->firstWhere('slug', 'assassins-creed-black-flag-resynced');
    $this->assertNotNull($firstItem);
    $this->assertEquals(439000, $firstItem['price']);
    $this->assertEquals(307300, $firstItem['price_discount']);
    $this->assertEquals(30, $firstItem['discount']);
    $this->assertArrayHasKey('rating', $firstItem);
    $this->assertArrayHasKey('product_genre_categories', $firstItem);
    $this->assertCount(2, $firstItem['product_genre_categories']);
    $this->assertEquals('Steam', $firstItem['product_launcher_category']['name']);

    $meta = $response->json('meta');
    $this->assertNotNull($meta);
    $this->assertEquals(1, $meta['current_page']);
    $this->assertEquals(2, $meta['total']);
  }

  public function test_user_can_filter_subscription_products_by_search(): void
  {
    $user = User::create([
      'name'     => 'Search Tester',
      'email'    => 'search@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    Product::factory()->create([
      'name'                      => 'Cyberpunk 2077',
      'slug'                      => 'cyberpunk-2077',
      'is_subscription_supported' => true,
    ]);

    Product::factory()->create([
      'name'                      => 'The Witcher 3',
      'slug'                      => 'the-witcher-3',
      'is_subscription_supported' => true,
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/subscription/products?search=Cyberpunk');

    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(1, $data);
    $this->assertEquals('Cyberpunk 2077', $data[0]['name']);
  }

  public function test_user_can_filter_subscription_products_by_genre_categories(): void
  {
    $user = User::create([
      'name'     => 'Genre Tester',
      'email'    => 'genre@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $action = GenreCategory::factory()->create(['name' => 'Action', 'slug' => 'action']);
    $rpg = GenreCategory::factory()->create(['name' => 'RPG', 'slug' => 'rpg']);
    $sports = GenreCategory::factory()->create(['name' => 'Sports', 'slug' => 'sports']);

    $game1 = Product::factory()->create(['name' => 'Action Game', 'is_subscription_supported' => true]);
    $game1->genreCategories()->attach($action->id);

    $game2 = Product::factory()->create(['name' => 'RPG Game', 'is_subscription_supported' => true]);
    $game2->genreCategories()->attach($rpg->id);

    $game3 = Product::factory()->create(['name' => 'Sports Game', 'is_subscription_supported' => true]);
    $game3->genreCategories()->attach($sports->id);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/subscription/products?genre_categories[0]=action&genre_categories[1]=rpg');

    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(2, $data);
    $names = collect($data)->pluck('name')->all();
    $this->assertContains('Action Game', $names);
    $this->assertContains('RPG Game', $names);
    $this->assertNotContains('Sports Game', $names);
  }

  public function test_user_with_active_subscription_can_access_credentials_for_subscription_game(): void
  {
    $user = User::create([
      'name'     => 'Subscriber Gamer',
      'email'    => 'subscribergame@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'                      => 'Sub Supported Game',
      'slug'                      => 'sub-supported-game',
      'is_subscription_supported' => true,
    ]);

    $account = $product->gameAccounts;
    $account->update([
      'username' => 'pass_user',
      'password' => 'pass_secret_123',
    ]);

    $plan = SubscriptionPlan::factory()->create();

    UserSubscription::create([
      'user_id'              => $user->id,
      'subscription_plan_id' => $plan->id,
      'started_at'           => now(),
      'expired_at'           => now()->addDays(30),
      'status'               => 'active',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson("/api/v1/user/products/{$product->slug}/credentials");

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Game credentials retrieved successfully',
        'data'    => [
          'id'       => $account->id,
          'username' => 'pass_user',
          'password' => 'pass_secret_123',
        ],
      ]);
  }

  public function test_user_without_subscription_or_direct_ownership_cannot_access_credentials(): void
  {
    $user = User::create([
      'name'     => 'Non Sub Gamer',
      'email'    => 'nonsubgame@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'                      => 'Sub Only Game',
      'slug'                      => 'sub-only-game',
      'is_subscription_supported' => true,
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson("/api/v1/user/products/{$product->slug}/credentials");

    $response->assertStatus(403)
      ->assertJson([
        'success' => false,
        'message' => 'You do not own this game',
        'data'    => null,
      ]);
  }

  public function test_user_with_expired_subscription_cannot_access_subscription_game_credentials(): void
  {
    $user = User::create([
      'name'     => 'Expired Sub Gamer',
      'email'    => 'expiredgamer@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'                      => 'Expired Access Game',
      'slug'                      => 'expired-access-game',
      'is_subscription_supported' => true,
    ]);

    $plan = SubscriptionPlan::factory()->create();

    UserSubscription::create([
      'user_id'              => $user->id,
      'subscription_plan_id' => $plan->id,
      'started_at'           => now()->subDays(60),
      'expired_at'           => now()->subDays(30),
      'status'               => 'expired',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson("/api/v1/user/products/{$product->slug}/credentials");

    $response->assertStatus(403)
      ->assertJson([
        'success' => false,
        'message' => 'You do not own this game',
        'data'    => null,
      ]);
  }
}
