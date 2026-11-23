<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\GenreCategory;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminVoucherTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;

    protected string $adminToken;

    protected User $user1;

    protected User $user2;

    protected Product $product1;

    protected Product $product2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = Admin::create([
            'name' => 'Gamezygo Admin',
            'email' => 'admin@gamezygo.com',
            'password' => Hash::make('secretadmin123'),
        ]);

        $this->adminToken = auth('admin')->tokenById($this->admin->id);

        $this->user1 = User::create([
            'name' => 'User 12',
            'email' => 'user12@test.com',
            'password' => Hash::make('secret123'),
            'status' => 'active',
            'total_points' => 89,
        ]);

        $this->user2 = User::create([
            'name' => 'User 25',
            'email' => 'user25@test.com',
            'password' => Hash::make('secret123'),
            'status' => 'active',
            'total_points' => 120,
        ]);

        $launcher = ProductLauncherCategory::create([
            'name' => 'Steam',
            'slug' => 'steam',
        ]);

        $instruction = ProductInstruction::create([
            'title' => 'Steam Instruction',
            'content' => 'Step by step instructions',
        ]);

        $genre = GenreCategory::create([
            'name' => 'Action',
            'slug' => 'action',
        ]);

        $this->product1 = Product::create([
            'name' => 'Grand Theft Auto V',
            'slug' => 'grand-theft-auto-v',
            'description' => 'Action game',
            'price' => 480000,
            'discount_price' => 0,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'steam_url' => 'https://store.steampowered.com/app/271590/',
            'status' => 'published',
            'is_subscription_supported' => false,
        ]);
        $this->product1->genreCategories()->attach($genre->id);

        $this->product2 = Product::create([
            'name' => 'Red Dead Redemption 2',
            'slug' => 'red-dead-redemption-2',
            'description' => 'Western action game',
            'price' => 640000,
            'discount_price' => 0,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'steam_url' => 'https://store.steampowered.com/app/1174180/',
            'status' => 'published',
            'is_subscription_supported' => false,
        ]);
        $this->product2->genreCategories()->attach($genre->id);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->getJson('/api/v1/admin/vouchers');
        $response->assertStatus(401);
    }

    public function test_customer_user_is_forbidden_from_admin_vouchers(): void
    {
        $userToken = auth('api')->tokenById($this->user1->id);

        $response = $this->withHeader('Authorization', "Bearer {$userToken}")
            ->getJson('/api/v1/admin/vouchers');

        $response->assertStatus(401);
    }

    public function test_admin_can_retrieve_vouchers_index_with_filters(): void
    {
        // 1. Active percent voucher
        $v1 = Voucher::create([
            'name' => 'Summer Sale 2026',
            'code' => 'SUMMER26',
            'discount_type' => 'percentage',
            'discount_amount' => 30,
            'discount_value' => 30,
            'slot' => 200,
            'total_usage' => 92,
            'is_active' => true,
            'started_at' => now()->subDays(5),
            'expired_at' => now()->addDays(20),
        ]);

        // 2. Fixed voucher
        $v2 = Voucher::create([
            'name' => 'Welcome Discount',
            'code' => 'WELCOME50',
            'discount_type' => 'fixed',
            'discount_amount' => 50000,
            'discount_value' => 50000,
            'slot' => 100,
            'total_usage' => 56,
            'is_active' => true,
            'started_at' => now()->subDays(5),
            'expired_at' => now()->addDays(50),
        ]);

        // 3. Scheduled voucher
        $v3 = Voucher::create([
            'name' => 'Exclusive Member',
            'code' => 'MEMBER20',
            'discount_type' => 'percentage',
            'discount_amount' => 20,
            'discount_value' => 20,
            'slot' => 50,
            'total_usage' => 0,
            'is_active' => true,
            'started_at' => now()->addDays(10),
            'expired_at' => now()->addDays(40),
        ]);

        // Filter status=active & discount_type=percent
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/vouchers?status=active&discount_type=percent&sort_by=latest&page=1&per_page=10');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Vouchers retrieved successfully')
            ->assertJsonPath('data.total_vouchers', 1)
            ->assertJsonPath('data.vouchers.0.code', 'SUMMER26')
            ->assertJsonPath('data.vouchers.0.discount_type', 'percent')
            ->assertJsonPath('data.vouchers.0.discount_value', 30)
            ->assertJsonPath('data.vouchers.0.discount_label', '30%')
            ->assertJsonPath('data.vouchers.0.status', 'active')
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'total_vouchers',
                    'vouchers' => [
                        '*' => [
                            'id',
                            'name',
                            'code',
                            'discount_type',
                            'discount_value',
                            'discount_label',
                            'total_usage',
                            'slot',
                            'status',
                            'is_active',
                            'started_at',
                            'expired_at',
                        ],
                    ],
                    'meta' => [
                        'current_page',
                        'from',
                        'last_page',
                        'per_page',
                        'to',
                        'total',
                    ],
                ],
            ]);
    }

    public function test_admin_can_create_voucher_with_targets(): void
    {
        $payload = [
            'name' => 'Summer Sale 2026',
            'code' => 'SUMMER26',
            'discount_type' => 'percent',
            'discount_value' => 30,
            'max_discount' => 150000,
            'min_purchase' => 200000,
            'applies_to' => 'one_time',
            'target_type' => 'specific_users',
            'product_scope' => 'specific_products',
            'product_ids' => [$this->product1->id, $this->product2->id],
            'user_ids' => [$this->user1->id, $this->user2->id],
            'slot' => 200,
            'usage_limit_per_user' => 1,
            'started_at' => now()->addDays(5)->toIso8601String(),
            'expired_at' => now()->addDays(35)->toIso8601String(),
            'status' => 'published',
            'is_active' => true,
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/vouchers', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher created successfully')
            ->assertJsonPath('data.name', 'Summer Sale 2026')
            ->assertJsonPath('data.code', 'SUMMER26')
            ->assertJsonPath('data.discount_type', 'percent')
            ->assertJsonPath('data.discount_value', 30)
            ->assertJsonPath('data.total_target_products', 2)
            ->assertJsonPath('data.total_target_users', 2)
            ->assertJsonPath('data.total_usage', 0)
            ->assertJsonPath('data.status', 'scheduled')
            ->assertJsonPath('data.is_active', true);

        $this->assertDatabaseHas('vouchers', ['code' => 'SUMMER26']);
    }

    public function test_admin_can_show_voucher_details(): void
    {
        $voucher = Voucher::create([
            'name' => 'Summer Sale 2026',
            'code' => 'SUMMER26',
            'discount_type' => 'percentage',
            'discount_amount' => 30,
            'discount_value' => 30,
            'max_discount' => 150000,
            'min_purchase' => 200000,
            'applies_to' => 'one_time',
            'target_type' => 'specific_users',
            'product_scope' => 'specific_products',
            'slot' => 200,
            'usage_limit_per_user' => 1,
            'total_usage' => 92,
            'started_at' => now()->subDays(2),
            'expired_at' => now()->addDays(20),
            'is_active' => true,
        ]);

        $voucher->products()->attach([$this->product1->id, $this->product2->id]);
        $voucher->users()->attach([$this->user1->id, $this->user2->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/vouchers/{$voucher->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher retrieved successfully')
            ->assertJsonPath('data.id', $voucher->id)
            ->assertJsonPath('data.code', 'SUMMER26')
            ->assertJsonPath('data.discount_type', 'percent')
            ->assertJsonPath('data.products.0.name', 'Grand Theft Auto V')
            ->assertJsonPath('data.users.0.email', 'user12@test.com')
            ->assertJsonPath('data.users.0.total_points', 89)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'name',
                    'code',
                    'discount_type',
                    'discount_value',
                    'max_discount',
                    'min_purchase',
                    'applies_to',
                    'target_type',
                    'product_scope',
                    'products' => [
                        '*' => ['id', 'name', 'image_url', 'price'],
                    ],
                    'users' => [
                        '*' => ['id', 'email', 'total_points'],
                    ],
                    'slot',
                    'usage_limit_per_user',
                    'total_usage',
                    'started_at',
                    'expired_at',
                    'status',
                    'is_active',
                    'created_at',
                    'updated_at',
                ],
            ]);
    }

    public function test_admin_can_update_voucher(): void
    {
        $voucher = Voucher::create([
            'name' => 'Old Name',
            'code' => 'OLD10',
            'discount_type' => 'percentage',
            'discount_amount' => 10,
            'discount_value' => 10,
            'slot' => 100,
            'is_active' => true,
        ]);

        $payload = [
            'name' => 'Summer Sale Special',
            'discount_value' => 35,
            'max_discount' => 175000,
            'min_purchase' => 250000,
            'slot' => 300,
            'expired_at' => now()->addDays(30)->toIso8601String(),
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/v1/admin/vouchers/{$voucher->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher updated successfully')
            ->assertJsonPath('data.name', 'Summer Sale Special')
            ->assertJsonPath('data.discount_value', 35)
            ->assertJsonPath('data.slot', 300);

        $this->assertEquals(35, $voucher->fresh()->discount_value);
    }

    public function test_admin_can_toggle_voucher_status(): void
    {
        $voucher = Voucher::create([
            'name' => 'Test Toggle',
            'code' => 'TOGGLE1',
            'discount_type' => 'percentage',
            'discount_amount' => 10,
            'discount_value' => 10,
            'is_active' => true,
        ]);

        // Deactivate
        $responseDeact = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/v1/admin/vouchers/{$voucher->id}/status", ['is_active' => false]);

        $responseDeact->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher deactivated successfully')
            ->assertJsonPath('data.is_active', false)
            ->assertJsonPath('data.status', 'inactive');

        // Activate
        $responseAct = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/v1/admin/vouchers/{$voucher->id}/status", ['is_active' => true]);

        $responseAct->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher activated successfully')
            ->assertJsonPath('data.is_active', true)
            ->assertJsonPath('data.status', 'active');
    }

    public function test_admin_can_bulk_delete_vouchers(): void
    {
        $v1 = Voucher::create(['name' => 'V1', 'code' => 'CODE1', 'discount_type' => 'percentage', 'discount_amount' => 10]);
        $v2 = Voucher::create(['name' => 'V2', 'code' => 'CODE2', 'discount_type' => 'percentage', 'discount_amount' => 10]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson('/api/v1/admin/vouchers', ['ids' => [$v1->id, $v2->id]]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher deleted successfully.')
            ->assertJsonPath('data.deleted_count', 2)
            ->assertJsonPath('data.deleted_ids', [$v1->id, $v2->id]);

        $this->assertSoftDeleted('vouchers', ['id' => $v1->id]);
        $this->assertSoftDeleted('vouchers', ['id' => $v2->id]);
    }

    public function test_admin_can_view_voucher_analytics(): void
    {
        $voucher = Voucher::create([
            'name' => 'Summer Sale 2026',
            'code' => 'SUMMER26',
            'discount_type' => 'percentage',
            'discount_amount' => 30,
            'discount_value' => 30,
            'slot' => 200,
            'total_usage' => 1,
            'is_active' => true,
        ]);
        $voucher->products()->attach($this->product1->id);
        $voucher->users()->attach($this->user1->id);

        Order::create([
            'user_id' => $this->user1->id,
            'voucher_id' => $voucher->id,
            'order_code' => 'ORD-20261011-001',
            'subtotal_price' => 480000,
            'discount_amount' => 144000,
            'total_price' => 336000,
            'status' => 'paid',
            'expired_at' => now()->addHour(),
            'paid_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/vouchers/{$voucher->id}/analytics?period=daily");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher analytics retrieved successfully')
            ->assertJsonPath('data.statistics.total_usage', 1)
            ->assertJsonPath('data.statistics.total_burn', 144000)
            ->assertJsonPath('data.target_games.0.name', 'Grand Theft Auto V')
            ->assertJsonPath('data.target_games.0.discount_percentage', 30)
            ->assertJsonPath('data.target_users.0.email', 'user12@test.com')
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'voucher' => ['id', 'name', 'code', 'discount_type', 'discount_value', 'status'],
                    'statistics' => ['total_usage', 'total_burn'],
                    'target_games' => [
                        '*' => ['id', 'name', 'image_url', 'original_price', 'discounted_price', 'discount_percentage'],
                    ],
                    'target_users' => [
                        '*' => ['id', 'email'],
                    ],
                    'revenue_chart' => [
                        'period',
                        'data' => [
                            '*' => ['date', 'revenue'],
                        ],
                    ],
                ],
            ]);
    }

    public function test_admin_can_retrieve_voucher_usages_history(): void
    {
        $voucher = Voucher::create([
            'name' => 'Summer Sale 2026',
            'code' => 'SUMMER26',
            'discount_type' => 'percentage',
            'discount_amount' => 30,
            'discount_value' => 30,
            'is_active' => true,
        ]);

        Order::create([
            'user_id' => $this->user1->id,
            'voucher_id' => $voucher->id,
            'order_code' => 'ORD-20261011-001',
            'subtotal_price' => 480000,
            'discount_amount' => 144000,
            'total_price' => 336000,
            'status' => 'paid',
            'expired_at' => now()->addHour(),
            'paid_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/vouchers/{$voucher->id}/usages?status=paid&page=1&per_page=10");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher usage history retrieved successfully')
            ->assertJsonPath('data.usages.0.order_code', 'ORD-20261011-001')
            ->assertJsonPath('data.usages.0.customer_email', 'user12@test.com')
            ->assertJsonPath('data.usages.0.subtotal', 480000)
            ->assertJsonPath('data.usages.0.discount_amount', 144000)
            ->assertJsonPath('data.usages.0.total', 336000)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'usages' => [
                        '*' => ['id', 'order_code', 'customer_email', 'status', 'subtotal', 'discount_amount', 'total', 'used_at'],
                    ],
                    'meta' => [
                        'current_page',
                        'from',
                        'last_page',
                        'per_page',
                        'to',
                        'total',
                    ],
                ],
            ]);
    }

    public function test_admin_can_search_eligible_products_and_users(): void
    {
        // Eligible Products
        $prodResponse = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/vouchers/eligible-products?search=grand&page=1&per_page=10');

        $prodResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Eligible products retrieved successfully')
            ->assertJsonPath('data.products.0.name', 'Grand Theft Auto V')
            ->assertJsonPath('data.products.0.categories.0', 'Action');

        // Eligible Users
        $userResponse = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/vouchers/eligible-users?search=user12&page=1&per_page=10');

        $userResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Eligible users retrieved successfully')
            ->assertJsonPath('data.users.0.email', 'user12@test.com')
            ->assertJsonPath('data.users.0.total_points', 89);
    }

    public function test_admin_can_export_vouchers_csv_and_usages_csv(): void
    {
        $voucher = Voucher::create([
            'name' => 'Export Voucher',
            'code' => 'EXPORT100',
            'discount_type' => 'fixed',
            'discount_amount' => 100000,
            'discount_value' => 100000,
            'is_active' => true,
        ]);

        Order::create([
            'user_id' => $this->user1->id,
            'voucher_id' => $voucher->id,
            'order_code' => 'ORD-EXP-001',
            'subtotal_price' => 300000,
            'discount_amount' => 100000,
            'total_price' => 200000,
            'status' => 'paid',
            'expired_at' => now()->addHour(),
        ]);

        // Export vouchers CSV
        $vouchersCsvResponse = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->get('/api/v1/admin/vouchers/export');

        $vouchersCsvResponse->assertStatus(200);
        $this->assertStringContainsString('text/csv', $vouchersCsvResponse->headers->get('Content-Type'));
        $this->assertStringContainsString('EXPORT100', $vouchersCsvResponse->getContent());

        // Export usages CSV
        $usagesCsvResponse = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->get("/api/v1/admin/vouchers/{$voucher->id}/usages/export");

        $usagesCsvResponse->assertStatus(200);
        $this->assertStringContainsString('text/csv', $usagesCsvResponse->headers->get('Content-Type'));
        $this->assertStringContainsString('ORD-EXP-001', $usagesCsvResponse->getContent());
    }

    public function test_admin_can_access_legacy_route_without_v1(): void
    {
        $voucher = Voucher::create([
            'name' => 'Legacy Test',
            'code' => 'LEGACY2026',
            'discount_type' => 'percentage',
            'discount_amount' => 20,
            'discount_value' => 20,
            'is_active' => true,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/vouchers?status=active');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Vouchers retrieved successfully');
    }

    public function test_admin_can_add_products_to_voucher(): void
    {
        $voucher = Voucher::create([
            'name' => 'Voucher Products Add',
            'code' => 'VPADD1',
            'discount_type' => 'percentage',
            'discount_amount' => 10,
            'discount_value' => 10,
            'is_active' => true,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson("/api/v1/admin/vouchers/{$voucher->id}/products", [
                'product_ids' => [$this->product1->id, $this->product2->id],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher target products added successfully')
            ->assertJsonPath('data.voucher_id', $voucher->id)
            ->assertJsonPath('data.product_scope', 'specific_products')
            ->assertJsonPath('data.total_products', 2)
            ->assertJsonPath('data.added_products.0.id', $this->product1->id);

        $this->assertEquals(2, $voucher->fresh()->products()->count());
    }

    public function test_admin_can_remove_products_from_voucher(): void
    {
        $voucher = Voucher::create([
            'name' => 'Voucher Products Del',
            'code' => 'VPDEL1',
            'discount_type' => 'percentage',
            'discount_amount' => 10,
            'discount_value' => 10,
            'is_active' => true,
        ]);
        $voucher->products()->attach([$this->product1->id, $this->product2->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/v1/admin/vouchers/{$voucher->id}/products", [
                'product_ids' => [$this->product1->id],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher target products removed successfully')
            ->assertJsonPath('data.voucher_id', $voucher->id)
            ->assertJsonPath('data.removed_count', 1)
            ->assertJsonPath('data.total_products', 1);

        $this->assertEquals(1, $voucher->fresh()->products()->count());
    }

    public function test_admin_can_add_users_to_voucher(): void
    {
        $voucher = Voucher::create([
            'name' => 'Voucher Users Add',
            'code' => 'VUADD1',
            'discount_type' => 'percentage',
            'discount_amount' => 10,
            'discount_value' => 10,
            'is_active' => true,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson("/api/v1/admin/vouchers/{$voucher->id}/users", [
                'user_ids' => [$this->user1->id, $this->user2->id],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher target users added successfully')
            ->assertJsonPath('data.voucher_id', $voucher->id)
            ->assertJsonPath('data.target_type', 'specific_users')
            ->assertJsonPath('data.total_users', 2)
            ->assertJsonPath('data.added_users.0.email', 'user12@test.com');

        $this->assertEquals(2, $voucher->fresh()->users()->count());
    }

    public function test_admin_can_remove_users_from_voucher(): void
    {
        $voucher = Voucher::create([
            'name' => 'Voucher Users Del',
            'code' => 'VUDEL1',
            'discount_type' => 'percentage',
            'discount_amount' => 10,
            'discount_value' => 10,
            'is_active' => true,
        ]);
        $voucher->users()->attach([$this->user1->id, $this->user2->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/v1/admin/vouchers/{$voucher->id}/users", [
                'user_ids' => [$this->user1->id],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voucher target users removed successfully')
            ->assertJsonPath('data.voucher_id', $voucher->id)
            ->assertJsonPath('data.removed_count', 1)
            ->assertJsonPath('data.total_users', 1);

        $this->assertEquals(1, $voucher->fresh()->users()->count());
    }
}
