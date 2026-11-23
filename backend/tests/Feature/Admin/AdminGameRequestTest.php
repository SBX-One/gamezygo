<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\GameRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminGameRequestTest extends TestCase
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
            'name' => 'Regular Gamer',
            'email' => 'gamer@example.com',
            'password' => Hash::make('secret123'),
            'status' => 'active',
        ]);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->getJson('/api/v1/admin/game-requests');

        $response->assertStatus(401);
    }

    public function test_customer_user_is_forbidden_from_admin_game_requests(): void
    {
        $userToken = auth('api')->tokenById($this->user->id);

        $response = $this->withHeader('Authorization', "Bearer {$userToken}")
            ->getJson('/api/v1/admin/game-requests');

        $response->assertStatus(401);
    }

    public function test_admin_can_retrieve_game_requests_index_with_pinned_and_requested(): void
    {
        // Create pinned game request
        $pinned = GameRequest::create([
            'user_id' => $this->user->id,
            'name' => 'Grand Theft Auto VI',
            'steam_url' => 'https://store.steampowered.com/app/12345/GTA6/',
            'request_count' => 124,
            'status' => 'pending',
            'is_pinned' => true,
        ]);

        // Create unpinned requested game request
        $requested = GameRequest::create([
            'user_id' => $this->user->id,
            'name' => 'Black Myth: Wukong',
            'steam_url' => 'https://store.steampowered.com/app/2358720/',
            'request_count' => 90,
            'status' => 'pending',
            'is_pinned' => false,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/game-requests?status=pending&sort_by=most_requested&page=1&per_page=10');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Game requests retrieved successfully')
            ->assertJsonPath('data.total_requests', 2)
            ->assertJsonPath('data.pinned_games.total', 1)
            ->assertJsonPath('data.pinned_games.items.0.product_name', 'Grand Theft Auto VI')
            ->assertJsonPath('data.pinned_games.items.0.is_pinned', true)
            ->assertJsonPath('data.pinned_games.items.0.total_requests', 124)
            ->assertJsonPath('data.requested_games.total', 1)
            ->assertJsonPath('data.requested_games.items.0.product_name', 'Black Myth: Wukong')
            ->assertJsonPath('data.requested_games.items.0.is_pinned', false)
            ->assertJsonPath('data.requested_games.items.0.total_requests', 90)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'total_requests',
                    'pinned_games' => [
                        'total',
                        'items' => [
                            '*' => [
                                'id',
                                'product_name',
                                'total_requests',
                                'first_requested_at',
                                'steam_url',
                                'status',
                                'is_pinned',
                            ],
                        ],
                    ],
                    'requested_games' => [
                        'total',
                        'items' => [
                            '*' => [
                                'id',
                                'product_name',
                                'total_requests',
                                'first_requested_at',
                                'steam_url',
                                'status',
                                'is_pinned',
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
                ],
            ]);
    }

    public function test_admin_can_retrieve_single_game_request_detail(): void
    {
        $gameRequest = GameRequest::create([
            'user_id' => $this->user->id,
            'name' => 'Black Myth: Wukong',
            'steam_url' => 'https://store.steampowered.com/app/2358720/',
            'request_count' => 124,
            'status' => 'pending',
            'is_pinned' => false,
            'last_requested_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/game-requests/{$gameRequest->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Game request retrieved successfully')
            ->assertJsonPath('data.id', $gameRequest->id)
            ->assertJsonPath('data.product_name', 'Black Myth: Wukong')
            ->assertJsonPath('data.steam_url', 'https://store.steampowered.com/app/2358720/')
            ->assertJsonPath('data.total_requests', 124)
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.is_pinned', false)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'product_name',
                    'steam_url',
                    'total_requests',
                    'status',
                    'is_pinned',
                    'first_requested_at',
                    'last_requested_at',
                    'reviewed_at',
                    'product_id',
                ],
            ]);
    }

    public function test_admin_can_toggle_pin_status(): void
    {
        $gameRequest = GameRequest::create([
            'user_id' => $this->user->id,
            'name' => 'Black Myth: Wukong',
            'steam_url' => 'https://store.steampowered.com/app/2358720/',
            'request_count' => 124,
            'status' => 'pending',
            'is_pinned' => false,
        ]);

        // Pin
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson("/api/v1/admin/game-requests/{$gameRequest->id}/pin");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Game request pinned successfully')
            ->assertJsonPath('data.id', $gameRequest->id)
            ->assertJsonPath('data.is_pinned', true);

        $this->assertTrue((bool) $gameRequest->fresh()->is_pinned);

        // Unpin
        $responseUnpin = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->patchJson("/api/v1/admin/game-requests/{$gameRequest->id}/pin");

        $responseUnpin->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Game request unpinned successfully')
            ->assertJsonPath('data.is_pinned', false);

        $this->assertFalse((bool) $gameRequest->fresh()->is_pinned);
    }

    public function test_admin_can_bulk_update_status(): void
    {
        $req1 = GameRequest::create([
            'user_id' => $this->user->id,
            'name' => 'Game One',
            'steam_url' => 'https://store.steampowered.com/app/1/',
            'request_count' => 5,
            'status' => 'pending',
        ]);

        $req2 = GameRequest::create([
            'user_id' => $this->user->id,
            'name' => 'Game Two',
            'steam_url' => 'https://store.steampowered.com/app/2/',
            'request_count' => 10,
            'status' => 'pending',
        ]);

        $payload = [
            'request_ids' => [$req1->id, $req2->id],
            'status' => 'accepted',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/game-requests/status', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Game requests accepted successfully')
            ->assertJsonPath('data.total_updated', 2)
            ->assertJsonPath('data.status', 'accepted')
            ->assertJsonPath('data.updated_ids', [$req1->id, $req2->id]);

        $this->assertEquals('accepted', $req1->fresh()->status);
        $this->assertNotNull($req1->fresh()->reviewed_at);
        $this->assertEquals('accepted', $req2->fresh()->status);
        $this->assertNotNull($req2->fresh()->reviewed_at);
    }

    public function test_admin_can_access_legacy_route_without_v1(): void
    {
        $gameRequest = GameRequest::create([
            'user_id' => $this->user->id,
            'name' => 'Legacy Route Game',
            'steam_url' => 'https://store.steampowered.com/app/999/',
            'request_count' => 1,
            'status' => 'pending',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/game-requests?status=pending');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Game requests retrieved successfully');
    }
}
