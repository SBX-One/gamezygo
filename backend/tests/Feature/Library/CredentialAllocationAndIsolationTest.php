<?php

namespace Tests\Feature\Library;

use App\Models\GameCredential;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Payment\PaymentRepositoryInterface;
use App\Services\Credential\CredentialAllocationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CredentialAllocationAndIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected User $userA;

    protected User $userB;

    protected Product $product;

    protected CredentialAllocationService $allocationService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->allocationService = app(CredentialAllocationService::class);

        $this->userA = User::factory()->create([
            'status' => 'active',
            'email' => 'user_a@example.com',
        ]);

        $this->userB = User::factory()->create([
            'status' => 'active',
            'email' => 'user_b@example.com',
        ]);

        $launcher = ProductLauncherCategory::create([
            'name' => 'Steam',
            'slug' => 'steam',
        ]);
        $instruction = ProductInstruction::create([
            'title' => 'Steam Setup',
            'content' => 'Install instructions',
        ]);

        $this->product = Product::create([
            'name' => 'Elden Ring',
            'slug' => 'elden-ring',
            'description' => 'Action RPG',
            'price' => 599000,
            'steam_url' => 'https://store.steampowered.com/app/1245620',
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'status' => 'published',
        ]);
    }

    public function test_concurrency_control_reserves_available_credential_on_order_creation(): void
    {
        $credential = GameCredential::create([
            'product_id' => $this->product->id,
            'username' => 'elden_shared_user',
            'password' => 'secret_pass_123',
            'access_token' => 'token_xyz_456',
            'status' => GameCredential::STATUS_AVAILABLE,
        ]);

        $tokenA = auth('api')->login($this->userA);

        // User A creates order
        $response = $this->withHeader('Authorization', "Bearer {$tokenA}")
            ->postJson('/api/v1/user/orders', [
                'item_type' => 'product',
                'product_id' => $this->product->id,
            ]);

        $response->assertStatus(201);

        // Verify credential has been reserved for User A
        $credential->refresh();
        $this->assertEquals(GameCredential::STATUS_RESERVED, $credential->status);
        $this->assertEquals($this->userA->id, $credential->assigned_to_user_id);
        $this->assertNotNull($credential->assigned_to_order_item_id);
        $this->assertNotNull($credential->reserved_until);

        // User B tries to reserve the same product; no stock left to reserve
        $secondReservation = $this->allocationService->reserveCredential($this->product, $this->userB);
        $this->assertNull($secondReservation);
    }

    public function test_automated_credential_allocation_on_payment_fulfillment(): void
    {
        $credential = GameCredential::create([
            'product_id' => $this->product->id,
            'username' => 'elden_shared_user',
            'password' => 'secret_pass_123',
            'access_token' => 'token_xyz_456',
            'status' => GameCredential::STATUS_AVAILABLE,
        ]);

        $order = Order::create([
            'user_id' => $this->userA->id,
            'order_code' => 'ORD-TEST-001',
            'subtotal_price' => 599000,
            'discount_amount' => 0,
            'total_price' => 599000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
        ]);

        $orderItem = $order->items()->create([
            'purchasable_type' => Product::class,
            'purchasable_id' => $this->product->id,
            'price' => 599000,
        ]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'qris',
            'gateway_reference' => 'MIDTRANS-001',
            'amount' => 599000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
        ]);

        // Fulfill order
        $paymentRepo = app(PaymentRepositoryInterface::class);
        $paymentRepo->fulfillOrder($payment);

        // Credential should be allocated as SOLD to User A
        $credential->refresh();
        $this->assertEquals(GameCredential::STATUS_SOLD, $credential->status);
        $this->assertEquals($this->userA->id, $credential->assigned_to_user_id);
        $this->assertEquals($orderItem->id, $credential->assigned_to_order_item_id);
        $this->assertNull($credential->reserved_until);

        // User A owned games relationship should be synced
        $this->assertTrue($this->userA->ownedGames()->where('products.id', $this->product->id)->exists());
    }

    public function test_data_isolation_shield_prevents_user_b_from_seeing_user_a_credentials(): void
    {
        // Credential allocated to User A
        GameCredential::create([
            'product_id' => $this->product->id,
            'username' => 'user_a_elden_login',
            'password' => 'user_a_secret_password',
            'access_token' => 'user_a_token',
            'status' => GameCredential::STATUS_SOLD,
            'assigned_to_user_id' => $this->userA->id,
        ]);

        $this->userA->ownedGames()->syncWithoutDetaching([$this->product->id]);

        $tokenA = auth('api')->tokenById($this->userA->id);
        $tokenB = auth('api')->tokenById($this->userB->id);

        // User A queries their library: receives decrypted credentials
        auth('api')->setUser($this->userA);
        $responseA = $this->withHeader('Authorization', "Bearer {$tokenA}")
            ->getJson('/api/v1/library');

        $responseA->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.game_title', 'Elden Ring')
            ->assertJsonPath('data.0.credentials.username', 'user_a_elden_login')
            ->assertJsonPath('data.0.credentials.password', 'user_a_secret_password')
            ->assertJsonPath('data.0.credentials.access_token', 'user_a_token');

        // User B queries their library: STRICT ISOLATION -> 0 items returned
        auth('api')->setUser($this->userB);
        $responseB = $this->withHeader('Authorization', "Bearer {$tokenB}")
            ->getJson('/api/v1/library');

        $responseB->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonCount(0, 'data');

        // User B attempts to access User A's game credentials directly via slug
        $responseDirectB = $this->withHeader('Authorization', "Bearer {$tokenB}")
            ->getJson("/api/v1/library/{$this->product->slug}");

        $responseDirectB->assertStatus(403);
    }

    public function test_credentials_stored_encrypted_in_database_and_decrypted_on_delivery(): void
    {
        $credential = GameCredential::create([
            'product_id' => $this->product->id,
            'username' => 'secure_vault_username',
            'password' => 'super_secret_cleartext_password',
            'access_token' => 'my_secret_token',
            'status' => GameCredential::STATUS_SOLD,
            'assigned_to_user_id' => $this->userA->id,
        ]);

        // Raw database query must NOT contain plaintext password
        $rawRow = DB::table('game_credentials')->where('id', $credential->id)->first();
        $this->assertNotEquals('super_secret_cleartext_password', $rawRow->password);

        // Delivery endpoint returns decrypted credentials
        $tokenA = auth('api')->login($this->userA);
        $response = $this->withHeader('Authorization', "Bearer {$tokenA}")
            ->getJson('/api/v1/library');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.credentials.password', 'super_secret_cleartext_password')
            ->assertJsonPath('data.0.credentials.username', 'secure_vault_username')
            ->assertJsonPath('data.0.credentials.access_token', 'my_secret_token');
    }

    public function test_payment_failure_or_expiration_releases_reserved_credentials(): void
    {
        $credential = GameCredential::create([
            'product_id' => $this->product->id,
            'username' => 'elden_shared_user',
            'password' => 'secret_pass_123',
            'status' => GameCredential::STATUS_RESERVED,
            'assigned_to_user_id' => $this->userA->id,
            'reserved_until' => now()->addMinutes(15),
        ]);

        $order = Order::create([
            'user_id' => $this->userA->id,
            'order_code' => 'ORD-EXPIRE-001',
            'subtotal_price' => 599000,
            'discount_amount' => 0,
            'total_price' => 599000,
            'status' => 'pending',
            'expired_at' => now()->addMinutes(15),
        ]);

        $orderItem = $order->items()->create([
            'purchasable_type' => Product::class,
            'purchasable_id' => $this->product->id,
            'price' => 599000,
        ]);

        $credential->update(['assigned_to_order_item_id' => $orderItem->id]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'qris',
            'gateway_reference' => 'MIDTRANS-EXPIRE-001',
            'amount' => 599000,
            'status' => 'pending',
            'expired_at' => now()->addMinutes(15),
        ]);

        $serverKey = (string) config('services.midtrans.server_key');
        $signatureKey = hash('sha512', 'MIDTRANS-EXPIRE-001'.'202'.'599000'.$serverKey);

        // Send expired webhook
        $response = $this->postJson('/api/v1/payments/webhook', [
            'order_id' => 'MIDTRANS-EXPIRE-001',
            'status_code' => '202',
            'gross_amount' => '599000',
            'transaction_status' => 'expire',
            'signature_key' => $signatureKey,
        ]);

        $response->assertStatus(200);

        // Reservation should be released back to AVAILABLE
        $credential->refresh();
        $this->assertEquals(GameCredential::STATUS_AVAILABLE, $credential->status);
        $this->assertNull($credential->assigned_to_user_id);
        $this->assertNull($credential->assigned_to_order_item_id);
        $this->assertNull($credential->reserved_until);
    }

    public function test_artisan_command_releases_expired_reservations(): void
    {
        $expiredCredential = GameCredential::create([
            'product_id' => $this->product->id,
            'username' => 'expired_user',
            'password' => 'expired_pass',
            'status' => GameCredential::STATUS_RESERVED,
            'assigned_to_user_id' => $this->userA->id,
            'reserved_until' => now()->subMinutes(5), // Already expired
        ]);

        $activeCredential = GameCredential::create([
            'product_id' => $this->product->id,
            'username' => 'active_user',
            'password' => 'active_pass',
            'status' => GameCredential::STATUS_RESERVED,
            'assigned_to_user_id' => $this->userB->id,
            'reserved_until' => now()->addMinutes(10), // Still valid
        ]);

        Artisan::call('gamezygo:release-expired-reservations');

        $expiredCredential->refresh();
        $activeCredential->refresh();

        $this->assertEquals(GameCredential::STATUS_AVAILABLE, $expiredCredential->status);
        $this->assertNull($expiredCredential->assigned_to_user_id);

        $this->assertEquals(GameCredential::STATUS_RESERVED, $activeCredential->status);
        $this->assertEquals($this->userB->id, $activeCredential->assigned_to_user_id);
    }

    public function test_user_can_access_library_through_user_prefix_route(): void
    {
        GameCredential::create([
            'product_id' => $this->product->id,
            'username' => 'user_a_prefix_login',
            'password' => 'user_a_prefix_pass',
            'status' => GameCredential::STATUS_SOLD,
            'assigned_to_user_id' => $this->userA->id,
        ]);

        $tokenA = auth('api')->tokenById($this->userA->id);
        auth('api')->setUser($this->userA);

        $response = $this->withHeader('Authorization', "Bearer {$tokenA}")
            ->getJson('/api/v1/user/library');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.0.credentials.username', 'user_a_prefix_login')
            ->assertJsonPath('data.0.credentials.password', 'user_a_prefix_pass');
    }

    public function test_user_can_retrieve_decrypted_credentials_via_product_credentials_route(): void
    {
        GameCredential::create([
            'product_id' => $this->product->id,
            'username' => 'allocated_elden_user',
            'password' => 'allocated_elden_pass',
            'access_token' => 'allocated_access_token',
            'status' => GameCredential::STATUS_SOLD,
            'assigned_to_user_id' => $this->userA->id,
        ]);

        $this->userA->ownedGames()->syncWithoutDetaching([$this->product->id]);

        $tokenA = auth('api')->tokenById($this->userA->id);
        auth('api')->setUser($this->userA);

        $response = $this->withHeader('Authorization', "Bearer {$tokenA}")
            ->getJson("/api/v1/user/products/{$this->product->slug}/credentials");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.username', 'allocated_elden_user')
            ->assertJsonPath('data.password', 'allocated_elden_pass')
            ->assertJsonPath('data.access_token', 'allocated_access_token');
    }

    public function test_user_cannot_access_credentials_for_unowned_product(): void
    {
        // Credential sold to User A
        GameCredential::create([
            'product_id' => $this->product->id,
            'username' => 'user_a_only',
            'password' => 'pass_a_only',
            'status' => GameCredential::STATUS_SOLD,
            'assigned_to_user_id' => $this->userA->id,
        ]);

        $tokenB = auth('api')->tokenById($this->userB->id);
        auth('api')->setUser($this->userB);

        $response = $this->withHeader('Authorization', "Bearer {$tokenB}")
            ->getJson("/api/v1/user/products/{$this->product->slug}/credentials");

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    public function test_unauthenticated_user_cannot_access_library(): void
    {
        $response = $this->getJson('/api/v1/library');
        $response->assertStatus(401);

        $responseUser = $this->getJson('/api/v1/user/library');
        $responseUser->assertStatus(401);
    }
}
