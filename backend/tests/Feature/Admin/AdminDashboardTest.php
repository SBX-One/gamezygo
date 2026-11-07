<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\GameRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
  use RefreshDatabase;

  protected Admin $admin;
  protected string $adminToken;

  protected function setUp(): void
  {
    parent::setUp();

    $this->admin = Admin::create([
      'name'     => 'Main Admin',
      'email'    => 'admin@gamezygo.com',
      'password' => Hash::make('secretadmin123'),
    ]);

    $this->adminToken = auth('admin')->tokenById($this->admin->id);
  }

  public function test_unauthenticated_request_to_dashboard_returns_401(): void
  {
    $response = $this->getJson('/api/v1/admin/dashboard');

    $response->assertStatus(401);
  }

  public function test_regular_user_token_is_rejected_from_admin_dashboard(): void
  {
    $user = User::create([
      'name'     => 'Regular User',
      'email'    => 'user@example.com',
      'password' => Hash::make('password123'),
      'status'   => 'active',
    ]);

    $userToken = auth('api')->tokenById($user->id);

    $response = $this->withHeader('Authorization', "Bearer {$userToken}")
      ->getJson('/api/v1/admin/dashboard');

    $this->assertTrue(in_array($response->status(), [401, 403]));
  }

  public function test_invalid_period_param_returns_validation_error(): void
  {
    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/dashboard?period=invalid_period');

    $response->assertStatus(422)
      ->assertJsonValidationErrors(['period']);
  }

  public function test_admin_dashboard_returns_correct_structure_with_empty_database(): void
  {
    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/dashboard?period=today');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'income' => [
            'total',
            'percentage',
            'description',
          ],
          'orders' => [
            'total',
            'description',
          ],
          'user_active' => [
            'total',
            'description',
          ],
          'active_subs' => [
            'total',
            'description',
          ],
          'product_performance',
          'recent_transactions',
          'game_requests',
        ],
      ])
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Dashboard data retrieved successfully')
      ->assertJsonPath('data.income.total', 0)
      ->assertJsonPath('data.orders.total', 0)
      ->assertJsonPath('data.user_active.total', 0)
      ->assertJsonPath('data.active_subs.total', 0);
  }

  public function test_admin_dashboard_calculates_metrics_correctly_with_populated_data(): void
  {
    // 1. Create active and inactive users
    $user1 = User::create([
      'name'     => 'Aditya Pratama',
      'email'    => 'aditya.pratama@gmail.com',
      'password' => Hash::make('secret123'),
      'status'   => 'active',
    ]);

    $user2 = User::create([
      'name'     => 'Rizky Maulana',
      'email'    => 'rizky.maulana@gmail.com',
      'password' => Hash::make('secret123'),
      'status'   => 'active',
    ]);

    User::create([
      'name'     => 'Banned User',
      'email'    => 'banned@example.com',
      'password' => Hash::make('secret123'),
      'status'   => 'banned',
    ]);

    // 2. Create products
    $product1 = Product::factory()->create([
      'name'           => "Assassin's Creed IV: Black Flag",
      'price'          => 175000,
      'discount_price' => 150000,
      'status'         => 'listing',
      'steam_url'      => 'https://store.steampowered.com/app/242050/',
    ]);

    $product2 = Product::factory()->create([
      'name'           => 'Grand Theft Auto V',
      'price'          => 350000,
      'discount_price' => 300000,
      'status'         => 'listing',
      'steam_url'      => 'https://store.steampowered.com/app/271590/',
    ]);

    // 3. Create active subscription
    UserSubscription::factory()->create([
      'user_id'    => $user1->id,
      'status'     => 'active',
      'started_at' => now()->subDays(5),
      'expired_at' => now()->addDays(25),
    ]);

    // 4. Create an order yesterday (for income comparison)
    $yesterdayOrder = Order::create([
      'user_id'        => $user1->id,
      'order_code'     => 'ORD-YESTERDAY-01',
      'subtotal_price' => 100000,
      'total_price'    => 100000,
      'status'         => 'paid',
      'expired_at'     => now()->subDay()->addHours(2),
      'paid_at'        => now()->subDay(),
    ]);
    $yesterdayOrder->created_at = now()->subDay();
    $yesterdayOrder->save();

    // 5. Create orders today
    $todayOrder1 = Order::create([
      'user_id'        => $user1->id,
      'order_code'     => 'ORD-TODAY-01',
      'subtotal_price' => 350000,
      'total_price'    => 350000,
      'status'         => 'paid',
      'expired_at'     => now()->addHours(2),
      'paid_at'        => now(),
    ]);
    OrderItem::create([
      'order_id'         => $todayOrder1->id,
      'purchasable_type' => Product::class,
      'purchasable_id'   => $product2->id,
      'price'            => 350000,
    ]);

    $todayOrder2 = Order::create([
      'user_id'        => $user2->id,
      'order_code'     => 'ORD-TODAY-02',
      'subtotal_price' => 150000,
      'total_price'    => 150000,
      'status'         => 'paid',
      'expired_at'     => now()->addHours(2),
      'paid_at'        => now(),
    ]);
    OrderItem::create([
      'order_id'         => $todayOrder2->id,
      'purchasable_type' => Product::class,
      'purchasable_id'   => $product1->id,
      'price'            => 150000,
    ]);

    // 6. Create game requests
    GameRequest::create([
      'user_id'       => $user1->id,
      'name'          => 'Black Myth: Wukong',
      'steam_url'     => 'https://store.steampowered.com/app/2358720/',
      'request_count' => 128,
      'status'        => 'pending',
    ]);

    GameRequest::create([
      'user_id'       => $user2->id,
      'name'          => 'Ghost of Tsushima',
      'steam_url'     => 'https://store.steampowered.com/app/2215430/',
      'request_count' => 96,
      'status'        => 'pending',
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/dashboard?period=today');

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('data.income.total', 500000)
      ->assertJsonPath('data.income.percentage', 400) // ((500000 - 100000) / 100000) * 100 = 400%
      ->assertJsonPath('data.income.description', 'PENDAPATAN DARI 2 TRANSAKSI')
      ->assertJsonPath('data.orders.total', 2)
      ->assertJsonPath('data.orders.description', '2 ORDER BARU HARI INI')
      ->assertJsonPath('data.user_active.total', 2)
      ->assertJsonPath('data.user_active.description', 'DARI TOTAL 3 USERS')
      ->assertJsonPath('data.active_subs.total', 1)
      ->assertJsonPath('data.active_subs.description', 'SUBSCRIPTION AKTIF');

    // Assert product_performance contains expected products
    $performanceNames = collect($response->json('data.product_performance'))->pluck('name')->toArray();
    $this->assertContains("Assassin's Creed IV: Black Flag", $performanceNames);
    $this->assertContains('Grand Theft Auto V', $performanceNames);

    // Assert recent_transactions contains formatted revenue and emails
    $response->assertJsonPath('data.recent_transactions.0.customer_email', 'rizky.maulana@gmail.com')
      ->assertJsonPath('data.recent_transactions.0.status', 'Paid')
      ->assertJsonPath('data.recent_transactions.0.revenue', 'Rp 150.000');

    // Assert game_requests list
    $response->assertJsonPath('data.game_requests.0.product_name', 'Black Myth: Wukong')
      ->assertJsonPath('data.game_requests.0.total_request', 128)
      ->assertJsonPath('data.game_requests.1.product_name', 'Ghost of Tsushima')
      ->assertJsonPath('data.game_requests.1.total_request', 96);
  }

  public function test_admin_dashboard_supports_different_periods(): void
  {
    $periods = ['today', 'yesterday', 'this_week', 'this_month', 'this_year', 'all_time'];

    foreach ($periods as $period) {
      $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
        ->getJson("/api/v1/admin/dashboard?period={$period}");

      $response->assertStatus(200)
        ->assertJsonPath('success', true);
    }
  }

  public function test_unauthenticated_request_to_recent_transactions_returns_401(): void
  {
    $response = $this->getJson('/api/v1/admin/dashboard/recent-transactions');

    $response->assertStatus(401);
  }

  public function test_regular_user_token_is_rejected_from_recent_transactions(): void
  {
    $user = User::create([
      'name'     => 'Customer Test',
      'email'    => 'customer@example.com',
      'password' => Hash::make('password123'),
      'status'   => 'active',
    ]);

    $userToken = auth('api')->tokenById($user->id);

    $response = $this->withHeader('Authorization', "Bearer {$userToken}")
      ->getJson('/api/v1/admin/dashboard/recent-transactions');

    $this->assertTrue(in_array($response->status(), [401, 403]));
  }

  public function test_recent_transactions_returns_correct_structure_with_empty_database(): void
  {
    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/dashboard/recent-transactions');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'today_transactions' => [
            'total',
            'percentage',
            'description',
          ],
          'week_transactions' => [
            'total',
            'percentage',
            'description',
          ],
          'month_transactions' => [
            'total',
            'percentage',
            'description',
          ],
          'transactins',
        ],
      ])
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Revenue dashboard data retrieved successfully')
      ->assertJsonPath('data.today_transactions.total', 0)
      ->assertJsonPath('data.today_transactions.description', 'KEUNTUNGAN IDR 0')
      ->assertJsonPath('data.transactins', []);
  }

  public function test_recent_transactions_returns_populated_metrics_and_transactions(): void
  {
    $user = User::create([
      'name'     => 'Gamer User',
      'email'    => 'user123@test.com',
      'password' => Hash::make('password123'),
      'status'   => 'active',
    ]);

    $product = Product::factory()->create([
      'name'           => 'Beholder : Conductor',
      'price'          => 480000,
      'discount_price' => 450000,
      'status'         => 'listing',
    ]);

    // Order today (pending)
    $order = Order::create([
      'user_id'        => $user->id,
      'order_code'     => 'H27TG1G26G3N18U2-67',
      'subtotal_price' => 480000,
      'total_price'    => 480000,
      'status'         => 'pending',
      'expired_at'     => now()->addHours(2),
    ]);

    OrderItem::create([
      'order_id'         => $order->id,
      'purchasable_type' => Product::class,
      'purchasable_id'   => $product->id,
      'price'            => 480000,
    ]);

    // Paid order today for profit calculation
    $paidOrder = Order::create([
      'user_id'        => $user->id,
      'order_code'     => 'ORD-PAID-01',
      'subtotal_price' => 350000,
      'total_price'    => 350000,
      'status'         => 'paid',
      'expired_at'     => now()->addHours(2),
      'paid_at'        => now(),
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/dashboard/recent-transactions');

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Revenue dashboard data retrieved successfully')
      ->assertJsonPath('data.today_transactions.total', 2)
      ->assertJsonPath('data.today_transactions.description', 'KEUNTUNGAN IDR 350,000')
      ->assertJsonPath('data.week_transactions.total', 2)
      ->assertJsonPath('data.week_transactions.description', 'KEUNTUNGAN IDR 350,000')
      ->assertJsonPath('data.month_transactions.total', 2)
      ->assertJsonPath('data.month_transactions.description', 'KEUNTUNGAN IDR 350,000');

    $transactions = $response->json('data.transactins');
    $this->assertCount(2, $transactions);

    // Verify first transaction is latest (ORD-PAID-01) and second is H27TG1G26G3N18U2-67
    $targetTransaction = collect($transactions)->firstWhere('id', 'H27TG1G26G3N18U2-67');
    $this->assertNotNull($targetTransaction);
    $this->assertEquals('user123@test.com', $targetTransaction['customer_email']);
    $this->assertEquals((string) $product->id, $targetTransaction['product_id']);
    $this->assertEquals('Beholder : Conductor', $targetTransaction['product_name']);
    $this->assertEquals(480000, $targetTransaction['total']);
    $this->assertEquals('pending', $targetTransaction['status']);
    $this->assertNotEmpty($targetTransaction['date']);
  }

  public function test_recent_transactions_supports_limit_parameter(): void
  {
    $user = User::create([
      'name'     => 'Test Limit User',
      'email'    => 'limit@test.com',
      'password' => Hash::make('password123'),
      'status'   => 'active',
    ]);

    for ($i = 1; $i <= 5; $i++) {
      Order::create([
        'user_id'        => $user->id,
        'order_code'     => "ORD-LIMIT-{$i}",
        'subtotal_price' => 10000 * $i,
        'total_price'    => 10000 * $i,
        'status'         => 'paid',
        'expired_at'     => now()->addHours(2),
        'paid_at'        => now(),
      ]);
    }

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/dashboard/recent-transactions?limit=2');

    $response->assertStatus(200)
      ->assertJsonPath('success', true);

    $this->assertCount(2, $response->json('data.transactins'));
  }
}
