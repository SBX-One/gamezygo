<?php

namespace Tests\Feature\User;

use App\Models\Product;
use App\Models\ProductGameAccount;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductCredentialsTest extends TestCase
{
  use RefreshDatabase;

  public function test_unauthenticated_user_cannot_access_product_credentials(): void
  {
    $response = $this->getJson('/api/v1/user/products/some-game-slug/credentials');

    $response->assertStatus(401);
  }

  public function test_user_cannot_access_credentials_of_nonexistent_product(): void
  {
    $user = User::create([
      'name'     => 'Gamer One',
      'email'    => 'gamer1@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/products/non-existent-game/credentials');

    $response->assertStatus(404)
      ->assertJson([
        'success' => false,
        'message' => 'Product not found',
        'data'    => null,
      ]);
  }

  public function test_user_cannot_access_credentials_if_game_not_owned(): void
  {
    $user = User::create([
      'name'     => 'Gamer Two',
      'email'    => 'gamer2@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'                      => "Assassin's Creed Black Flag",
      'slug'                      => 'assassins-creed-black-flag',
      'is_subscription_supported' => false,
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

  public function test_authenticated_user_can_access_credentials_for_directly_owned_game(): void
  {
    $user = User::create([
      'name'     => 'Game Owner',
      'email'    => 'owner@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'                      => 'Grand Theft Auto V',
      'slug'                      => 'grand-theft-auto-v',
      'is_subscription_supported' => false,
    ]);

    // Update account with specific credentials
    $account = $product->gameAccounts;
    $account->update([
      'username' => 'gameuser123',
      'password' => 'GamePassword123',
    ]);

    // Attach to user owned games
    $user->ownedGames()->attach($product->id);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson("/api/v1/user/products/{$product->slug}/credentials");

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Game credentials retrieved successfully',
        'data'    => [
          'id'       => $account->id,
          'username' => 'gameuser123',
          'password' => 'GamePassword123',
        ],
      ]);
  }

  public function test_authenticated_user_can_access_credentials_via_active_subscription(): void
  {
    $user = User::create([
      'name'     => 'Subscriber User',
      'email'    => 'subscriber@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'                      => 'Spider-Man Remastered',
      'slug'                      => 'spider-man-remastered',
      'is_subscription_supported' => true,
    ]);

    $account = $product->gameAccounts;
    $account->update([
      'username' => 'sub_gamer_99',
      'password' => 'SubPass2026',
    ]);

    $plan = SubscriptionPlan::factory()->create();

    UserSubscription::create([
      'user_id'              => $user->id,
      'subscription_plan_id' => $plan->id,
      'started_at'           => now(),
      'expired_at'           => now()->addMonth(),
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
          'username' => 'sub_gamer_99',
          'password' => 'SubPass2026',
        ],
      ]);
  }

  public function test_user_with_subscription_cannot_access_game_if_subscription_not_supported(): void
  {
    $user = User::create([
      'name'     => 'Subscriber User Two',
      'email'    => 'subscriber2@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'                      => 'Exclusive AAA Game',
      'slug'                      => 'exclusive-aaa-game',
      'is_subscription_supported' => false,
    ]);

    $plan = SubscriptionPlan::factory()->create();

    UserSubscription::create([
      'user_id'              => $user->id,
      'subscription_plan_id' => $plan->id,
      'started_at'           => now(),
      'expired_at'           => now()->addMonth(),
      'status'               => 'active',
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

  public function test_returns_404_if_product_owned_but_has_no_credentials_configured(): void
  {
    $user = User::create([
      'name'     => 'Game Owner Two',
      'email'    => 'owner2@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'                      => 'No Credential Game',
      'slug'                      => 'no-credential-game',
      'is_subscription_supported' => false,
    ]);

    // Delete existing game account so product has none
    $product->gameAccounts()->delete();

    $user->ownedGames()->attach($product->id);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson("/api/v1/user/products/{$product->slug}/credentials");

    $response->assertStatus(404)
      ->assertJson([
        'success' => false,
        'message' => 'Game credentials not available for this product',
        'data'    => null,
      ]);
  }

  public function test_decrypts_encrypted_credentials_properly(): void
  {
    $user = User::create([
      'name'     => 'Crypto Gamer',
      'email'    => 'crypto@example.com',
      'password' => bcrypt('password123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'                      => 'Encrypted Game',
      'slug'                      => 'encrypted-game',
      'is_subscription_supported' => false,
    ]);

    $product->gameAccounts->update([
      'username' => encrypt('encrypted_username'),
      'password' => encrypt('SuperSecretPassword99'),
    ]);

    $user->ownedGames()->attach($product->id);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson("/api/v1/user/products/{$product->slug}/credentials");

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Game credentials retrieved successfully',
        'data'    => [
          'username' => 'encrypted_username',
          'password' => 'SuperSecretPassword99',
        ],
      ]);
  }
}
