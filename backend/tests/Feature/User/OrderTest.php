<?php

namespace Tests\Feature\User;

use App\Models\File;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_create_order(): void
    {
        $response = $this->postJson('/api/v1/user/orders', [
            'item_type' => 'product',
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
            'name' => 'Assassin\'s Creed Black Flag Resynced',
            'price' => 307300,
            'discount_price' => 0,
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/orders', [
                'item_type' => 'product',
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
            'id' => $responseData['id'],
            'user_id' => $user->id,
            'subtotal_price' => 307300,
            'discount_amount' => 0,
            'total_price' => 307300,
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('order_items', [
            'order_id' => $responseData['id'],
            'purchasable_type' => Product::class,
            'purchasable_id' => $product->id,
            'price' => 307300,
        ]);
    }

    public function test_create_order_applies_discount_price_when_available(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $product = Product::factory()->create([
            'price' => 400000,
            'discount_price' => 307300,
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/orders', [
                'item_type' => 'product',
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
                'item_type' => 'product',
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
                'item_type' => 'unknown_type',
                'product_id' => 1,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['item_type']);
    }

    public function test_authenticated_user_can_retrieve_order_details(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $product = Product::factory()->create([
            'name' => 'Assassin\'s Creed Black Flag Resynced',
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
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-001',
            'subtotal_price' => 307300,
            'discount_amount' => 0,
            'total_price' => 307300,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $orderItem = OrderItem::create([
            'order_id' => $order->id,
            'purchasable_type' => Product::class,
            'purchasable_id' => $product->id,
            'price' => 307300,
        ]);

        $token = auth('api')->login($user);

        // Retrieve by order ID
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/v1/user/orders/{$order->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Order retrieved successfully',
                'data' => [
                    'id' => $order->id,
                    'order_number' => 'ORD-20260908-001',
                    'status' => 'pending',
                    'subtotal_price' => 307300,
                    'discount_amount' => 0,
                    'total_price' => 307300,
                    'order_items' => [
                        [
                            'id' => $orderItem->id,
                            'item_type' => 'product',
                            'product' => [
                                'id' => $product->id,
                                'name' => 'Assassin\'s Creed Black Flag Resynced',
                                'thumbnail' => 'https://example.com/products/assassins-creed.jpg',
                            ],
                            'price' => 307300,
                        ],
                    ],
                    'payment' => null,
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
            'user_id' => $owner->id,
            'order_code' => 'ORD-20260908-002',
            'subtotal_price' => 200000,
            'discount_amount' => 0,
            'total_price' => 200000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
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

    public function test_authenticated_user_can_apply_fixed_voucher_successfully(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $voucher = Voucher::create([
            'name' => 'Diskon Game 50K',
            'code' => 'GAME50',
            'discount_type' => 'fixed',
            'discount_amount' => 50000,
            'max_discount' => 0,
            'min_purchase' => 100000,
            'applies_to' => 'all',
            'target_type' => 'all_users',
            'product_scope' => 'all_products',
            'slot' => 100,
            'usage_limit_per_user' => 1,
            'total_usage' => 0,
            'is_active' => true,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-001',
            'subtotal_price' => 307300,
            'discount_amount' => 0,
            'total_price' => 307300,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/orders/{$order->id}/voucher", [
                'voucher_code' => 'GAME50',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Voucher applied successfully',
                'data' => [
                    'order_number' => 'ORD-20260908-001',
                    'voucher_id' => $voucher->id,
                    'subtotal_price' => 307300,
                    'discount_amount' => 50000,
                    'total_price' => 257300,
                ],
            ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'voucher_id' => $voucher->id,
            'discount_amount' => 50000,
            'total_price' => 257300,
        ]);
    }

    public function test_authenticated_user_can_apply_percentage_voucher_with_max_discount(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $voucher = Voucher::create([
            'name' => 'Diskon 50% Max 40K',
            'code' => 'DISC50',
            'discount_type' => 'percentage',
            'discount_amount' => 50,
            'max_discount' => 40000,
            'min_purchase' => 50000,
            'is_active' => true,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-002',
            'subtotal_price' => 200000,
            'discount_amount' => 0,
            'total_price' => 200000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/orders/{$order->order_code}/voucher", [
                'voucher_code' => 'DISC50',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Voucher applied successfully',
                'data' => [
                    'order_number' => 'ORD-20260908-002',
                    'voucher_id' => $voucher->id,
                    'subtotal_price' => 200000,
                    'discount_amount' => 40000,
                    'total_price' => 160000,
                ],
            ]);
    }

    public function test_apply_voucher_fails_if_voucher_code_invalid(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-003',
            'subtotal_price' => 307300,
            'discount_amount' => 0,
            'total_price' => 307300,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/orders/{$order->id}/voucher", [
                'voucher_code' => 'NON_EXISTENT',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid voucher code.',
            ]);
    }

    public function test_apply_voucher_fails_if_voucher_inactive_or_expired(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $expiredVoucher = Voucher::create([
            'name' => 'Expired Voucher',
            'code' => 'EXPIRED',
            'discount_type' => 'fixed',
            'discount_amount' => 10000,
            'expired_at' => now()->subDay(),
            'is_active' => true,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-004',
            'subtotal_price' => 307300,
            'discount_amount' => 0,
            'total_price' => 307300,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/orders/{$order->id}/voucher", [
                'voucher_code' => 'EXPIRED',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Voucher has expired.',
            ]);
    }

    public function test_apply_voucher_fails_if_min_purchase_not_reached(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $voucher = Voucher::create([
            'name' => 'High Min Purchase',
            'code' => 'MIN500K',
            'discount_type' => 'fixed',
            'discount_amount' => 50000,
            'min_purchase' => 500000,
            'is_active' => true,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-005',
            'subtotal_price' => 300000,
            'discount_amount' => 0,
            'total_price' => 300000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/orders/{$order->id}/voucher", [
                'voucher_code' => 'MIN500K',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_apply_voucher_fails_if_order_is_not_pending(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $voucher = Voucher::create([
            'name' => 'Valid Voucher',
            'code' => 'VALID10',
            'discount_type' => 'fixed',
            'discount_amount' => 10000,
            'is_active' => true,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-006',
            'subtotal_price' => 300000,
            'discount_amount' => 0,
            'total_price' => 300000,
            'status' => 'paid',
            'expired_at' => now()->addHours(24),
            'paid_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/orders/{$order->id}/voucher", [
                'voucher_code' => 'VALID10',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Voucher can only be applied to pending orders.',
            ]);
    }

    public function test_authenticated_user_can_remove_applied_voucher_successfully(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $voucher = Voucher::create([
            'name' => 'Diskon Game 50K',
            'code' => 'GAME50',
            'discount_type' => 'fixed',
            'discount_amount' => 50000,
            'is_active' => true,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-001',
            'voucher_id' => $voucher->id,
            'subtotal_price' => 307300,
            'discount_amount' => 50000,
            'total_price' => 257300,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/v1/user/orders/{$order->id}/voucher");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Voucher removed successfully',
                'data' => [
                    'order_number' => 'ORD-20260908-001',
                    'voucher_id' => null,
                    'subtotal_price' => 307300,
                    'discount_amount' => 0,
                    'total_price' => 307300,
                ],
            ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'voucher_id' => null,
            'discount_amount' => 0,
            'total_price' => 307300,
        ]);
    }

    public function test_remove_voucher_fails_if_order_has_no_voucher_applied(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-007',
            'voucher_id' => null,
            'subtotal_price' => 307300,
            'discount_amount' => 0,
            'total_price' => 307300,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/v1/user/orders/{$order->id}/voucher");

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'No voucher is currently applied to this order.',
            ]);
    }

    public function test_user_cannot_apply_or_remove_voucher_on_another_users_order(): void
    {
        $owner = User::factory()->create(['status' => 'active']);
        $otherUser = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($otherUser);

        $order = Order::create([
            'user_id' => $owner->id,
            'order_code' => 'ORD-20260908-008',
            'subtotal_price' => 300000,
            'discount_amount' => 0,
            'total_price' => 300000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $responseApply = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/orders/{$order->id}/voucher", [
                'voucher_code' => 'GAME50',
            ]);

        $responseApply->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Order not found',
            ]);

        $responseRemove = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/v1/user/orders/{$order->id}/voucher");

        $responseRemove->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Order not found',
            ]);
    }

    public function test_voucher_can_be_applied_and_removed_via_voucher_endpoint(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $voucher = Voucher::create([
            'name' => 'Voucher 50K',
            'code' => 'GAME50',
            'discount_type' => 'fixed',
            'discount_amount' => 50000,
            'is_active' => true,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-009',
            'subtotal_price' => 300000,
            'discount_amount' => 0,
            'total_price' => 300000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        // Test POST /{orderId}/voucher
        $responseApply = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/orders/{$order->order_code}/voucher", [
                'voucher_code' => 'GAME50',
            ]);

        $responseApply->assertStatus(200)
            ->assertJsonPath('data.voucher_id', $voucher->id)
            ->assertJsonPath('data.total_price', 250000);

        // Test DELETE /{orderId}/voucher
        $responseRemove = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/v1/user/orders/{$order->order_code}/voucher");

        $responseRemove->assertStatus(200)
            ->assertJsonPath('data.voucher_id', null)
            ->assertJsonPath('data.total_price', 300000);
    }

    public function test_apply_voucher_fails_if_voucher_is_subscription_only_and_order_is_products(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $product = Product::factory()->create(['price' => 300000]);

        $voucher = Voucher::create([
            'name' => 'Subscription Only Voucher',
            'code' => 'SUBONLY',
            'discount_type' => 'fixed',
            'discount_amount' => 50000,
            'applies_to' => 'subscription',
            'is_active' => true,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-010',
            'subtotal_price' => 300000,
            'discount_amount' => 0,
            'total_price' => 300000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $order->items()->create([
            'purchasable_type' => Product::class,
            'purchasable_id' => $product->id,
            'price' => 300000,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/orders/{$order->id}/voucher", [
                'voucher_code' => 'SUBONLY',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'This voucher can only be used for subscription purchases.',
            ]);
    }

    public function test_apply_voucher_fails_if_voucher_is_product_only_and_order_is_subscription(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $plan = SubscriptionPlan::factory()->create(['price' => 200000]);

        $voucher = Voucher::create([
            'name' => 'Product Only Voucher',
            'code' => 'PRODONLY',
            'discount_type' => 'fixed',
            'discount_amount' => 25000,
            'applies_to' => 'one_time',
            'is_active' => true,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-011',
            'subtotal_price' => 200000,
            'discount_amount' => 0,
            'total_price' => 200000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $order->items()->create([
            'purchasable_type' => SubscriptionPlan::class,
            'purchasable_id' => $plan->id,
            'price' => 200000,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/orders/{$order->id}/voucher", [
                'voucher_code' => 'PRODONLY',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'This voucher can only be used for product purchases.',
            ]);
    }

    public function test_apply_voucher_succeeds_when_applies_to_is_all(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $product = Product::factory()->create(['price' => 300000]);

        $voucher = Voucher::create([
            'name' => 'All Items Voucher',
            'code' => 'ALLITEMS',
            'discount_type' => 'fixed',
            'discount_amount' => 50000,
            'applies_to' => 'all',
            'is_active' => true,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-20260908-012',
            'subtotal_price' => 300000,
            'discount_amount' => 0,
            'total_price' => 300000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
            'paid_at' => null,
        ]);

        $order->items()->create([
            'purchasable_type' => Product::class,
            'purchasable_id' => $product->id,
            'price' => 300000,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/orders/{$order->id}/voucher", [
                'voucher_code' => 'ALLITEMS',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Voucher applied successfully',
                'data' => [
                    'order_number' => 'ORD-20260908-012',
                    'total_price' => 250000,
                ],
            ]);
    }

    public function test_authenticated_user_can_create_subscription_order_successfully(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $plan = SubscriptionPlan::create([
            'name' => 'Pro Gaming Monthly',
            'price' => 99000,
            'duration_days' => 30,
            'is_active' => true,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/orders', [
                'item_type' => 'subscription',
                'subscription_plan_id' => $plan->id,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => [
                    'subtotal_price' => 99000,
                    'discount_amount' => 0,
                    'total_price' => 99000,
                ],
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total_price' => 99000,
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('order_items', [
            'purchasable_type' => SubscriptionPlan::class,
            'purchasable_id' => $plan->id,
            'price' => 99000,
        ]);
    }

    public function test_create_subscription_order_fails_with_invalid_plan(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/orders', [
                'item_type' => 'subscription',
                'subscription_plan_id' => 99999,
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation error',
            ]);
    }

    public function test_authenticated_user_can_checkout_entire_cart_successfully(): void
    {
        $user = User::factory()->create(['status' => 'active']);

        $productA = Product::factory()->create([
            'name' => 'Cyberpunk 2077',
            'price' => 500000,
            'discount_price' => 350000,
        ]);

        $productB = Product::factory()->create([
            'name' => 'Witcher 3',
            'price' => 200000,
            'discount_price' => 0,
        ]);

        $credA = \App\Models\GameCredential::create([
            'product_id' => $productA->id,
            'username' => encrypt('user_a'),
            'password' => encrypt('pass_a'),
            'status' => 'available',
        ]);

        $credB = \App\Models\GameCredential::create([
            'product_id' => $productB->id,
            'username' => encrypt('user_b'),
            'password' => encrypt('pass_b'),
            'status' => 'available',
        ]);

        $user->cartItems()->attach([$productA->id, $productB->id]);
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/orders', [
                'item_type' => 'cart',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => [
                    'subtotal_price' => 550000,
                    'discount_amount' => 0,
                    'total_price' => 550000,
                    'status' => 'pending',
                ],
            ]);

        $orderId = $response->json('data.id');

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'user_id' => $user->id,
            'total_price' => 550000,
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('order_items', [
            'order_id' => $orderId,
            'purchasable_id' => $productA->id,
            'price' => 350000,
        ]);

        $this->assertDatabaseHas('order_items', [
            'order_id' => $orderId,
            'purchasable_id' => $productB->id,
            'price' => 200000,
        ]);

        // Cart must be emptied after checkout
        $this->assertDatabaseEmpty('user_cart_items');

        // Credentials must be reserved
        $this->assertDatabaseHas('game_credentials', [
            'id' => $credA->id,
            'status' => 'reserved',
            'assigned_to_user_id' => $user->id,
        ]);

        $this->assertDatabaseHas('game_credentials', [
            'id' => $credB->id,
            'status' => 'reserved',
            'assigned_to_user_id' => $user->id,
        ]);
    }

    public function test_cannot_checkout_empty_cart(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/orders', [
                'item_type' => 'cart',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Keranjang belanja Anda kosong.',
            ]);
    }
}
