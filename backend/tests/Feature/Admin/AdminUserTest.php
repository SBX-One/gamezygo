<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\GenreCategory;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserDevice;
use App\Models\UserPointHistory;
use App\Models\UserSubscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminUserTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;

    protected string $adminToken;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = Admin::create([
            'name' => 'Gamezygo Admin',
            'email' => 'admin@gamezygo.com',
            'password' => Hash::make('secretadmin123'),
        ]);

        $this->adminToken = auth('admin')->tokenById($this->admin->id);

        $this->user = User::create([
            'name' => 'Cibuy67',
            'username' => 'Cibuy67',
            'email' => 'user123@test.com',
            'password' => Hash::make('secret123'),
            'status' => 'active',
            'points' => 100,
            'total_points' => 100,
            'google_id' => 'google_12345',
        ]);
    }

    public function test_unauthenticated_user_access_is_rejected(): void
    {
        $response = $this->getJson('/api/v1/admin/users');
        $response->assertStatus(401);
    }

    public function test_customer_cannot_access_admin_user_endpoints(): void
    {
        $userToken = auth('api')->tokenById($this->user->id);

        $response = $this->withHeader('Authorization', "Bearer {$userToken}")
            ->getJson('/api/v1/admin/users');

        $response->assertStatus(401);
    }

    public function test_admin_can_list_users_with_filters(): void
    {
        $plan = SubscriptionPlan::create([
            'name' => 'Paket 2',
            'price' => 100000,
            'duration_days' => 90,
            'duration_months' => 3,
            'is_active' => true,
        ]);

        UserSubscription::create([
            'user_id' => $this->user->id,
            'subscription_plan_id' => $plan->id,
            'started_at' => now()->subMonth(),
            'expired_at' => now()->addMonths(2),
            'status' => 'active',
        ]);

        $otherUser = User::create([
            'name' => 'OtherGamer',
            'username' => 'OtherGamer',
            'email' => 'other@test.com',
            'password' => Hash::make('secret123'),
            'status' => 'inactive',
            'points' => 10,
            'total_points' => 10,
            'google_id' => null,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/users?subscription_plan_id={$plan->id}&status=active&login_type=google&min_points=50&max_points=500&sort_by=latest&page=1&per_page=10");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Users retrieved successfully',
            ])
            ->assertJsonPath('data.total_users', 1)
            ->assertJsonPath('data.users.0.username', 'Cibuy67')
            ->assertJsonPath('data.users.0.login_type', 'google')
            ->assertJsonPath('data.users.0.subscription.name', 'Paket 2');
    }

    public function test_admin_can_get_user_details(): void
    {
        $plan = SubscriptionPlan::create([
            'name' => 'Paket 2',
            'price' => 100000,
            'duration_days' => 90,
            'duration_months' => 3,
            'is_active' => true,
        ]);

        UserSubscription::create([
            'user_id' => $this->user->id,
            'subscription_plan_id' => $plan->id,
            'started_at' => now()->subMonth(),
            'expired_at' => now()->addMonths(2),
            'status' => 'active',
        ]);

        $category = GenreCategory::create([
            'name' => 'Action',
            'slug' => 'action',
        ]);

        $launcher = ProductLauncherCategory::create([
            'name' => 'Steam',
            'slug' => 'steam',
        ]);

        $instruction = ProductInstruction::create([
            'title' => 'Steam Instruction',
            'content' => 'Install Steam and play',
        ]);

        $product = Product::create([
            'name' => 'GTA VI',
            'slug' => 'gta-vi',
            'description' => 'Action-adventure open world game',
            'price' => 650000,
            'steam_url' => 'https://store.steampowered.com/app/12345',
            'genre_category_id' => $category->id,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'is_active' => true,
        ]);

        $this->user->ownedGames()->attach($product->id);

        $order = Order::create([
            'user_id' => $this->user->id,
            'order_code' => 'GZO-ORD-001',
            'subtotal_price' => 650000,
            'discount_amount' => 0,
            'total_price' => 650000,
            'status' => 'settled',
            'expired_at' => now()->addHour(),
        ]);

        Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'BCA Virtual Account',
            'gateway_reference' => 'PAY-REF-001',
            'amount' => 650000,
            'status' => 'success',
        ]);

        UserDevice::create([
            'user_id' => $this->user->id,
            'ip_address' => '192.168.1.1',
            'device' => 'Windows 11 PC',
            'browser' => 'Chrome 128.0',
            'login_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/users/{$this->user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User details retrieved successfully',
            ])
            ->assertJsonPath('data.username', 'Cibuy67')
            ->assertJsonPath('data.statistics.lifetime_value', 650000)
            ->assertJsonPath('data.statistics.total_devices', 1)
            ->assertJsonPath('data.statistics.total_products', 1)
            ->assertJsonPath('data.statistics.total_transactions', 1)
            ->assertJsonPath('data.subscription.name', 'Paket 2');
    }

    public function test_admin_can_update_user_points_and_subscription(): void
    {
        $plan = SubscriptionPlan::create([
            'name' => 'Paket 2',
            'price' => 100000,
            'duration_days' => 90,
            'duration_months' => 3,
            'is_active' => true,
        ]);

        $sub = UserSubscription::create([
            'user_id' => $this->user->id,
            'subscription_plan_id' => $plan->id,
            'started_at' => now()->subMonth(),
            'expired_at' => now()->addMonths(2),
            'status' => 'active',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/v1/admin/users/{$this->user->id}", [
                'points' => 150,
                'subscription_duration_adjustment' => 1,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User updated successfully',
            ])
            ->assertJsonPath('data.points', 150)
            ->assertJsonPath('data.subscription.name', 'Paket 2');

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'points' => 150,
        ]);

        $this->assertDatabaseHas('user_point_histories', [
            'user_id' => $this->user->id,
            'type' => 'adjustment',
            'points' => 50,
            'balance_before' => 100,
            'balance_after' => 150,
        ]);
    }

    public function test_admin_can_update_user_status(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/v1/admin/users/{$this->user->id}/status", [
                'status' => 'inactive',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User status updated successfully',
                'data' => [
                    'id' => $this->user->id,
                    'status' => 'inactive',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'status' => 'inactive',
        ]);
    }

    public function test_admin_can_suspend_and_unsuspend_user(): void
    {
        // Suspend
        $suspendResponse = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson("/api/v1/admin/users/{$this->user->id}/suspend", [
                'reason' => 'Suspicious account activity',
                'suspended_until' => '2026-10-18T23:59:59+08:00',
            ]);

        $suspendResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User suspended successfully',
                'data' => [
                    'id' => $this->user->id,
                    'status' => 'suspended',
                    'suspend_reason' => 'Suspicious account activity',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'status' => 'suspended',
            'suspend_reason' => 'Suspicious account activity',
        ]);

        // Unsuspend
        $unsuspendResponse = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson("/api/v1/admin/users/{$this->user->id}/unsuspend");

        $unsuspendResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User unsuspended successfully',
                'data' => [
                    'id' => $this->user->id,
                    'status' => 'active',
                    'suspend_reason' => null,
                    'suspended_at' => null,
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'status' => 'active',
            'suspend_reason' => null,
        ]);
    }

    public function test_admin_can_get_user_devices(): void
    {
        UserDevice::create([
            'user_id' => $this->user->id,
            'ip_address' => '192.168.1.1',
            'device' => 'Windows 11 PC',
            'browser' => 'Chrome 128.0',
            'login_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/users/{$this->user->id}/devices");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User devices retrieved successfully',
            ])
            ->assertJsonPath('data.total_devices', 1)
            ->assertJsonPath('data.devices.0.device', 'Windows 11 PC');
    }

    public function test_admin_can_get_user_products(): void
    {
        $category = GenreCategory::create([
            'name' => 'Action',
            'slug' => 'action-prod',
        ]);

        $launcher = ProductLauncherCategory::create([
            'name' => 'Steam Prod',
            'slug' => 'steam-prod',
        ]);

        $instruction = ProductInstruction::create([
            'title' => 'Steam Instruction Prod',
            'content' => 'Install and run',
        ]);

        $product = Product::create([
            'name' => 'Grand Theft Auto VI',
            'slug' => 'grand-theft-auto-vi',
            'description' => 'Grand Theft Auto VI description',
            'price' => 650000,
            'steam_url' => 'https://store.steampowered.com/app/12345',
            'genre_category_id' => $category->id,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'is_active' => true,
        ]);

        $this->user->ownedGames()->attach($product->id);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/users/{$this->user->id}/products");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User products retrieved successfully',
            ])
            ->assertJsonPath('data.total_products', 1)
            ->assertJsonPath('data.products.0.name', 'Grand Theft Auto VI');
    }

    public function test_admin_can_get_user_transactions(): void
    {
        $order = Order::create([
            'user_id' => $this->user->id,
            'order_code' => 'H27T012603381U2',
            'subtotal_price' => 650000,
            'discount_amount' => 0,
            'total_price' => 650000,
            'status' => 'settled',
            'expired_at' => now()->addHour(),
        ]);

        Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'BCA Virtual Account',
            'gateway_reference' => 'PAY-REF-002',
            'amount' => 650000,
            'status' => 'success',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/users/{$this->user->id}/transactions");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User transactions retrieved successfully',
            ])
            ->assertJsonPath('data.total_transactions', 1)
            ->assertJsonPath('data.transactions.0.transaction_id', 'H27T012603381U2');
    }

    public function test_admin_can_get_user_points_history(): void
    {
        UserPointHistory::create([
            'user_id' => $this->user->id,
            'type' => 'adjustment',
            'points' => 50,
            'balance_before' => 100,
            'balance_after' => 150,
            'description' => 'Manual adjustment by admin',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/users/{$this->user->id}/points/history");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User points history retrieved successfully',
            ])
            ->assertJsonPath('data.total_records', 1)
            ->assertJsonPath('data.histories.0.type', 'adjustment')
            ->assertJsonPath('data.histories.0.points', 50);
    }

    public function test_admin_can_delete_user(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/v1/admin/users/{$this->user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User deleted successfully',
                'data' => [
                    'id' => $this->user->id,
                    'customer_id' => $this->user->customer_id,
                ],
            ]);

        $this->assertDatabaseMissing('users', [
            'id' => $this->user->id,
        ]);
    }

    public function test_direct_api_alias_route_works(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/users');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Users retrieved successfully',
            ]);
    }
}
