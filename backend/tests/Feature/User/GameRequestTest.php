<?php

namespace Tests\Feature\User;

use App\Models\GameRequest;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GameRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_view_all_game_requests_without_authentication(): void
    {
        $user = User::factory()->create();

        $req1 = GameRequest::create([
            'user_id' => $user->id,
            'name' => "Assassin's Creed Black Flag Resynced",
            'steam_url' => 'https://store.steampowered.com/app/242050/',
            'request_count' => 15,
            'status' => 'pending',
            'note' => null,
            'admin_note' => null,
        ]);

        $req2 = GameRequest::create([
            'user_id' => $user->id,
            'name' => 'Grand Theft Auto VI',
            'steam_url' => 'https://store.steampowered.com/app/999999/',
            'request_count' => 32,
            'status' => 'pending',
            'note' => null,
            'admin_note' => null,
        ]);

        $response = $this->getJson('/api/v1/game-requests');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Game requests retrieved successfully',
            ]);

        $data = $response->json('data');
        $this->assertCount(2, $data);

        $first = collect($data)->firstWhere('name', "Assassin's Creed Black Flag Resynced");
        $this->assertNotNull($first);
        $this->assertEquals(15, $first['request_count']);
        $this->assertEquals('pending', $first['status']);
        $this->assertArrayHasKey('created_at', $first);
        $this->assertArrayHasKey('updated_at', $first);

        $meta = $response->json('meta');
        $this->assertNotNull($meta);
        $this->assertEquals(1, $meta['current_page']);
        $this->assertEquals(2, $meta['total']);
    }

    public function test_public_can_paginate_game_requests(): void
    {
        $user = User::factory()->create();
        GameRequest::factory()->count(25)->create(['user_id' => $user->id]);

        $response = $this->getJson('/api/v1/game-requests?page=2&per_page=10');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(10, $data);

        $meta = $response->json('meta');
        $this->assertEquals(2, $meta['current_page']);
        $this->assertEquals(10, $meta['per_page']);
        $this->assertEquals(25, $meta['total']);
    }

    public function test_authenticated_user_can_view_own_game_requests_via_scope_mine(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        GameRequest::create([
            'user_id' => $userA->id,
            'name' => 'User A Mine Game 1',
            'steam_url' => 'https://store.steampowered.com/app/555/',
            'request_count' => 12,
            'status' => 'pending',
        ]);

        GameRequest::create([
            'user_id' => $userB->id,
            'name' => 'User B Other Game',
            'steam_url' => 'https://store.steampowered.com/app/666/',
            'request_count' => 1,
            'status' => 'pending',
        ]);

        $token = auth('api')->login($userA);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/game-requests?scope=mine');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Game requests retrieved successfully',
            ]);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('User A Mine Game 1', $data[0]['name']);
        $this->assertEquals(12, $data[0]['request_count']);
        $this->assertArrayHasKey('status', $data[0]);
        $this->assertArrayHasKey('note', $data[0]);
        $this->assertArrayHasKey('admin_note', $data[0]);
        $this->assertArrayHasKey('created_at', $data[0]);
        $this->assertArrayHasKey('updated_at', $data[0]);
    }

    public function test_unauthenticated_user_cannot_view_game_requests_with_scope_mine(): void
    {
        $response = $this->getJson('/api/v1/game-requests?scope=mine');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_view_own_game_requests_via_user_game_requests_endpoints(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        GameRequest::create([
            'user_id' => $userA->id,
            'name' => 'User A Game',
            'steam_url' => 'https://store.steampowered.com/app/111/',
            'request_count' => 10,
            'status' => 'pending',
        ]);

        GameRequest::create([
            'user_id' => $userB->id,
            'name' => 'User B Game',
            'steam_url' => 'https://store.steampowered.com/app/222/',
            'request_count' => 5,
            'status' => 'pending',
        ]);

        $token = auth('api')->login($userA);

        // Test GET /api/v1/user/game-requests
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/user/game-requests');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Game requests retrieved successfully',
            ]);
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('User A Game', $data[0]['name']);
        $this->assertEquals(10, $data[0]['request_count']);

        // Test GET /api/v1/user/game-requests/mine
        $responseMine = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/user/game-requests/mine');

        $responseMine->assertStatus(200);
        $this->assertCount(1, $responseMine->json('data'));

        // Test GET /api/v1/user/game-requests/user
        $responseUser = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/user/game-requests/user');

        $responseUser->assertStatus(200);
        $this->assertCount(1, $responseUser->json('data'));
    }

    public function test_unauthenticated_user_cannot_access_user_game_requests_endpoint(): void
    {
        $response = $this->getJson('/api/v1/user/game-requests');

        $response->assertStatus(401);
    }

    public function test_can_view_added_game_requests_via_scope_added(): void
    {
        $user = User::factory()->create();

        GameRequest::create([
            'user_id' => $user->id,
            'name' => 'Added Game 1',
            'steam_url' => 'https://store.steampowered.com/app/777/',
            'request_count' => 5,
            'status' => 'available',
        ]);

        GameRequest::create([
            'user_id' => $user->id,
            'name' => 'Pending Game 2',
            'steam_url' => 'https://store.steampowered.com/app/888/',
            'request_count' => 2,
            'status' => 'pending',
        ]);

        $response = $this->getJson('/api/v1/game-requests?scope=added');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Game requests retrieved successfully',
            ]);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('Added Game 1', $data[0]['name']);
        $this->assertEquals('available', $data[0]['status']);
        $this->assertEquals(5, $data[0]['request_count']);
    }

    public function test_user_cannot_create_game_request_with_invalid_url(): void
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/game-requests', [
                'steam_url' => 'https://epicgames.com/store/product/game',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_user_cannot_create_game_request_if_steam_game_does_not_exist(): void
    {
        Http::fake([
            'https://store.steampowered.com/api/appdetails*' => Http::response([
                '999999' => ['success' => false],
            ], 200),
        ]);

        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/game-requests', [
                'steam_url' => 'https://store.steampowered.com/app/999999',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Steam game not found or invalid Steam URL.',
            ]);
    }

    public function test_user_can_create_game_request_successfully_with_steam_api(): void
    {
        Http::fake([
            'https://store.steampowered.com/api/appdetails*' => Http::response([
                '242050' => [
                    'success' => true,
                    'data' => [
                        'name' => "Assassin's Creed Black Flag Resynced",
                    ],
                ],
            ], 200),
        ]);

        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/game-requests', [
                'steam_url' => 'https://store.steampowered.com/app/242050/Assassins_Creed_IV_Black_Flag/',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Game request created successfully',
                'data' => [
                    'name' => "Assassin's Creed Black Flag Resynced",
                    'status' => 'pending',
                    'note' => null,
                    'admin_note' => null,
                ],
            ]);

        $this->assertDatabaseHas('game_requests', [
            'user_id' => $user->id,
            'name' => "Assassin's Creed Black Flag Resynced",
            'status' => 'pending',
        ]);
    }

    public function test_user_cannot_request_game_already_in_catalog(): void
    {
        Http::fake([
            'https://store.steampowered.com/api/appdetails*' => Http::response([
                '242050' => [
                    'success' => true,
                    'data' => [
                        'name' => 'Existing Catalog Game',
                    ],
                ],
            ], 200),
        ]);

        Product::factory()->create([
            'name' => 'Existing Catalog Game',
            'steam_url' => 'https://store.steampowered.com/app/242050/',
        ]);

        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/game-requests', [
                'steam_url' => 'https://store.steampowered.com/app/242050/',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Game is already available in the catalog.',
            ]);
    }

    public function test_user_cannot_request_same_game_twice(): void
    {
        Http::fake([
            'https://store.steampowered.com/api/appdetails*' => Http::response([
                '242050' => [
                    'success' => true,
                    'data' => [
                        'name' => 'Duplicated Game',
                    ],
                ],
            ], 200),
        ]);

        $user = User::factory()->create();

        GameRequest::create([
            'user_id' => $user->id,
            'name' => 'Duplicated Game',
            'steam_url' => 'https://store.steampowered.com/app/242050/',
            'request_count' => 1,
            'status' => 'pending',
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/game-requests', [
                'steam_url' => 'https://store.steampowered.com/app/242050/',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'You have already requested this game.',
            ]);
    }

    public function test_user_cannot_request_game_already_marked_available(): void
    {
        Http::fake([
            'https://store.steampowered.com/api/appdetails*' => Http::response([
                '242050' => [
                    'success' => true,
                    'data' => [
                        'name' => 'Available Game',
                    ],
                ],
            ], 200),
        ]);

        $otherUser = User::factory()->create();

        GameRequest::create([
            'user_id' => $otherUser->id,
            'name' => 'Available Game',
            'steam_url' => 'https://store.steampowered.com/app/242050/',
            'request_count' => 1,
            'status' => 'available',
        ]);

        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/game-requests', [
                'steam_url' => 'https://store.steampowered.com/app/242050/',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'This game is already available.',
            ]);
    }

    public function test_multiple_users_requesting_same_game_updates_request_count(): void
    {
        Http::fake([
            'https://store.steampowered.com/api/appdetails*' => Http::response([
                '333333' => [
                    'success' => true,
                    'data' => [
                        'name' => 'Popular Game',
                    ],
                ],
            ], 200),
        ]);

        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $token1 = auth('api')->login($user1);
        $this->withHeader('Authorization', "Bearer {$token1}")
            ->postJson('/api/v1/user/game-requests', [
                'steam_url' => 'https://store.steampowered.com/app/333333/',
            ])
            ->assertStatus(201);

        $token2 = auth('api')->login($user2);
        $this->withHeader('Authorization', "Bearer {$token2}")
            ->postJson('/api/v1/user/game-requests', [
                'steam_url' => 'https://store.steampowered.com/app/333333/',
            ])
            ->assertStatus(201);

        $response = $this->getJson('/api/v1/game-requests');
        $response->assertStatus(200);

        $items = $response->json('data');
        foreach ($items as $item) {
            if ($item['name'] === 'Popular Game') {
                $this->assertEquals(2, $item['request_count']);
            }
        }
    }

    public function test_user_can_delete_own_game_request(): void
    {
        $user = User::factory()->create();

        $gameRequest = GameRequest::create([
            'user_id' => $user->id,
            'name' => 'Game to Delete',
            'steam_url' => 'https://store.steampowered.com/app/444444/',
            'request_count' => 1,
            'status' => 'pending',
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/v1/user/game-requests/{$gameRequest->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Game request deleted successfully',
                'data' => null,
            ]);

        $this->assertDatabaseMissing('game_requests', [
            'id' => $gameRequest->id,
        ]);
    }

    public function test_user_cannot_delete_other_users_game_request(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $gameRequest = GameRequest::create([
            'user_id' => $userA->id,
            'name' => 'User A Protected Game',
            'steam_url' => 'https://store.steampowered.com/app/555555/',
            'request_count' => 1,
            'status' => 'pending',
        ]);

        $tokenB = auth('api')->login($userB);

        $response = $this->withHeader('Authorization', "Bearer {$tokenB}")
            ->deleteJson("/api/v1/user/game-requests/{$gameRequest->id}");

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'You are not authorized to delete this game request',
                'data' => null,
            ]);

        $this->assertDatabaseHas('game_requests', [
            'id' => $gameRequest->id,
        ]);
    }

    public function test_deleting_nonexistent_game_request_returns_404(): void
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson('/api/v1/user/game-requests/999999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Game request not found',
                'data' => null,
            ]);
    }
}
