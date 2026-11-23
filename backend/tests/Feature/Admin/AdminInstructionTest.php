<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminInstructionTest extends TestCase
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
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('secret123'),
            'status' => 'active',
        ]);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->getJson('/api/v1/admin/instructions');
        $response->assertStatus(401);
    }

    public function test_customer_user_is_forbidden_from_admin_instructions(): void
    {
        $userToken = auth('api')->tokenById($this->user->id);

        $response = $this->withHeader('Authorization', "Bearer {$userToken}")
            ->getJson('/api/v1/admin/instructions');

        $response->assertStatus(401);
    }

    public function test_admin_can_retrieve_instructions_index_with_filters(): void
    {
        $ins1 = ProductInstruction::create([
            'title' => 'Panduan Download Game',
            'content' => '<h3>LANGKAH 1</h3><p>Download game.</p>',
        ]);

        $ins2 = ProductInstruction::create([
            'title' => 'Panduan Aktivasi Steam Offline',
            'content' => '<h3>LANGKAH 1</h3><p>Aktivasi steam.</p>',
        ]);

        $ins3 = ProductInstruction::create([
            'title' => 'Panduan Instalasi Game',
            'content' => '<h3>LANGKAH 1</h3><p>Instalasi game.</p>',
        ]);

        $launcher = ProductLauncherCategory::create(['name' => 'Steam', 'slug' => 'steam']);

        Product::create([
            'name' => 'Sample Game 1',
            'slug' => 'sample-game-1',
            'description' => 'Test',
            'price' => 100000,
            'discount_price' => 0,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $ins1->id,
            'steam_url' => 'https://store.steampowered.com/app/1/',
            'status' => 'published',
            'is_subscription_supported' => false,
        ]);

        // Test filter is_used=true
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/instructions?is_used=true&page=1&per_page=10');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Instructions retrieved successfully')
            ->assertJsonPath('data.total_instructions', 1)
            ->assertJsonPath('data.instructions.0.id', $ins1->id)
            ->assertJsonPath('data.instructions.0.title', 'Panduan Download Game')
            ->assertJsonPath('data.instructions.0.is_used', true)
            ->assertJsonPath('data.instructions.0.total_products', 1)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'total_instructions',
                    'instructions' => [
                        '*' => [
                            'id',
                            'title',
                            'is_used',
                            'total_products',
                            'created_at',
                            'last_edit',
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

    public function test_admin_can_show_instruction_detail(): void
    {
        $instruction = ProductInstruction::create([
            'title' => 'Panduan Download Game',
            'content' => '<h3>LANGKAH 1</h3><p>Download game.</p>',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/instructions/{$instruction->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Instruction retrieved successfully')
            ->assertJsonPath('data.id', $instruction->id)
            ->assertJsonPath('data.title', 'Panduan Download Game')
            ->assertJsonPath('data.content', '<h3>LANGKAH 1</h3><p>Download game.</p>')
            ->assertJsonPath('data.is_used', false)
            ->assertJsonPath('data.total_products', 0)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'title',
                    'content',
                    'is_used',
                    'total_products',
                    'created_at',
                    'updated_at',
                ],
            ]);
    }

    public function test_admin_can_create_instruction_template(): void
    {
        $payload = [
            'title' => 'Panduan Download Game',
            'content' => '<h3>LANGKAH 1</h3><h4>Cari Monster Hunter Stories</h4><p>Buka katalog</p>',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/instructions', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Instruction template created successfully')
            ->assertJsonPath('data.title', 'Panduan Download Game')
            ->assertJsonPath('data.content', '<h3>LANGKAH 1</h3><h4>Cari Monster Hunter Stories</h4><p>Buka katalog</p>');

        $this->assertDatabaseHas('product_instructions', ['title' => 'Panduan Download Game']);
    }

    public function test_admin_can_update_instruction_template(): void
    {
        $instruction = ProductInstruction::create([
            'title' => 'Old Title',
            'content' => '<p>Old Content</p>',
        ]);

        $payload = [
            'title' => 'Panduan Download dan Aktivasi Game',
            'content' => '<h3>LANGKAH 1</h3><h4>Cari game di katalog</h4>',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/v1/admin/instructions/{$instruction->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Instruction template updated successfully')
            ->assertJsonPath('data.id', $instruction->id)
            ->assertJsonPath('data.title', 'Panduan Download dan Aktivasi Game')
            ->assertJsonPath('data.content', '<h3>LANGKAH 1</h3><h4>Cari game di katalog</h4>');

        $this->assertEquals('Panduan Download dan Aktivasi Game', $instruction->fresh()->title);
    }

    public function test_admin_can_delete_instruction_template(): void
    {
        $instruction = ProductInstruction::create([
            'title' => 'To Be Deleted',
            'content' => '<p>Content</p>',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/v1/admin/instructions/{$instruction->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Instruction template deleted successfully')
            ->assertJsonPath('data', null);

        $this->assertSoftDeleted('product_instructions', ['id' => $instruction->id]);
    }

    public function test_admin_can_access_legacy_route_without_v1(): void
    {
        $instruction = ProductInstruction::create([
            'title' => 'Legacy Instruction',
            'content' => '<p>Legacy Content</p>',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/instructions');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Instructions retrieved successfully');
    }
}
