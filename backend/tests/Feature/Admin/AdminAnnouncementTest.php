<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Announcement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminAnnouncementTest extends TestCase
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
        $response = $this->getJson('/api/v1/admin/announcements');
        $response->assertStatus(401);
    }

    public function test_customer_user_is_forbidden_from_admin_announcements(): void
    {
        $userToken = auth('api')->tokenById($this->user->id);

        $response = $this->withHeader('Authorization', "Bearer {$userToken}")
            ->getJson('/api/v1/admin/announcements');

        $response->assertStatus(401);
    }

    public function test_admin_can_retrieve_announcements_index_with_filters(): void
    {
        Announcement::create([
            'banner_file_url' => 'https://example.com/announcements/banner-1.jpg',
            'link' => 'https://gamerygo.com/promo',
            'sort_order' => 1,
            'is_published' => true,
        ]);

        Announcement::create([
            'banner_file_url' => 'https://example.com/announcements/banner-2.jpg',
            'link' => 'https://gamerygo.com/subscriptions',
            'sort_order' => 2,
            'is_published' => true,
        ]);

        Announcement::create([
            'banner_file_url' => 'https://example.com/announcements/banner-3.jpg',
            'link' => 'https://gamerygo.com/catalog',
            'sort_order' => 3,
            'is_published' => false,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/announcements?is_publish=true');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Announcements retrieved successfully')
            ->assertJsonPath('data.total_announcements', 2)
            ->assertJsonPath('data.announcements.0.link', 'https://gamerygo.com/promo')
            ->assertJsonPath('data.announcements.0.is_publish', true)
            ->assertJsonPath('data.announcements.0.sort', 1)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'total_announcements',
                    'announcements' => [
                        '*' => [
                            'id',
                            'banner_file_url',
                            'link',
                            'is_publish',
                            'sort',
                            'created_at',
                            'updated_at',
                        ],
                    ],
                ],
            ]);
    }

    public function test_admin_can_show_single_announcement(): void
    {
        $item = Announcement::create([
            'banner_file_url' => 'https://example.com/announcements/banner-4.jpg',
            'link' => 'https://gamerygo.com/promo',
            'sort_order' => 4,
            'is_published' => true,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/announcements/{$item->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Announcement retrieved successfully')
            ->assertJsonPath('data.id', $item->id)
            ->assertJsonPath('data.banner_file_url', 'https://example.com/announcements/banner-4.jpg')
            ->assertJsonPath('data.link', 'https://gamerygo.com/promo')
            ->assertJsonPath('data.is_publish', true)
            ->assertJsonPath('data.sort', 4);
    }

    public function test_admin_can_create_announcement_with_file_upload(): void
    {
        $file = UploadedFile::fake()->image('banner.jpg', 1200, 400);

        $payload = [
            'banner_file' => $file,
            'link' => 'https://gamerygo.com/promo',
            'is_publish' => true,
            'sort' => 4,
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/announcements', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Announcement created successfully')
            ->assertJsonPath('data.link', 'https://gamerygo.com/promo')
            ->assertJsonPath('data.is_publish', true)
            ->assertJsonPath('data.sort', 4);

        $this->assertDatabaseHas('announcements', [
            'link' => 'https://gamerygo.com/promo',
            'is_published' => true,
        ]);
    }

    public function test_admin_can_update_announcement(): void
    {
        $item = Announcement::create([
            'banner_file_url' => 'https://example.com/old.jpg',
            'link' => 'https://gamerygo.com/old',
            'sort_order' => 1,
            'is_published' => false,
        ]);

        $payload = [
            'banner_file' => 'https://example.com/announcements/banner-4-updated.jpg',
            'link' => 'https://gamerygo.com/summer-sale',
            'is_publish' => true,
            'sort' => 4,
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/v1/admin/announcements/{$item->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Announcement updated successfully')
            ->assertJsonPath('data.banner_file_url', 'https://example.com/announcements/banner-4-updated.jpg')
            ->assertJsonPath('data.link', 'https://gamerygo.com/summer-sale')
            ->assertJsonPath('data.is_publish', true)
            ->assertJsonPath('data.sort', 4);

        $this->assertEquals('https://gamerygo.com/summer-sale', $item->fresh()->link);
        $this->assertTrue((bool) $item->fresh()->is_published);
    }

    public function test_admin_can_toggle_publish_status(): void
    {
        $item = Announcement::create([
            'banner_file_url' => 'https://example.com/b.jpg',
            'link' => 'https://gamerygo.com/link',
            'sort_order' => 1,
            'is_published' => false,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson("/api/v1/admin/announcements/{$item->id}/publish", [
                'is_publish' => true,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Announcement published successfully')
            ->assertJsonPath('data.id', $item->id)
            ->assertJsonPath('data.is_publish', true);

        $this->assertTrue((bool) $item->fresh()->is_published);
    }

    public function test_admin_can_sort_announcements(): void
    {
        $item1 = Announcement::create(['banner_file_url' => '1.jpg', 'sort_order' => 1]);
        $item2 = Announcement::create(['banner_file_url' => '2.jpg', 'sort_order' => 2]);
        $item3 = Announcement::create(['banner_file_url' => '3.jpg', 'sort_order' => 3]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/announcements/sort', [
                'announcement_ids' => [$item3->id, $item1->id, $item2->id],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Announcements sorted successfully')
            ->assertJsonPath('data', null);

        $this->assertEquals(1, $item3->fresh()->sort_order);
        $this->assertEquals(2, $item1->fresh()->sort_order);
        $this->assertEquals(3, $item2->fresh()->sort_order);
    }

    public function test_admin_can_delete_announcement(): void
    {
        $item = Announcement::create(['banner_file_url' => 'del.jpg']);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/v1/admin/announcements/{$item->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Announcement deleted successfully')
            ->assertJsonPath('data', null);

        $this->assertDatabaseMissing('announcements', ['id' => $item->id]);
    }

    public function test_admin_can_access_legacy_route_without_v1(): void
    {
        Announcement::create(['banner_file_url' => 'leg.jpg']);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/admin/announcements');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Announcements retrieved successfully');
    }
}
