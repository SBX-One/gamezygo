<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminBlogTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;

    protected string $adminToken;

    protected BlogCategory $defaultCategory;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = Admin::create([
            'name' => 'Gamerygo Admin',
            'email' => 'admin@gamezygo.com',
            'password' => Hash::make('secretadmin123'),
        ]);

        $this->adminToken = auth('admin')->tokenById($this->admin->id);

        $this->defaultCategory = BlogCategory::create([
            'name' => 'Gaming',
            'slug' => 'gaming',
        ]);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->getJson('/api/v1/admin/blogs');

        $response->assertStatus(401);
    }

    public function test_customer_user_is_forbidden_from_blog_management(): void
    {
        $user = User::create([
            'name' => 'Customer',
            'email' => 'customer@example.com',
            'password' => Hash::make('secret123'),
            'status' => 'active',
        ]);

        $userToken = auth('api')->tokenById($user->id);

        $response = $this->withHeader('Authorization', "Bearer {$userToken}")
            ->getJson('/api/v1/admin/blogs');

        $this->assertTrue(in_array($response->status(), [401, 403]));
    }

    public function test_admin_can_list_blogs_with_pagination_and_meta(): void
    {
        Blog::create([
            'title' => '10 Game Terbaik yang Wajib Kamu Mainkan',
            'slug' => '10-game-terbaik-yang-wajib-kamu-mainkan',
            'banner_file_url' => 'https://example.com/blogs/banner-1.jpg',
            'content' => '<p>Content 1</p>',
            'blog_category_id' => $this->defaultCategory->id,
            'status' => 'published',
            'published_at' => now()->subDays(2),
            'total_views' => 180,
        ]);

        Blog::create([
            'title' => 'Panduan Memilih Game RPG untuk Pemula',
            'slug' => 'panduan-memilih-game-rpg-untuk-pemula',
            'banner_file_url' => 'https://example.com/blogs/banner-3.jpg',
            'content' => '<p>Content 2</p>',
            'blog_category_id' => $this->defaultCategory->id,
            'status' => 'draft',
            'published_at' => null,
            'total_views' => 0,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/blogs?page=1&per_page=20');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'total_blog',
                    'blogs' => [
                        '*' => [
                            'id',
                            'banner_file_url',
                            'title',
                            'slug',
                            'status',
                            'published_at',
                            'total_views',
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
            ])
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_blog', 2)
            ->assertJsonPath('data.meta.total', 2)
            ->assertJsonCount(2, 'data.blogs');
    }

    public function test_admin_can_create_blog_as_draft(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('banner.jpg');

        $payload = [
            'title' => '10 Game Terbaik yang Wajib Kamu Mainkan',
            'content' => '<h2>10 Game Terbaik</h2><p>Daftar game pilihan.</p>',
            'banner_file' => $file,
            'status' => 'draft',
            'category_ids' => [$this->defaultCategory->id],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->post('/api/v1/admin/blogs', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'title',
                    'slug',
                    'banner_file_url',
                    'status',
                    'published_at',
                    'categories' => [
                        'id',
                        'name',
                        'slug',
                    ],
                    'created_at',
                ],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Blog created successfully')
            ->assertJsonPath('data.title', '10 Game Terbaik yang Wajib Kamu Mainkan')
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.published_at', null)
            ->assertJsonPath('data.categories.id', $this->defaultCategory->id);

        $this->assertDatabaseHas('blogs', [
            'title' => '10 Game Terbaik yang Wajib Kamu Mainkan',
            'status' => 'draft',
        ]);
    }

    public function test_admin_can_create_blog_as_published(): void
    {
        $payload = [
            'title' => 'Game Terbaru 2026',
            'content' => '<p>Game terbaru di tahun 2026.</p>',
            'status' => 'published',
            'category_ids' => [$this->defaultCategory->id],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/blogs', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'published');

        $this->assertNotNull($response->json('data.published_at'));
    }

    public function test_admin_can_show_blog_preview(): void
    {
        $blog = Blog::create([
            'title' => '15 Game Terbaik yang Wajib Kamu Mainkan di 2026',
            'slug' => '15-game-terbaik-yang-wajib-kamu-mainkan-di-2026',
            'banner_file_url' => 'https://example.com/blogs/banner-103.jpg',
            'content' => '<h2>15 Game Terbaik 2026</h2><p>Berikut daftar game pilihan yang wajib kamu coba.</p>',
            'blog_category_id' => $this->defaultCategory->id,
            'status' => 'draft',
            'published_at' => null,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/blogs/{$blog->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'title',
                    'slug',
                    'banner_file_url',
                    'content',
                    'status',
                    'published_at',
                    'categories' => [
                        'id',
                        'name',
                        'slug',
                    ],
                    'author' => [
                        'id',
                        'name',
                    ],
                ],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Blog preview retrieved successfully')
            ->assertJsonPath('data.id', $blog->id)
            ->assertJsonPath('data.title', $blog->title)
            ->assertJsonPath('data.author.name', 'Gamerygo Admin');
    }

    public function test_admin_can_update_blog(): void
    {
        $blog = Blog::create([
            'title' => 'Initial Title',
            'slug' => 'initial-title',
            'banner_file_url' => 'https://example.com/banner.jpg',
            'content' => '<p>Initial content</p>',
            'blog_category_id' => $this->defaultCategory->id,
            'status' => 'draft',
        ]);

        $payload = [
            'title' => 'Updated Blog Title',
            'content' => '<p>Updated content</p>',
            'status' => 'draft',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/v1/admin/blogs/{$blog->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'title',
                    'slug',
                    'banner_file_url',
                    'status',
                    'updated_at',
                ],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Blog updated successfully')
            ->assertJsonPath('data.title', 'Updated Blog Title');

        $this->assertDatabaseHas('blogs', [
            'id' => $blog->id,
            'title' => 'Updated Blog Title',
        ]);
    }

    public function test_admin_can_bulk_delete_blogs(): void
    {
        $b1 = Blog::create(['title' => 'Blog 1', 'slug' => 'blog-1', 'content' => 'c1']);
        $b2 = Blog::create(['title' => 'Blog 2', 'slug' => 'blog-2', 'content' => 'c2']);
        $b3 = Blog::create(['title' => 'Blog 3', 'slug' => 'blog-3', 'content' => 'c3']);

        $payload = [
            'ids' => [$b1->id, $b2->id, $b3->id],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson('/api/v1/admin/blogs', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Blogs deleted successfully.')
            ->assertJsonPath('data.deleted_count', 3)
            ->assertJsonPath('data.deleted_ids.0', $b1->id)
            ->assertJsonPath('data.deleted_ids.1', $b2->id)
            ->assertJsonPath('data.deleted_ids.2', $b3->id);

        $this->assertDatabaseMissing('blogs', ['id' => $b1->id]);
        $this->assertDatabaseMissing('blogs', ['id' => $b2->id]);
        $this->assertDatabaseMissing('blogs', ['id' => $b3->id]);
    }

    public function test_admin_can_bulk_publish_blogs(): void
    {
        $b1 = Blog::create(['title' => 'Blog 1', 'slug' => 'blog-1', 'content' => 'c1', 'status' => 'draft']);
        $b2 = Blog::create(['title' => 'Blog 2', 'slug' => 'blog-2', 'content' => 'c2', 'status' => 'draft']);

        $payload = [
            'ids' => [$b1->id, $b2->id],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/blogs/publish', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Blogs published successfully.')
            ->assertJsonPath('data.published_count', 2)
            ->assertJsonPath('data.published_ids.0', $b1->id)
            ->assertJsonPath('data.published_ids.1', $b2->id);

        $this->assertEquals('published', $b1->fresh()->status);
        $this->assertEquals('published', $b2->fresh()->status);
        $this->assertNotNull($b1->fresh()->published_at);
    }

    public function test_admin_can_filter_blogs_by_status_and_search(): void
    {
        Blog::create([
            'title' => 'Rekomendasi Game Open World Terbaik 2026',
            'slug' => 'rekomendasi-game-open-world-terbaik-2026',
            'content' => '<p>Open world games</p>',
            'status' => 'published',
        ]);

        Blog::create([
            'title' => 'Panduan Game Balap',
            'slug' => 'panduan-game-balap',
            'content' => '<p>Racing games</p>',
            'status' => 'draft',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/blogs?search=Open+World&status=published');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data.blogs')
            ->assertJsonPath('data.blogs.0.title', 'Rekomendasi Game Open World Terbaik 2026');
    }
}
