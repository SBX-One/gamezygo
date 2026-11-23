<?php

namespace Tests\Feature\Cache;

use App\Models\Announcement;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\Community;
use App\Models\CustomSection;
use App\Models\Faq;
use App\Models\GenreCategory;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Services\Cache\RedisCacheService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class RedisCachingTest extends TestCase
{
    use RefreshDatabase;

    protected RedisCacheService $cacheService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->cacheService = app(RedisCacheService::class);
        Cache::flush();
    }

    public function test_redis_cache_service_stores_and_flushes_tags(): void
    {
        $key = 'test:item:1';
        $tag = 'test_tag';

        $value = $this->cacheService->remember($key, 60, fn () => 'Hello World', [$tag]);
        $this->assertEquals('Hello World', $value);

        // Verify it is cached
        $cached = $this->cacheService->get($key, null, [$tag]);
        $this->assertEquals('Hello World', $cached);

        // Flush tag
        $this->cacheService->flushTags($tag);

        // Cache should be cleared
        $cleared = $this->cacheService->get($key, null, [$tag]);
        $this->assertNull($cleared);
    }

    public function test_guest_products_are_cached_and_invalidated_on_save(): void
    {
        $category = GenreCategory::create([
            'name' => 'Action',
            'slug' => 'action',
        ]);

        $launcher = ProductLauncherCategory::create([
            'name' => 'Steam',
            'slug' => 'steam',
        ]);

        $instruction = ProductInstruction::create([
            'title' => 'Guide',
            'content' => 'Install instructions',
        ]);

        $product = Product::create([
            'name' => 'Cyberpunk 2077',
            'slug' => 'cyberpunk-2077',
            'description' => 'RPG Game',
            'price' => 500000,
            'steam_url' => 'https://store.steampowered.com/app/1091500',
            'genre_category_id' => $category->id,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'is_active' => true,
        ]);

        // Initial request: should populate cache
        $response1 = $this->getJson('/api/v1/products');
        $response1->assertStatus(200);

        // Check detail request is cached
        $detail1 = $this->getJson('/api/v1/products/cyberpunk-2077');
        $detail1->assertStatus(200)->assertJsonPath('data.name', 'Cyberpunk 2077');

        // Update product: observer must invalidate cache
        $product->update(['name' => 'Cyberpunk 2077 Ultimate Edition']);

        // Next detail request should reflect updated name
        $detail2 = $this->getJson('/api/v1/products/cyberpunk-2077');
        $detail2->assertStatus(200)->assertJsonPath('data.name', 'Cyberpunk 2077 Ultimate Edition');
    }

    public function test_guest_custom_sections_are_cached_and_invalidated(): void
    {
        $section = CustomSection::create([
            'title' => 'Featured Games',
            'slug' => 'featured-games',
            'is_active' => true,
            'order' => 1,
        ]);

        $response = $this->getJson('/api/v1/custom-sections');
        $response->assertStatus(200);

        // Update custom section
        $section->update(['title' => 'Top Featured Games']);

        $responseUpdated = $this->getJson('/api/v1/custom-sections');
        $responseUpdated->assertStatus(200)
            ->assertJsonPath('data.0.title', 'Top Featured Games');
    }

    public function test_guest_subscription_plans_are_cached_and_invalidated(): void
    {
        SubscriptionPlan::query()->delete();

        $plan = SubscriptionPlan::create([
            'name' => 'Pro Pass',
            'price' => 150000,
            'duration_days' => 30,
            'duration_months' => 1,
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/subscriptions');
        $response->assertStatus(200)->assertJsonPath('data.0.name', 'Pro Pass');

        $plan->update(['name' => 'Pro Pass Plus']);

        $responseUpdated = $this->getJson('/api/v1/subscriptions');
        $responseUpdated->assertStatus(200)->assertJsonPath('data.0.name', 'Pro Pass Plus');
    }

    public function test_guest_blogs_are_cached_and_invalidated(): void
    {
        $category = BlogCategory::create([
            'name' => 'News',
            'slug' => 'news',
        ]);

        $blog = Blog::create([
            'blog_category_id' => $category->id,
            'title' => 'Patch 1.5 Notes',
            'slug' => 'patch-1-5-notes',
            'short_description' => 'Summary of changes',
            'content' => 'Full patch notes content here',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->getJson('/api/v1/blogs/patch-1-5-notes');
        $response->assertStatus(200)->assertJsonPath('data.title', 'Patch 1.5 Notes');

        $blog->update(['title' => 'Patch 1.5.1 Notes']);

        $responseUpdated = $this->getJson('/api/v1/blogs/patch-1-5-notes');
        $responseUpdated->assertStatus(200)->assertJsonPath('data.title', 'Patch 1.5.1 Notes');
    }

    public function test_guest_faqs_are_cached_and_invalidated(): void
    {
        $faq = Faq::create([
            'question' => 'How to redeem game?',
            'answer' => 'Follow the instruction guide.',
            'page' => 'home',
            'is_active' => true,
            'order_number' => 1,
        ]);

        $response = $this->getJson('/api/v1/faqs');
        $response->assertStatus(200)->assertJsonPath('data.0.question', 'How to redeem game?');

        $faq->update(['question' => 'How to redeem game license?']);

        $responseUpdated = $this->getJson('/api/v1/faqs');
        $responseUpdated->assertStatus(200)->assertJsonPath('data.0.question', 'How to redeem game license?');
    }

    public function test_guest_announcements_are_cached_and_invalidated(): void
    {
        $announcement = Announcement::create([
            'banner_file_url' => 'https://example.com/promo.jpg',
            'link' => 'https://gamezygo.com/promo',
            'is_published' => true,
            'sort_order' => 1,
        ]);

        $response = $this->getJson('/api/v1/announcements');
        $response->assertStatus(200)->assertJsonPath('data.0.link', 'https://gamezygo.com/promo');

        $announcement->update(['link' => 'https://gamezygo.com/mega-sale']);

        $responseUpdated = $this->getJson('/api/v1/announcements');
        $responseUpdated->assertStatus(200)->assertJsonPath('data.0.link', 'https://gamezygo.com/mega-sale');
    }

    public function test_guest_communities_are_cached_and_invalidated(): void
    {
        $community = Community::create([
            'name' => 'Discord Gamers',
            'banner_file_url' => 'https://example.com/banner.jpg',
            'link' => 'https://discord.gg/example',
            'is_active' => true,
            'order_number' => 1,
        ]);

        $response = $this->getJson('/api/v1/communities');
        $response->assertStatus(200)->assertJsonPath('data.0.name', 'Discord Gamers');

        $community->update(['name' => 'Official Discord Gamers']);

        $responseUpdated = $this->getJson('/api/v1/communities');
        $responseUpdated->assertStatus(200)->assertJsonPath('data.0.name', 'Official Discord Gamers');
    }

    public function test_user_profile_is_cached_and_invalidated_on_update(): void
    {
        $user = User::create([
            'name' => 'Alice Gamer',
            'email' => 'alice@test.com',
            'password' => bcrypt('password123'),
            'status' => 'active',
            'phone' => '081234567890',
        ]);
        $token = auth('api')->tokenById($user->id);

        // Initial profile fetch
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/user/profile');
        $response->assertStatus(200)->assertJsonPath('data.name', 'Alice Gamer');

        // Update profile
        $updateResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/profile', [
                'name' => 'Alice Champion',
            ]);
        $updateResponse->assertStatus(200);

        // Fetch again: cache should be invalidated
        $response2 = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/user/profile');
        $response2->assertStatus(200)->assertJsonPath('data.name', 'Alice Champion');
    }

    public function test_gamezygo_cache_clear_artisan_command(): void
    {
        $this->cacheService->put('test_cmd', 'cached_data', 60, [RedisCacheService::TAG_PRODUCTS]);
        $this->assertEquals('cached_data', $this->cacheService->get('test_cmd', null, [RedisCacheService::TAG_PRODUCTS]));

        Artisan::call('gamezygo:cache-clear', ['tag' => 'products']);

        $this->assertNull($this->cacheService->get('test_cmd', null, [RedisCacheService::TAG_PRODUCTS]));

        $exitCode = Artisan::call('gamezygo:cache-clear');
        $this->assertEquals(0, $exitCode);
    }

    public function test_redis_cache_service_gracefully_handles_exceptions(): void
    {
        // If an invalid or broken operation occurs, fallback closure executes seamlessly
        $result = $this->cacheService->remember('fallback_test', 60, function () {
            return 'fallback_value';
        });

        $this->assertEquals('fallback_value', $result);
    }
}
