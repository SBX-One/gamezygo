<?php

namespace Tests\Feature\User;

use App\Models\Community;
use App\Models\CommunityTag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CommunityTest extends TestCase
{
    use RefreshDatabase;

    protected CommunityTag $whatsappTag;

    protected CommunityTag $telegramTag;

    protected Community $activeCommunity1;

    protected Community $activeCommunity2;

    protected Community $inactiveCommunity;

    protected function setUp(): void
    {
        parent::setUp();

        $this->whatsappTag = CommunityTag::create([
            'name' => 'WhatsApp',
            'slug' => 'whatsapp',
        ]);

        $this->telegramTag = CommunityTag::create([
            'name' => 'Telegram',
            'slug' => 'telegram',
        ]);

        $this->activeCommunity1 = Community::create([
            'name' => 'Komunitas GTA | Gamerygo',
            'banner_file_url' => 'https://example.com/communities/gta.jpg',
            'link' => 'https://chat.whatsapp.com/example1',
            'is_active' => true,
            'order_number' => 1,
        ]);
        $this->activeCommunity1->tags()->attach($this->whatsappTag->id);

        $this->activeCommunity2 = Community::create([
            'name' => 'Gamerygo Gaming Community',
            'banner_file_url' => 'https://example.com/communities/gaming.jpg',
            'link' => 'https://t.me/example',
            'is_active' => true,
            'order_number' => 2,
        ]);
        $this->activeCommunity2->tags()->attach($this->telegramTag->id);

        $this->inactiveCommunity = Community::create([
            'name' => 'Secret Hidden Group',
            'banner_file_url' => 'https://example.com/communities/hidden.jpg',
            'link' => 'https://t.me/hidden',
            'is_active' => false,
            'order_number' => 3,
        ]);
    }

    public function test_user_can_list_active_communities(): void
    {
        $response = $this->getJson('/api/v1/communities');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Communities retrieved successfully',
            ])
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.name', 'Komunitas GTA | Gamerygo')
            ->assertJsonPath('data.0.tags.0.name', 'WhatsApp')
            ->assertJsonPath('data.1.name', 'Gamerygo Gaming Community');
    }

    public function test_user_can_filter_communities_by_search(): void
    {
        $response = $this->getJson('/api/v1/communities?search=GTA');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Komunitas GTA | Gamerygo');
    }

    public function test_user_can_filter_communities_by_tag_id(): void
    {
        $response = $this->getJson("/api/v1/communities?tag_id={$this->telegramTag->id}");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Gamerygo Gaming Community');

        $multiResponse = $this->getJson("/api/v1/communities?tag_ids[]={$this->whatsappTag->id}");
        $multiResponse->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Komunitas GTA | Gamerygo');
    }

    public function test_user_can_filter_communities_by_tag_slug(): void
    {
        $response = $this->getJson('/api/v1/communities?tag=telegram');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Gamerygo Gaming Community');
    }

    public function test_user_can_sort_communities(): void
    {
        $response = $this->getJson('/api/v1/communities?sort_by=name');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.name', 'Gamerygo Gaming Community')
            ->assertJsonPath('data.1.name', 'Komunitas GTA | Gamerygo');
    }

    public function test_user_can_paginate_communities(): void
    {
        $response = $this->getJson('/api/v1/communities?page=1&per_page=1');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonStructure([
                'success',
                'message',
                'data',
                'meta' => [
                    'current_page',
                    'from',
                    'last_page',
                    'per_page',
                    'to',
                    'total',
                ],
            ])
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('meta.per_page', 1);
    }

    public function test_user_can_get_community_tags(): void
    {
        $response = $this->getJson('/api/v1/communities/tags');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Community tags retrieved successfully',
            ])
            ->assertJsonCount(2, 'data');
    }

    public function test_user_can_get_single_active_community(): void
    {
        $response = $this->getJson("/api/v1/communities/{$this->activeCommunity1->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Community retrieved successfully',
                'data' => [
                    'id' => $this->activeCommunity1->id,
                    'name' => 'Komunitas GTA | Gamerygo',
                    'banner_file_url' => 'https://example.com/communities/gta.jpg',
                    'link' => 'https://chat.whatsapp.com/example1',
                    'is_active' => true,
                    'order_number' => 1,
                ],
            ]);
    }

    public function test_user_cannot_view_inactive_or_non_existent_community(): void
    {
        $inactiveResponse = $this->getJson("/api/v1/communities/{$this->inactiveCommunity->id}");
        $inactiveResponse->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Community not found',
            ]);

        $notFoundResponse = $this->getJson('/api/v1/communities/99999');
        $notFoundResponse->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Community not found',
            ]);
    }

    public function test_direct_alias_routes_work(): void
    {
        // Alias /api/communities
        $response1 = $this->getJson('/api/communities');
        $response1->assertStatus(200)
            ->assertJson(['success' => true]);

        // Alias /api/communities/tags
        $response2 = $this->getJson('/api/communities/tags');
        $response2->assertStatus(200)
            ->assertJson(['success' => true]);

        // Alias /api/communities/{id}
        $response3 = $this->getJson("/api/communities/{$this->activeCommunity1->id}");
        $response3->assertStatus(200)
            ->assertJson(['success' => true]);

        // Alias /api/v1/user/communities (with auth)
        $user = User::create([
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);
        $token = auth('api')->tokenById($user->id);

        $response4 = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/user/communities');
        $response4->assertStatus(200)
            ->assertJson(['success' => true]);

        // Alias /api/user/communities
        $response5 = $this->getJson('/api/user/communities');
        $response5->assertStatus(200)
            ->assertJson(['success' => true]);
    }
}
