<?php

namespace Tests\Feature\User;

use App\Models\GenreCategory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
  use RefreshDatabase;

  public function test_unauthenticated_user_cannot_access_cart(): void
  {
    $this->getJson('/api/v1/user/cart')->assertStatus(401);
    $this->postJson('/api/v1/user/cart', ['product_id' => 1])->assertStatus(401);
    $this->deleteJson('/api/v1/user/cart/1')->assertStatus(401);
  }

  public function test_authenticated_user_can_view_empty_cart(): void
  {
    $user = User::create([
      'name'     => 'Empty Cart User',
      'email'    => 'emptycart@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/cart');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Cart retrieved successfully',
        'data'    => [
          'total_prices' => 0,
          'items'        => [],
        ],
      ]);
  }

  public function test_cart_index_response_matches_user_specification(): void
  {
    $user = User::create([
      'name'     => 'Cart Spec User',
      'email'    => 'cartspec@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $game1 = Product::factory()->create([
      'name'           => 'Dead by Daylight',
      'slug'           => 'dead-by-daylight',
      'price'          => 439000,
      'discount_price' => 307300,
    ]);

    $game2 = Product::factory()->create([
      'name'           => 'Grand Theft Auto V',
      'slug'           => 'grand-theft-auto-v',
      'price'          => 299000,
      'discount_price' => 239200,
    ]);

    $user->cartItems()->attach([$game1->id, $game2->id]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/cart');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Cart retrieved successfully',
        'data'    => [
          'total_prices' => 546500, // 307300 + 239200
          'items'        => [
            [
              'id'             => $game1->id,
              'name'           => 'Dead by Daylight',
              'slug'           => 'dead-by-daylight',
              'price'          => 439000,
              'discount_price' => 307300,
              'discount'       => 30,
            ],
            [
              'id'             => $game2->id,
              'name'           => 'Grand Theft Auto V',
              'slug'           => 'grand-theft-auto-v',
              'price'          => 299000,
              'discount_price' => 239200,
              'discount'       => 20,
            ],
          ],
        ],
      ]);
  }

  public function test_authenticated_user_can_add_product_to_cart_by_id(): void
  {
    $user = User::create([
      'name'     => 'Cart Buyer',
      'email'    => 'cartbuyer@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'           => 'Dead by Daylight',
      'slug'           => 'dead-by-daylight',
      'price'          => 439000,
      'discount_price' => 307300,
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/cart', [
        'product_id' => $product->id,
      ]);

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Product added to cart successfully',
        'data'    => [
          'product_id'     => $product->id,
          'name'           => 'Dead by Daylight',
          'slug'           => 'dead-by-daylight',
          'price'          => 439000,
          'discount_price' => 307300,
          'discount'       => 30,
          'quantity'       => 1,
        ],
      ]);

    $this->assertDatabaseHas('user_cart_items', [
      'user_id'    => $user->id,
      'product_id' => $product->id,
    ]);
  }

  public function test_authenticated_user_can_add_product_to_cart_by_slug(): void
  {
    $user = User::create([
      'name'     => 'Slug Buyer',
      'email'    => 'slugbuyer@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'           => 'Cyberpunk 2077',
      'slug'           => 'cyberpunk-2077',
      'price'          => 600000,
      'discount_price' => 300000,
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/cart', [
        'product_slug' => 'cyberpunk-2077',
      ]);

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Product added to cart successfully',
        'data'    => [
          'product_id'     => $product->id,
          'name'           => 'Cyberpunk 2077',
          'slug'           => 'cyberpunk-2077',
          'price'          => 600000,
          'discount_price' => 300000,
          'discount'       => 50,
          'quantity'       => 1,
        ],
      ]);
  }

  public function test_cannot_add_nonexistent_product_to_cart(): void
  {
    $user = User::create([
      'name'     => 'Tester',
      'email'    => 'tester@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/cart', [
        'product_id' => 99999,
      ]);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
        'message' => 'Validation error',
      ]);
  }

  public function test_cannot_add_same_product_to_cart_twice(): void
  {
    $user = User::create([
      'name'     => 'Duplicate Tester',
      'email'    => 'dup@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create();

    $token = auth('api')->login($user);

    // First addition
    $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/cart', ['product_id' => $product->id])
      ->assertStatus(200);

    // Second addition must fail with 422
    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/cart', ['product_id' => $product->id]);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
        'message' => 'Product is already in your cart',
      ]);
  }

  public function test_cannot_add_already_owned_game_to_cart(): void
  {
    $user = User::create([
      'name'     => 'Owner Tester',
      'email'    => 'owner_test@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create();
    $user->ownedGames()->attach($product->id);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/cart', ['product_id' => $product->id]);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
        'message' => 'You already own this game',
      ]);
  }

  public function test_authenticated_user_can_remove_product_from_cart_via_route_param(): void
  {
    $user = User::create([
      'name'     => 'Remover User',
      'email'    => 'remover@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $product1 = Product::factory()->create(['price' => 500000, 'discount_price' => 400000]);
    $product2 = Product::factory()->create(['price' => 300000, 'discount_price' => 200000]);

    $user->cartItems()->attach([$product1->id, $product2->id]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->deleteJson("/api/v1/user/cart/{$product1->id}");

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Product removed from cart successfully',
        'data'    => [
          'total_prices' => 200000,
          'items'        => [
            [
              'id' => $product2->id,
            ],
          ],
        ],
      ]);

    $this->assertDatabaseMissing('user_cart_items', [
      'user_id'    => $user->id,
      'product_id' => $product1->id,
    ]);

    $this->assertDatabaseHas('user_cart_items', [
      'user_id'    => $user->id,
      'product_id' => $product2->id,
    ]);
  }

  public function test_authenticated_user_can_remove_product_from_cart_via_request_body(): void
  {
    $user = User::create([
      'name'     => 'Body Remover',
      'email'    => 'body_remover@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create();
    $user->cartItems()->attach($product->id);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->deleteJson('/api/v1/user/cart', [
        'product_id' => $product->id,
      ]);

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Product removed from cart successfully',
        'data'    => [
          'total_prices' => 0,
          'items'        => [],
        ],
      ]);

    $this->assertDatabaseMissing('user_cart_items', [
      'user_id'    => $user->id,
      'product_id' => $product->id,
    ]);
  }

  public function test_cannot_remove_product_not_in_cart(): void
  {
    $user = User::create([
      'name'     => 'Not in Cart User',
      'email'    => 'notincart@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create();

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->deleteJson("/api/v1/user/cart/{$product->id}");

    $response->assertStatus(404)
      ->assertJson([
        'success' => false,
        'message' => 'Product not found in cart',
      ]);
  }

  public function test_authenticated_user_can_clear_cart(): void
  {
    $user = User::create([
      'name'     => 'Clear Cart User',
      'email'    => 'clearcart@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $products = Product::factory()->count(3)->create();
    $user->cartItems()->attach($products->pluck('id'));

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->deleteJson('/api/v1/user/cart/clear');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Cart cleared successfully',
        'data'    => [
          'total_prices' => 0,
          'items'        => [],
        ],
      ]);

    $this->assertDatabaseEmpty('user_cart_items');
  }

  public function test_cart_isolates_data_between_users(): void
  {
    $userA = User::create([
      'name'     => 'User Alpha',
      'email'    => 'alpha@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $userB = User::create([
      'name'     => 'User Beta',
      'email'    => 'beta@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $productA = Product::factory()->create(['name' => 'Game A']);
    $productB = Product::factory()->create(['name' => 'Game B']);

    $userA->cartItems()->attach($productA->id);
    $userB->cartItems()->attach($productB->id);

    $tokenA = auth('api')->login($userA);

    $response = $this->withHeader('Authorization', "Bearer {$tokenA}")
      ->getJson('/api/v1/user/cart');

    $response->assertStatus(200);
    $items = $response->json('data.items');
    $this->assertCount(1, $items);
    $this->assertEquals($productA->id, $items[0]['id']);
  }
}
