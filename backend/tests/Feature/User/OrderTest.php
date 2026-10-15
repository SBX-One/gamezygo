<?php

namespace Tests\Feature\User;

use App\Models\File;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
  use RefreshDatabase;

  public function test_unauthenticated_user_cannot_create_order(): void
  {
    $response = $this->postJson('/api/v1/user/orders', [
      'item_type'  => 'product',
      'product_id' => 1,
    ]);

    $response->assertStatus(401);
  }

  public function test_authenticated_user_can_create_order_successfully(): void
  {
    $user = User::factory()->create([
      'status' => 'active',
    ]);

    $product = Product::factory()->create([
      'name'           => 'Assassin\'s Creed Black Flag Resynced',
      'price'          => 307300,
      'discount_price' => 0,
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/orders', [
        'item_type'  => 'product',
        'product_id' => $product->id,
      ]);

    $response->assertStatus(201)
      ->assertJson([
        'success' => true,
        'message' => 'Order created successfully',
      ])
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'id',
          'order_number',
          'status',
          'subtotal_price',
          'discount_amount',
          'total_price',
          'expires_at',
        ],
      ]);

    $responseData = $response->json('data');
    $this->assertEquals('pending', $responseData['status']);
    $this->assertEquals(307300, $responseData['subtotal_price']);
    $this->assertEquals(0, $responseData['discount_amount']);
    $this->assertEquals(307300, $responseData['total_price']);
    $this->assertStringStartsWith('ORD-', $responseData['order_number']);
    $this->assertNotNull($responseData['expires_at']);

    $this->assertDatabaseHas('orders', [
      'id'              => $responseData['id'],
      'user_id'         => $user->id,
      'subtotal_price'  => 307300,
      'discount_amount' => 0,
      'total_price'     => 307300,
      'status'          => 'pending',
    ]);

    $this->assertDatabaseHas('order_items', [
      'order_id'         => $responseData['id'],
      'purchasable_type' => Product::class,
      'purchasable_id'   => $product->id,
      'price'            => 307300,
    ]);
  }

  public function test_create_order_applies_discount_price_when_available(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $product = Product::factory()->create([
      'price'          => 400000,
      'discount_price' => 307300,
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/orders', [
        'item_type'  => 'product',
        'product_id' => $product->id,
      ]);

    $response->assertStatus(201);
    $this->assertEquals(307300, $response->json('data.total_price'));
  }

  public function test_create_order_validation_fails_with_invalid_product(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/orders', [
        'item_type'  => 'product',
        'product_id' => 99999,
      ]);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
      ])
      ->assertJsonValidationErrors(['product_id']);
  }

  public function test_create_order_validation_fails_with_invalid_item_type(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/orders', [
        'item_type'  => 'unknown_type',
        'product_id' => 1,
      ]);

    $response->assertStatus(422)
      ->assertJsonValidationErrors(['item_type']);
  }

  public function test_authenticated_user_can_retrieve_order_details(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $product = Product::factory()->create([
      'name'  => 'Assassin\'s Creed Black Flag Resynced',
      'price' => 307300,
    ]);

    // Attach a file as thumbnail
    $product->files()->create([
      'file_name' => 'assassins-creed.jpg',
      'file_type' => 'image/jpeg',
      'file_path' => 'https://example.com/products/assassins-creed.jpg',
      'file_size' => 1024,
    ]);

    $order = Order::create([
      'user_id'         => $user->id,
      'order_code'      => 'ORD-20260908-001',
      'subtotal_price'  => 307300,
      'discount_amount' => 0,
      'total_price'     => 307300,
      'status'          => 'pending',
      'expired_at'      => now()->addHours(24),
      'paid_at'         => null,
    ]);

    $orderItem = OrderItem::create([
      'order_id'         => $order->id,
      'purchasable_type' => Product::class,
      'purchasable_id'   => $product->id,
      'price'            => 307300,
    ]);

    $token = auth('api')->login($user);

    // Retrieve by order ID
    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson("/api/v1/user/orders/{$order->id}");

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Order retrieved successfully',
        'data'    => [
          'id'              => $order->id,
          'order_number'    => 'ORD-20260908-001',
          'status'          => 'pending',
          'subtotal_price'  => 307300,
          'discount_amount' => 0,
          'total_price'     => 307300,
          'order_items'     => [
            [
              'id'        => $orderItem->id,
              'item_type' => 'product',
              'product'   => [
                'id'        => $product->id,
                'name'      => 'Assassin\'s Creed Black Flag Resynced',
                'thumbnail' => 'https://example.com/products/assassins-creed.jpg',
              ],
              'price'     => 307300,
            ],
          ],
          'payment'         => null,
        ],
      ]);

    // Retrieve by order_number string
    $responseByCode = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson("/api/v1/user/orders/{$order->order_code}");

    $responseByCode->assertStatus(200)
      ->assertJsonPath('data.order_number', 'ORD-20260908-001');
  }

  public function test_user_cannot_view_another_users_order(): void
  {
    $owner = User::factory()->create(['status' => 'active']);
    $otherUser = User::factory()->create(['status' => 'active']);

    $order = Order::create([
      'user_id'         => $owner->id,
      'order_code'      => 'ORD-20260908-002',
      'subtotal_price'  => 200000,
      'discount_amount' => 0,
      'total_price'     => 200000,
      'status'          => 'pending',
      'expired_at'      => now()->addHours(24),
      'paid_at'         => null,
    ]);

    $token = auth('api')->login($otherUser);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson("/api/v1/user/orders/{$order->id}");

    $response->assertStatus(404)
      ->assertJson([
        'success' => false,
        'message' => 'Order not found',
      ]);
  }
}
