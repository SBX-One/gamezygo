<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Faq;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminFaqTest extends TestCase
{
  use RefreshDatabase;

  protected Admin $admin;
  protected string $adminToken;
  protected User $user;

  protected function setUp(): void
  {
    parent::setUp();

    $this->admin = Admin::create([
      'name'     => 'Gamezygo Admin',
      'email'    => 'admin@gamezygo.com',
      'password' => Hash::make('secretadmin123'),
    ]);

    $this->adminToken = auth('admin')->tokenById($this->admin->id);

    $this->user = User::create([
      'name'     => 'Regular User',
      'email'    => 'user@example.com',
      'password' => Hash::make('secret123'),
      'status'   => 'active',
    ]);
  }

  public function test_unauthenticated_request_is_rejected(): void
  {
    $response = $this->getJson('/api/v1/admin/faqs');
    $response->assertStatus(401);
  }

  public function test_customer_user_is_forbidden_from_admin_faqs(): void
  {
    $userToken = auth('api')->tokenById($this->user->id);

    $response = $this->withHeader('Authorization', "Bearer {$userToken}")
      ->getJson('/api/v1/admin/faqs');

    $response->assertStatus(401);
  }

  public function test_admin_can_retrieve_faqs_index_with_page_filter(): void
  {
    Faq::create([
      'question'     => 'Bagaimana cara membeli game?',
      'answer'       => 'Pilih game dan selesaikan pembayaran.',
      'page'         => 'home',
      'order_number' => 1,
      'is_active'    => true,
    ]);

    Faq::create([
      'question'     => 'Apa itu subscription?',
      'answer'       => 'Akses game tak terbatas.',
      'page'         => 'subscription',
      'order_number' => 2,
      'is_active'    => true,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/faqs?page_name=home&page=1&per_page=10');

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'FAQs retrieved successfully')
      ->assertJsonPath('data.total_faqs', 1)
      ->assertJsonPath('data.faqs.0.question', 'Bagaimana cara membeli game?')
      ->assertJsonPath('data.faqs.0.page', 'home')
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'total_faqs',
          'faqs' => [
            '*' => [
              'id',
              'question',
              'answer',
              'page',
              'order_number',
              'is_active',
              'created_at',
              'updated_at',
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

  public function test_admin_can_retrieve_available_pages_list(): void
  {
    Faq::create([
      'question' => 'Sample Q',
      'answer'   => 'Sample A',
      'page'     => 'custom_checkout',
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/faqs/pages');

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'FAQ pages retrieved successfully')
      ->assertJsonFragment(['home'])
      ->assertJsonFragment(['custom_checkout']);
  }

  public function test_admin_can_show_single_faq(): void
  {
    $faq = Faq::create([
      'question'     => 'Pertanyaan Detail?',
      'answer'       => 'Jawaban Detail.',
      'page'         => 'catalog',
      'order_number' => 3,
      'is_active'    => true,
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson("/api/v1/admin/faqs/{$faq->id}");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'FAQ retrieved successfully')
      ->assertJsonPath('data.id', $faq->id)
      ->assertJsonPath('data.question', 'Pertanyaan Detail?')
      ->assertJsonPath('data.page', 'catalog')
      ->assertJsonPath('data.order_number', 3);
  }

  public function test_admin_can_create_faq_with_page(): void
  {
    $payload = [
      'question'     => 'Bagaimana cara download game?',
      'answer'       => 'Masuk ke library dan klik download.',
      'page'         => 'subscription',
      'order_number' => 1,
      'is_active'    => true,
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson('/api/v1/admin/faqs', $payload);

    $response->assertStatus(201)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'FAQ created successfully')
      ->assertJsonPath('data.question', 'Bagaimana cara download game?')
      ->assertJsonPath('data.page', 'subscription')
      ->assertJsonPath('data.order_number', 1);

    $this->assertDatabaseHas('faqs', [
      'question' => 'Bagaimana cara download game?',
      'page'     => 'subscription',
    ]);
  }

  public function test_admin_can_update_faq(): void
  {
    $faq = Faq::create([
      'question'     => 'Old Question?',
      'answer'       => 'Old Answer.',
      'page'         => 'home',
      'order_number' => 1,
      'is_active'    => true,
    ]);

    $payload = [
      'question' => 'New Updated Question?',
      'answer'   => 'New Updated Answer.',
      'page'     => 'checkout',
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->putJson("/api/v1/admin/faqs/{$faq->id}", $payload);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'FAQ updated successfully')
      ->assertJsonPath('data.id', $faq->id)
      ->assertJsonPath('data.question', 'New Updated Question?')
      ->assertJsonPath('data.page', 'checkout');

    $this->assertEquals('checkout', $faq->fresh()->page);
  }

  public function test_admin_can_toggle_faq_status(): void
  {
    $faq = Faq::create([
      'question'     => 'Test Toggle?',
      'answer'       => 'Toggle A.',
      'page'         => 'general',
      'order_number' => 1,
      'is_active'    => true,
    ]);

    // Deactivate
    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->putJson("/api/v1/admin/faqs/{$faq->id}/status", ['is_active' => false]);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'FAQ deactivated successfully')
      ->assertJsonPath('data.is_active', false);

    $this->assertFalse((bool) $faq->fresh()->is_active);

    // Activate
    $responseAct = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->putJson("/api/v1/admin/faqs/{$faq->id}/status", ['is_active' => true]);

    $responseAct->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'FAQ activated successfully')
      ->assertJsonPath('data.is_active', true);

    $this->assertTrue((bool) $faq->fresh()->is_active);
  }

  public function test_admin_can_reorder_faqs(): void
  {
    $faq1 = Faq::create(['question' => 'Q1', 'answer' => 'A1', 'order_number' => 1]);
    $faq2 = Faq::create(['question' => 'Q2', 'answer' => 'A2', 'order_number' => 2]);

    $payload = [
      'orders' => [
        ['id' => $faq1->id, 'order_number' => 10],
        ['id' => $faq2->id, 'order_number' => 20],
      ],
    ];

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson('/api/v1/admin/faqs/sort', $payload);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'FAQ order updated successfully');

    $this->assertEquals(10, $faq1->fresh()->order_number);
    $this->assertEquals(20, $faq2->fresh()->order_number);
  }

  public function test_admin_can_delete_single_and_bulk_faqs(): void
  {
    $faq1 = Faq::create(['question' => 'Q1', 'answer' => 'A1']);
    $faq2 = Faq::create(['question' => 'Q2', 'answer' => 'A2']);
    $faq3 = Faq::create(['question' => 'Q3', 'answer' => 'A3']);

    // Single delete
    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson("/api/v1/admin/faqs/{$faq1->id}");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'FAQ deleted successfully');

    $this->assertDatabaseMissing('faqs', ['id' => $faq1->id]);

    // Bulk delete
    $responseBulk = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson('/api/v1/admin/faqs', ['ids' => [$faq2->id, $faq3->id]]);

    $responseBulk->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'FAQ deleted successfully');

    $this->assertDatabaseMissing('faqs', ['id' => $faq2->id]);
    $this->assertDatabaseMissing('faqs', ['id' => $faq3->id]);
  }

  public function test_admin_can_access_legacy_route_without_v1(): void
  {
    Faq::create(['question' => 'Legacy?', 'answer' => 'Ans']);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/admin/faqs');

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'FAQs retrieved successfully');
  }
}

