<?php

namespace Tests\Feature\User;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
{
  use RefreshDatabase;

  public function test_unauthenticated_user_cannot_pay(): void
  {
    $response = $this->postJson('/api/v1/user/orders/1/pay', [
      'payment_method' => 'qris',
    ]);

    $response->assertStatus(401);
  }

  public function test_authenticated_user_can_create_payment_successfully(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($user);

    $product = Product::factory()->create(['price' => 307300]);

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

    $order->items()->create([
      'purchasable_type' => Product::class,
      'purchasable_id'   => $product->id,
      'price'            => 307300,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson("/api/v1/user/orders/{$order->id}/pay", [
        'payment_method' => 'qris',
      ]);

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Payment created successfully',
        'data'    => [
          'order_id'       => $order->id,
          'payment_method' => 'qris',
          'amount'         => 307300,
          'status'         => 'pending',
        ],
      ])
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'id',
          'order_id',
          'payment_method',
          'gateway_reference',
          'amount',
          'status',
          'expired_at',
        ],
      ]);

    $responseData = $response->json('data');
    $this->assertStringStartsWith('TRX-', $responseData['gateway_reference']);
    $this->assertNotNull($responseData['expired_at']);

    $this->assertDatabaseHas('payments', [
      'id'                => $responseData['id'],
      'order_id'          => $order->id,
      'payment_method'    => 'qris',
      'gateway_reference' => $responseData['gateway_reference'],
      'amount'            => 307300,
      'status'            => 'pending',
    ]);
  }

  public function test_pay_fails_when_order_not_found(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/orders/9999/pay', [
        'payment_method' => 'qris',
      ]);

    $response->assertStatus(404)
      ->assertJson([
        'success' => false,
        'message' => 'Order not found',
      ]);
  }

  public function test_pay_fails_when_order_belongs_to_another_user(): void
  {
    $owner = User::factory()->create(['status' => 'active']);
    $otherUser = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($otherUser);

    $order = Order::create([
      'user_id'         => $owner->id,
      'order_code'      => 'ORD-20260908-002',
      'subtotal_price'  => 307300,
      'discount_amount' => 0,
      'total_price'     => 307300,
      'status'          => 'pending',
      'expired_at'      => now()->addHours(24),
      'paid_at'         => null,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson("/api/v1/user/orders/{$order->id}/pay", [
        'payment_method' => 'qris',
      ]);

    $response->assertStatus(404)
      ->assertJson([
        'success' => false,
        'message' => 'Order not found',
      ]);
  }

  public function test_pay_fails_when_order_is_already_paid(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($user);

    $order = Order::create([
      'user_id'         => $user->id,
      'order_code'      => 'ORD-20260908-003',
      'subtotal_price'  => 307300,
      'discount_amount' => 0,
      'total_price'     => 307300,
      'status'          => 'paid',
      'expired_at'      => now()->addHours(24),
      'paid_at'         => now(),
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson("/api/v1/user/orders/{$order->id}/pay", [
        'payment_method' => 'qris',
      ]);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
        'message' => 'Order has already been paid.',
      ]);
  }

  public function test_pay_fails_when_order_has_expired(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($user);

    $order = Order::create([
      'user_id'         => $user->id,
      'order_code'      => 'ORD-20260908-004',
      'subtotal_price'  => 307300,
      'discount_amount' => 0,
      'total_price'     => 307300,
      'status'          => 'pending',
      'expired_at'      => now()->subMinute(),
      'paid_at'         => null,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson("/api/v1/user/orders/{$order->id}/pay", [
        'payment_method' => 'qris',
      ]);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
        'message' => 'Order has expired.',
      ]);
  }

  public function test_pay_fails_when_order_is_cancelled(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($user);

    $order = Order::create([
      'user_id'         => $user->id,
      'order_code'      => 'ORD-20260908-005',
      'subtotal_price'  => 307300,
      'discount_amount' => 0,
      'total_price'     => 307300,
      'status'          => 'cancelled',
      'expired_at'      => now()->addHours(24),
      'paid_at'         => null,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson("/api/v1/user/orders/{$order->id}/pay", [
        'payment_method' => 'qris',
      ]);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
        'message' => 'Cannot pay for a cancelled order.',
      ]);
  }

  public function test_authenticated_user_can_retrieve_payment_status_by_reference(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($user);

    $product = Product::factory()->create([
      'name'  => 'Assassin\'s Creed Black Flag Resynced',
      'price' => 307300,
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

    $orderItem = $order->items()->create([
      'purchasable_type' => Product::class,
      'purchasable_id'   => $product->id,
      'price'            => 307300,
    ]);

    $payment = Payment::create([
      'order_id'          => $order->id,
      'payment_method'    => 'qris',
      'gateway_reference' => 'TRX-20260908-0001',
      'amount'            => 307300,
      'status'            => 'pending',
      'expired_at'        => now()->addMinutes(20),
      'paid_at'           => null,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/payments/TRX-20260908-0001/status');

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
                'id'   => $product->id,
                'name' => 'Assassin\'s Creed Black Flag Resynced',
              ],
              'price'     => 307300,
            ],
          ],
          'payment'         => [
            'id'                => $payment->id,
            'payment_method'    => 'qris',
            'gateway_reference' => 'TRX-20260908-0001',
            'amount'            => 307300,
            'status'            => 'pending',
          ],
        ],
      ]);
  }

  public function test_check_status_fails_when_reference_does_not_exist(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/payments/TRX-NON-EXISTENT/status');

    $response->assertStatus(404)
      ->assertJson([
        'success' => false,
        'message' => 'Order not found',
      ]);
  }

  public function test_authenticated_user_can_pay_using_order_code(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($user);

    $product = Product::factory()->create(['price' => 307300]);

    $order = Order::create([
      'user_id'         => $user->id,
      'order_code'      => 'ORD-20260908-088',
      'subtotal_price'  => 307300,
      'discount_amount' => 0,
      'total_price'     => 307300,
      'status'          => 'pending',
      'expired_at'      => now()->addHours(24),
      'paid_at'         => null,
    ]);

    $order->items()->create([
      'purchasable_type' => Product::class,
      'purchasable_id'   => $product->id,
      'price'            => 307300,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson("/api/v1/user/orders/{$order->order_code}/pay", [
        'payment_method' => 'qris',
      ]);

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Payment created successfully',
      ]);
  }

  public function test_authenticated_user_can_retrieve_payment_status_using_query_param(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $token = auth('api')->login($user);

    $order = Order::create([
      'user_id'         => $user->id,
      'order_code'      => 'ORD-20260908-099',
      'subtotal_price'  => 307300,
      'discount_amount' => 0,
      'total_price'     => 307300,
      'status'          => 'pending',
      'expired_at'      => now()->addHours(24),
      'paid_at'         => null,
    ]);

    $payment = Payment::create([
      'order_id'          => $order->id,
      'payment_method'    => 'qris',
      'gateway_reference' => 'TRX-20260908-0099',
      'amount'            => 307300,
      'status'            => 'pending',
      'expired_at'        => now()->addMinutes(20),
      'paid_at'           => null,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/payments/status?references=TRX-20260908-0099');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Order retrieved successfully',
        'data'    => [
          'order_number' => 'ORD-20260908-099',
        ],
      ]);
  }

  public function test_webhook_handles_settlement_notification_successfully(): void
  {
    $user = User::factory()->create(['status' => 'active']);
    $product = Product::factory()->create(['price' => 307300]);

    $order = Order::create([
      'user_id'         => $user->id,
      'order_code'      => 'ORD-20260908-100',
      'subtotal_price'  => 307300,
      'discount_amount' => 0,
      'total_price'     => 307300,
      'status'          => 'pending',
      'expired_at'      => now()->addHours(24),
      'paid_at'         => null,
    ]);

    $order->items()->create([
      'purchasable_type' => Product::class,
      'purchasable_id'   => $product->id,
      'price'            => 307300,
    ]);

    $payment = Payment::create([
      'order_id'          => $order->id,
      'payment_method'    => 'qris',
      'gateway_reference' => 'TRX-20260908-0100',
      'amount'            => 307300,
      'status'            => 'pending',
      'expired_at'        => now()->addMinutes(20),
      'paid_at'           => null,
    ]);

    $serverKey = (string) config('services.midtrans.server_key');
    $signature = hash('sha512', 'TRX-20260908-0100' . '200' . '307300.00' . $serverKey);

    $response = $this->postJson('/api/v1/payments/webhook', [
      'order_id'           => 'TRX-20260908-0100',
      'status_code'        => '200',
      'gross_amount'       => '307300.00',
      'transaction_status' => 'settlement',
      'fraud_status'       => 'accept',
      'signature_key'      => $signature,
    ]);

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Notification handled successfully',
      ]);

    $this->assertDatabaseHas('orders', [
      'id'     => $order->id,
      'status' => 'paid',
    ]);

    $this->assertDatabaseHas('payments', [
      'id'     => $payment->id,
      'status' => 'success',
    ]);

    $this->assertTrue($user->fresh()->ownedGames->contains($product->id));
  }

  public function test_webhook_handles_expire_notification(): void
  {
    $user = User::factory()->create(['status' => 'active']);

    $order = Order::create([
      'user_id'         => $user->id,
      'order_code'      => 'ORD-20260908-101',
      'subtotal_price'  => 307300,
      'discount_amount' => 0,
      'total_price'     => 307300,
      'status'          => 'pending',
      'expired_at'      => now()->addHours(24),
      'paid_at'         => null,
    ]);

    $payment = Payment::create([
      'order_id'          => $order->id,
      'payment_method'    => 'qris',
      'gateway_reference' => 'TRX-20260908-0101',
      'amount'            => 307300,
      'status'            => 'pending',
      'expired_at'        => now()->addMinutes(20),
      'paid_at'           => null,
    ]);

    $serverKey = (string) config('services.midtrans.server_key');
    $signature = hash('sha512', 'TRX-20260908-0101' . '200' . '307300.00' . $serverKey);

    $response = $this->postJson('/api/v1/payments/webhook', [
      'order_id'           => 'TRX-20260908-0101',
      'status_code'        => '200',
      'gross_amount'       => '307300.00',
      'transaction_status' => 'expire',
      'signature_key'      => $signature,
    ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('orders', [
      'id'     => $order->id,
      'status' => 'expired',
    ]);

    $this->assertDatabaseHas('payments', [
      'id'     => $payment->id,
      'status' => 'expired',
    ]);
  }

  public function test_webhook_fails_with_invalid_signature(): void
  {
    config(['services.midtrans.server_key' => 'SB-Mid-server-sample-key']);

    $response = $this->postJson('/api/v1/payments/webhook', [
      'order_id'           => 'TRX-20260908-0100',
      'status_code'        => '200',
      'gross_amount'       => '307300.00',
      'transaction_status' => 'settlement',
      'signature_key'      => 'invalid_signature_hash',
    ]);

    $response->assertStatus(403)
      ->assertJson([
        'error' => 'Invalid signature verification',
      ]);
  }
}
