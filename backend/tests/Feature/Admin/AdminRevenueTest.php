<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\GenreCategory;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscription;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminRevenueTest extends TestCase
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
            'name' => 'Main Admin',
            'email' => 'admin@gamezygo.com',
            'password' => Hash::make('secretadmin123'),
        ]);

        $this->adminToken = auth('admin')->tokenById($this->admin->id);

        $this->defaultLauncher = ProductLauncherCategory::create([
            'name' => 'Steam',
            'slug' => 'steam',
        ]);

        $this->defaultInstruction = ProductInstruction::create([
            'title' => 'Default Guide',
            'content' => 'Guide content',
        ]);
    }

    public function test_unauthenticated_request_to_revenue_returns_401(): void
    {
        $response = $this->getJson('/api/v1/admin/revenue');

        $response->assertStatus(401);
    }

    public function test_regular_user_token_is_rejected_from_revenue_endpoints(): void
    {
        $user = User::create([
            'name' => 'Regular Customer',
            'email' => 'customer@example.com',
            'password' => Hash::make('secret123'),
            'status' => 'active',
        ]);

        $userToken = auth('api')->tokenById($user->id);

        $response = $this->withHeader('Authorization', "Bearer {$userToken}")
            ->getJson('/api/v1/admin/revenue');

        $this->assertTrue(in_array($response->status(), [401, 403]));
    }

    public function test_revenue_index_validates_period_and_date_parameters(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/revenue?period=invalid_period');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['period']);

        $responseDate = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/revenue?start_date=2026-10-10&end_date=2026-10-01');

        $responseDate->assertStatus(422)
            ->assertJsonValidationErrors(['end_date']);
    }

    public function test_revenue_index_returns_default_structure_when_database_is_empty(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/revenue?period=weekly');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'total_revenue' => [
                        'total',
                        'percentage',
                        'description',
                        'period',
                    ],
                    'average_order_value' => [
                        'total',
                        'percentage',
                        'description',
                    ],
                    'total_orders' => [
                        'total',
                        'description',
                        'period',
                    ],
                    'voucher_burn' => [
                        'total',
                        'percentage',
                        'description',
                    ],
                    'revenue_chart' => [
                        'period',
                        'data' => [
                            '*' => [
                                'day',
                                'revenue',
                            ],
                        ],
                    ],
                    'income_spread' => [
                        'period',
                        'total',
                        'product_types' => [
                            '*' => [
                                'name',
                                'total',
                                'percentage',
                            ],
                        ],
                        'products',
                    ],
                    'products' => [
                        'total',
                        'description',
                        'items',
                    ],
                    'bundle_statistics' => [
                        'growth_percentage',
                        'description',
                        'last_month' => [
                            'total',
                        ],
                        'this_month' => [
                            'total',
                        ],
                        'total_active_subscribers',
                        'total_subscribers_last_month',
                    ],
                    'vouchers' => [
                        'total_active',
                        'total_burn',
                        'items',
                    ],
                ],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Revenue dashboard data retrieved successfully')
            ->assertJsonPath('data.total_revenue.total', 0)
            ->assertJsonPath('data.average_order_value.total', 0)
            ->assertJsonPath('data.total_orders.total', 0)
            ->assertJsonPath('data.revenue_chart.period', 'weekly')
            ->assertJsonCount(7, 'data.revenue_chart.data');
    }

    public function test_revenue_index_returns_accurate_financial_metrics_with_orders_and_vouchers(): void
    {
        $user = User::create([
            'name' => 'Buyer User',
            'email' => 'buyer@example.com',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);

        $gta = Product::create([
            'name' => 'Grand Theft Auto V',
            'slug' => 'grand-theft-auto-v',
            'description' => 'Action open world game',
            'price' => 480000,
            'discount_price' => 0,
            'product_launcher_category_id' => $this->defaultLauncher->id,
            'product_instruction_id' => $this->defaultInstruction->id,
            'steam_url' => 'https://store.steampowered.com/app/271590/',
            'status' => 'listing',
        ]);

        $plan = SubscriptionPlan::create([
            'name' => 'Gold Monthly Pass',
            'price' => 120000,
            'duration_days' => 30,
            'is_active' => true,
        ]);

        $voucher = Voucher::create([
            'name' => 'SUMMER26',
            'code' => 'SUMMER26',
            'discount_type' => 'fixed',
            'discount_amount' => 50000,
            'min_purchase' => 100000,
            'is_active' => true,
        ]);

        // Order 1: Game purchase with voucher
        $order1 = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-REV-001',
            'voucher_id' => $voucher->id,
            'subtotal_price' => 480000,
            'discount_amount' => 50000,
            'total_price' => 430000,
            'status' => 'paid',
            'expired_at' => now()->addHour(),
            'paid_at' => now(),
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'purchasable_type' => Product::class,
            'purchasable_id' => $gta->id,
            'price' => 480000,
        ]);

        // Order 2: Subscription plan purchase
        $order2 = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-REV-002',
            'subtotal_price' => 120000,
            'discount_amount' => 0,
            'total_price' => 120000,
            'status' => 'paid',
            'expired_at' => now()->addHour(),
            'paid_at' => now(),
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'purchasable_type' => SubscriptionPlan::class,
            'purchasable_id' => $plan->id,
            'price' => 120000,
        ]);

        // Active subscription
        UserSubscription::create([
            'user_id' => $user->id,
            'subscription_plan_id' => $plan->id,
            'order_item_id' => null,
            'started_at' => now(),
            'expired_at' => now()->addDays(30),
            'status' => 'active',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/revenue?period=weekly');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_revenue.total', 550000)
            ->assertJsonPath('data.total_orders.total', 2)
            ->assertJsonPath('data.voucher_burn.total', 50000)
            ->assertJsonPath('data.average_order_value.total', 275000)
            ->assertJsonPath('data.bundle_statistics.total_active_subscribers', 1)
            ->assertJsonPath('data.bundle_statistics.this_month.total', 120000)
            ->assertJsonPath('data.vouchers.total_active', 1)
            ->assertJsonPath('data.vouchers.total_burn', 50000)
            ->assertJsonPath('data.vouchers.items.0.name', 'SUMMER26')
            ->assertJsonPath('data.income_spread.product_types.0.name', 'Paket')
            ->assertJsonPath('data.income_spread.product_types.0.total', 120000)
            ->assertJsonPath('data.income_spread.product_types.1.name', 'Game Satuan')
            ->assertJsonPath('data.income_spread.product_types.1.total', 480000)
            ->assertJsonPath('data.products.items.0.name', 'Grand Theft Auto V')
            ->assertJsonPath('data.products.items.0.total_sold', 1);
    }

    public function test_revenue_index_supports_custom_date_range_filters(): void
    {
        $user = User::create([
            'name' => 'Buyer User 2',
            'email' => 'buyer2@example.com',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);

        // Order inside range (2026-10-05)
        $orderIn = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-DATE-IN',
            'subtotal_price' => 350000,
            'discount_amount' => 0,
            'total_price' => 350000,
            'status' => 'paid',
            'expired_at' => '2026-10-05 12:00:00',
        ]);
        $orderIn->created_at = '2026-10-05 10:00:00';
        $orderIn->saveQuietly();

        // Order outside range (2026-09-15)
        $orderOut = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-DATE-OUT',
            'subtotal_price' => 800000,
            'discount_amount' => 0,
            'total_price' => 800000,
            'status' => 'paid',
            'expired_at' => '2026-09-15 12:00:00',
        ]);
        $orderOut->created_at = '2026-09-15 10:00:00';
        $orderOut->saveQuietly();

        $url = '/api/v1/admin/revenue?period=weekly&start_date=2026-10-01&end_date=2026-10-10';
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson($url);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_revenue.total', 350000)
            ->assertJsonPath('data.total_orders.total', 1);
    }

    public function test_product_revenue_returns_404_if_product_not_found(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/revenue/product/999999');

        $response->assertStatus(404);
    }

    public function test_product_revenue_returns_accurate_metrics_for_existing_product(): void
    {
        $cat1 = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
        $cat2 = GenreCategory::create(['name' => 'Adventure', 'slug' => 'adventure']);

        $product = Product::create([
            'name' => "Assassin's Creed Black Flag Resynced",
            'slug' => 'assassins-creed-black-flag-resynced',
            'description' => 'Pirate assassin adventure',
            'price' => 350000,
            'discount_price' => 0,
            'product_launcher_category_id' => $this->defaultLauncher->id,
            'product_instruction_id' => $this->defaultInstruction->id,
            'steam_url' => 'https://store.steampowered.com/app/242050/',
            'status' => 'listing',
        ]);
        $product->genreCategories()->attach([$cat1->id, $cat2->id]);

        $user = User::create([
            'name' => 'Game Fan',
            'email' => 'fan@example.com',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => 'ORD-AC-001',
            'subtotal_price' => 350000,
            'discount_amount' => 0,
            'total_price' => 350000,
            'status' => 'paid',
            'expired_at' => now()->addHour(),
            'paid_at' => now(),
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'purchasable_type' => Product::class,
            'purchasable_id' => $product->id,
            'price' => 350000,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/revenue/product/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'product' => [
                        'id',
                        'name',
                        'thumbnail',
                        'categories' => [
                            '*' => [
                                'id',
                                'name',
                                'slug',
                            ],
                        ],
                    ],
                    'total_sold',
                    'revenue' => [
                        'total',
                        'percentage',
                        'description',
                    ],
                    'rank' => [
                        'total',
                        'description',
                    ],
                    'last_sold' => [
                        'total',
                        'percentage',
                        'description',
                    ],
                ],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.product.id', $product->id)
            ->assertJsonPath('data.product.name', "Assassin's Creed Black Flag Resynced")
            ->assertJsonPath('data.total_sold', 1)
            ->assertJsonPath('data.revenue.total', 350000)
            ->assertJsonPath('data.rank.total', 1)
            ->assertJsonCount(2, 'data.product.categories');
    }
}
