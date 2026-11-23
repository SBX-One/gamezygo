<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Community;
use App\Models\CommunityTag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminCommunityTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;

    protected string $adminToken;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

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
        $response = $this->getJson('/api/v1/admin/communities');
        $response->assertStatus(401);
    }

    public function test_customer_user_is_forbidden_from_admin_communities(): void
    {
        $userToken = auth('api')->tokenById($this->user->id);

        $response = $this->withHeader('Authorization', "Bearer {$userToken}")
            ->getJson('/api/v1/admin/communities');

        $response->assertStatus(401);
    }

    public function test_admin_can_retrieve_communities_index_with_search_tag_and_sort(): void
    {
        $tagWa = CommunityTag::create(['name' => 'WhatsApp', 'slug' => 'whatsapp']);
        $tagDiscord = CommunityTag::create(['name' => 'Discord', 'slug' => 'discord']);

        $comm1 = Community::create([
            'name' => 'Komunitas GTA | Gamerygo',
            'banner_file_url' => 'https://example.com/communities/gta.jpg',
            'link' => 'https://chat.whatsapp.com/example1',
            'is_active' => true,
            'order_number' => 1,
        ]);
        $comm1->tags()->sync([$tagWa->id]);

        $comm2 = Community::create([
            'name' => 'Gamerygo Gaming Community',
            'banner_file_url' => 'https://example.com/communities/gaming.jpg',
            'link' => 'https://discord.gg/example2',
            'is_active' => true,
            'order_number' => 2,
        ]);
        $comm2->tags()->sync([$tagDiscord->id]);

        $comm3 = Community::create([
            'name' => 'GTA Roleplay Community',
            'banner_file_url' => 'https://example.com/communities/gta-rp.jpg',
            'link' => 'https://discord.gg/example3',
            'is_active' => false,
            'order_number' => 3,
        ]);
        $comm3->tags()->sync([$tagDiscord->id]);

        // Filter search=GTA, tag_ids[] = tagWa->id
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/communities?search=GTA&tag_ids[]={$tagWa->id}&sort_by=position");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Communities retrieved successfully')
            ->assertJsonPath('data.total_communities', 1)
            ->assertJsonPath('data.communities.0.id', $comm1->id)
            ->assertJsonPath('data.communities.0.name', 'Komunitas GTA | Gamerygo')
            ->assertJsonPath('data.communities.0.tags.0.name', 'WhatsApp')
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'total_communities',
                    'communities' => [
                        '*' => [
                            'id',
                            'name',
                            'banner_file_url',
                            'link',
                            'is_active',
                            'order_number',
                            'tags' => [
                                '*' => [
                                    'id',
                                    'name',
                                ],
                            ],
                            'created_at',
                            'updated_at',
                        ],
                    ],
                ],
            ]);
    }

    public function test_admin_can_retrieve_community_tags(): void
    {
        CommunityTag::create(['name' => 'WhatsApp', 'slug' => 'whatsapp']);
        CommunityTag::create(['name' => 'Discord', 'slug' => 'discord']);
        CommunityTag::create(['name' => 'Telegram', 'slug' => 'telegram']);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/communities/tags');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Community tags retrieved successfully')
            ->assertJsonCount(3, 'data.tags')
            ->assertJsonPath('data.tags.0.name', 'Discord');
    }

    public function test_admin_can_show_single_community(): void
    {
        $tag = CommunityTag::create(['name' => 'WhatsApp', 'slug' => 'whatsapp']);

        $comm = Community::create([
            'name' => 'Komunitas Gamers Mobile Legends',
            'banner_file_url' => 'https://example.com/communities/mlbb.jpg',
            'link' => 'https://chat.whatsapp.com/example5',
            'is_active' => true,
            'order_number' => 5,
        ]);
        $comm->tags()->sync([$tag->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/communities/{$comm->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Community retrieved successfully')
            ->assertJsonPath('data.id', $comm->id)
            ->assertJsonPath('data.name', 'Komunitas Gamers Mobile Legends')
            ->assertJsonPath('data.link', 'https://chat.whatsapp.com/example5')
            ->assertJsonPath('data.order_number', 5)
            ->assertJsonPath('data.is_active', true)
            ->assertJsonPath('data.tags.0.id', $tag->id)
            ->assertJsonPath('data.tags.0.name', 'WhatsApp');
    }

    public function test_admin_can_create_community_with_tags_and_file_upload(): void
    {
        $tag1 = CommunityTag::create(['name' => 'WhatsApp', 'slug' => 'whatsapp']);
        $tag2 = CommunityTag::create(['name' => 'Discord', 'slug' => 'discord']);

        $file = UploadedFile::fake()->image('banner.jpg', 600, 400);

        $payload = [
            'name' => 'Komunitas Valorant Indonesia',
            'banner_file' => $file,
            'link' => 'https://chat.whatsapp.com/valorant-indo',
            'tag_ids' => [$tag1->id, $tag2->id],
            'is_active' => true,
            'order_number' => 1,
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/communities', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Community created successfully')
            ->assertJsonPath('data.name', 'Komunitas Valorant Indonesia')
            ->assertJsonPath('data.link', 'https://chat.whatsapp.com/valorant-indo')
            ->assertJsonPath('data.order_number', 1)
            ->assertJsonPath('data.is_active', true)
            ->assertJsonCount(2, 'data.tags');

        $this->assertDatabaseHas('communities', [
            'name' => 'Komunitas Valorant Indonesia',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_update_community_with_string_banner_and_sync_tags(): void
    {
        $tag1 = CommunityTag::create(['name' => 'WhatsApp', 'slug' => 'whatsapp']);
        $tag2 = CommunityTag::create(['name' => 'Discord', 'slug' => 'discord']);

        $comm = Community::create([
            'name' => 'Komunitas Old',
            'banner_file_url' => 'https://example.com/old.jpg',
            'link' => 'https://example.com/old',
            'is_active' => false,
            'order_number' => 5,
        ]);
        $comm->tags()->sync([$tag1->id]);

        $payload = [
            'name' => 'Komunitas Gamers Mobile Legends Updated',
            'banner_file' => 'https://example.com/communities/mlbb-updated.jpg',
            'link' => 'https://chat.whatsapp.com/example5-new',
            'tag_ids' => [$tag2->id],
            'is_active' => true,
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/v1/admin/communities/{$comm->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Community updated successfully')
            ->assertJsonPath('data.name', 'Komunitas Gamers Mobile Legends Updated')
            ->assertJsonPath('data.banner_file_url', 'https://example.com/communities/mlbb-updated.jpg')
            ->assertJsonPath('data.link', 'https://chat.whatsapp.com/example5-new')
            ->assertJsonPath('data.is_active', true)
            ->assertJsonCount(1, 'data.tags')
            ->assertJsonPath('data.tags.0.id', $tag2->id);

        $this->assertEquals('Komunitas Gamers Mobile Legends Updated', $comm->fresh()->name);
        $this->assertTrue((bool) $comm->fresh()->is_active);
    }

    public function test_admin_can_update_community_status(): void
    {
        $comm = Community::create([
            'name' => 'Komunitas Gamers Mobile Legends',
            'banner_file_url' => 'https://example.com/communities/mlbb.jpg',
            'link' => 'https://chat.whatsapp.com/example5',
            'is_active' => true,
            'order_number' => 5,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson("/api/v1/admin/communities/{$comm->id}/status", [
                'is_active' => false,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Community status updated successfully')
            ->assertJsonPath('data.id', $comm->id)
            ->assertJsonPath('data.name', 'Komunitas Gamers Mobile Legends')
            ->assertJsonPath('data.is_active', false);

        $this->assertFalse((bool) $comm->fresh()->is_active);
    }

    public function test_admin_can_sort_communities(): void
    {
        $c1 = Community::create(['name' => 'Comm 1', 'order_number' => 1]);
        $c2 = Community::create(['name' => 'Comm 2', 'order_number' => 2]);
        $c3 = Community::create(['name' => 'Comm 3', 'order_number' => 3]);
        $c4 = Community::create(['name' => 'Comm 4', 'order_number' => 4]);
        $c5 = Community::create(['name' => 'Comm 5', 'order_number' => 5]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/communities/sort', [
                'community_ids' => [$c3->id, $c1->id, $c5->id, $c2->id, $c4->id],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Communities sorted successfully')
            ->assertJsonCount(5, 'data.communities')
            ->assertJsonPath('data.communities.0.id', $c3->id)
            ->assertJsonPath('data.communities.0.order_number', 1)
            ->assertJsonPath('data.communities.1.id', $c1->id)
            ->assertJsonPath('data.communities.1.order_number', 2);

        $this->assertEquals(1, $c3->fresh()->order_number);
        $this->assertEquals(2, $c1->fresh()->order_number);
        $this->assertEquals(3, $c5->fresh()->order_number);
        $this->assertEquals(4, $c2->fresh()->order_number);
        $this->assertEquals(5, $c4->fresh()->order_number);
    }

    public function test_admin_can_delete_community(): void
    {
        $comm = Community::create([
            'name' => 'Delete Me',
            'banner_file_url' => 'https://example.com/del.jpg',
            'link' => 'https://example.com',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/v1/admin/communities/{$comm->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Community deleted successfully')
            ->assertJsonPath('data', null);

        $this->assertDatabaseMissing('communities', ['id' => $comm->id]);
    }

    public function test_admin_can_access_legacy_route_without_v1(): void
    {
        $comm = Community::create([
            'name' => 'Legacy Comm',
            'banner_file_url' => 'https://example.com/leg.jpg',
            'link' => 'https://example.com',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/communities');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Communities retrieved successfully');
    }
}
