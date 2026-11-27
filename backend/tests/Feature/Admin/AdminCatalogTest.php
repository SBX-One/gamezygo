<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\CustomSection;
use App\Models\GenreCategory;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminCatalogTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;

    protected string $adminToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = Admin::create([
            'name' => 'Catalog Admin',
            'email' => 'admin@gamezygo.com',
            'password' => Hash::make('secretadmin123'),
        ]);

        $this->adminToken = auth('admin')->tokenById($this->admin->id);
    }

    public function test_unauthenticated_request_to_catalog_returns_401(): void
    {
        $this->getJson('/api/v1/admin/catalog')->assertStatus(401);
        $this->postJson('/api/v1/admin/catalog', [])->assertStatus(401);
        $this->deleteJson('/api/v1/admin/catalog', [])->assertStatus(401);
    }

    public function test_regular_user_token_is_rejected_from_catalog(): void
    {
        $user = User::create([
            'name' => 'Customer Test',
            'email' => 'user@test.com',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);

        $userToken = auth('api')->tokenById($user->id);

        $response = $this->withHeader('Authorization', "Bearer {$userToken}")
            ->getJson('/api/v1/admin/catalog');

        $this->assertTrue(in_array($response->status(), [401, 403]));
    }

    public function test_admin_can_retrieve_catalog_index_with_filters_and_pagination(): void
    {
        $catAction = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
        $catAdventure = GenreCategory::create(['name' => 'Adventure', 'slug' => 'adventure']);

        $launcher = ProductLauncherCategory::create(['name' => 'Steam', 'slug' => 'steam']);
        $instruction = ProductInstruction::create(['title' => 'Steam Guide', 'content' => 'Guide content']);

        $prod1 = Product::create([
            'name' => 'Grand Theft Auto V',
            'slug' => 'grand-theft-auto-v',
            'description' => 'GTA V action game',
            'price' => 650000,
            'discount_price' => 480000,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'steam_url' => 'https://store.steampowered.com/app/271590/',
            'status' => 'listing',
        ]);
        $prod1->genreCategories()->attach([$catAction->id, $catAdventure->id]);

        $prod2 = Product::create([
            'name' => 'Red Dead Redemption 2',
            'slug' => 'red-dead-redemption-2',
            'description' => 'RDR2 adventure game',
            'price' => 640000,
            'discount_price' => 0,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'steam_url' => 'https://store.steampowered.com/app/1174180/',
            'status' => 'listing',
        ]);
        $prod2->genreCategories()->attach([$catAction->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/catalog?category_ids[]='.$catAction->id.'&min_price=100000&max_price=500000&sort_by=latest&page=1&per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'total_products',
                    'products' => [
                        '*' => [
                            'id',
                            'name',
                            'slug',
                            'image_url',
                            'categories',
                            'price',
                            'status',
                            'created_at',
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
            ->assertJsonPath('message', 'Products retrieved successfully')
            ->assertJsonPath('data.total_products', 2)
            ->assertJsonPath('data.products.0.name', 'Grand Theft Auto V')
            ->assertJsonPath('data.products.0.price', 480000);
    }

    public function test_admin_can_search_products_by_keyword_in_catalog_index(): void
    {
        $launcher = ProductLauncherCategory::create(['name' => 'Steam', 'slug' => 'steam']);
        $instruction = ProductInstruction::create(['title' => 'Steam Guide', 'content' => 'Guide content']);

        Product::create([
            'name' => 'Grand Theft Auto V',
            'slug' => 'grand-theft-auto-v',
            'description' => 'Action open world crime game',
            'price' => 650000,
            'discount_price' => 480000,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'steam_url' => 'https://store.steampowered.com/app/271590/',
            'status' => 'listing',
        ]);

        Product::create([
            'name' => 'Cyberpunk 2077',
            'slug' => 'cyberpunk-2077',
            'description' => 'Night city sci-fi RPG',
            'price' => 700000,
            'discount_price' => 450000,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'steam_url' => 'https://store.steampowered.com/app/1091500/',
            'status' => 'listing',
        ]);

        // Search by name partial: 'theft'
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/catalog?search=theft');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $products = $response->json('data.products');
        $this->assertCount(1, $products);
        $this->assertEquals('Grand Theft Auto V', $products[0]['name']);

        // Search by description keyword: 'sci-fi'
        $responseDesc = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/catalog?search=sci-fi');

        $responseDesc->assertStatus(200);
        $productsDesc = $responseDesc->json('data.products');
        $this->assertCount(1, $productsDesc);
        $this->assertEquals('Cyberpunk 2077', $productsDesc[0]['name']);
    }

    public function test_catalog_store_publication_rule_fails_if_nullable_data_is_incomplete(): void
    {
        $cat = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
        $launcher = ProductLauncherCategory::create(['name' => 'Steam', 'slug' => 'steam']);

        // Attempting to publish without game account, specifications, instruction template, or thumbnail
        $payload = [
            'name' => 'Grand Theft Auto V',
            'price' => 480000,
            'original_price' => 650000,
            'status' => 'published',
            'category_ids' => [$cat->id],
            'launcher_ids' => [$launcher->id],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/catalog', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['game_account', 'specifications.minimum', 'specifications.recommended', 'instruction_template_id', 'thumbnail']);
    }

    public function test_catalog_store_allows_incomplete_data_when_saved_as_draft(): void
    {
        $cat = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
        $launcher = ProductLauncherCategory::create(['name' => 'Steam', 'slug' => 'steam']);

        $payload = [
            'name' => 'Draft Game Title',
            'price' => 300000,
            'original_price' => 400000,
            'status' => 'draft',
            'category_ids' => [$cat->id],
            'launcher_ids' => [$launcher->id],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/catalog', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Draft Game Title')
            ->assertJsonPath('data.status', 'draft');
    }

    public function test_catalog_store_succeeds_when_published_with_all_nullable_data_complete(): void
    {
        Storage::fake('public');

        $cat1 = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
        $cat2 = GenreCategory::create(['name' => 'Adventure', 'slug' => 'adventure']);
        $launcher1 = ProductLauncherCategory::create(['name' => 'Steam', 'slug' => 'steam']);
        $instruction = ProductInstruction::create(['title' => 'Steam Offline Activation', 'content' => 'Step by step guide']);
        $section = CustomSection::create(['title' => 'Trending Section', 'slug' => 'trending-section', 'is_active' => true]);

        $file = UploadedFile::fake()->image('gta-v.jpg');

        $payload = [
            'name' => 'Grand Theft Auto V',
            'price' => 480000,
            'original_price' => 650000,
            'status' => 'published',
            'category_ids' => [$cat1->id, $cat2->id],
            'launcher_ids' => [$launcher1->id],
            'promotion_section_id' => $section->id,
            'steam_url' => 'https://store.steampowered.com/app/271590/',
            'thumbnail' => $file,
            'game_account' => [
                'username' => 'steam_user_1',
                'password' => 'secret_steam_pass',
            ],
            'specifications' => [
                'minimum' => [
                    ['type' => 'OS Version', 'value' => 'Windows 10 (64-bit)'],
                    ['type' => 'Processor', 'value' => 'Intel Core i7-4770 / AMD Ryzen 5 1600'],
                ],
                'recommended' => [
                    ['type' => 'Memory', 'value' => '16 GB RAM'],
                ],
            ],
            'instruction_template_id' => $instruction->id,
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->post('/api/v1/admin/catalog', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Product created successfully')
            ->assertJsonPath('data.name', 'Grand Theft Auto V')
            ->assertJsonPath('data.price', 480000)
            ->assertJsonPath('data.original_price', 650000)
            ->assertJsonPath('data.status', 'published')
            ->assertJsonPath('data.promotion_section_id', $section->id)
            ->assertJsonPath('data.instruction_template.name', 'Steam Offline Activation')
            ->assertJsonPath('data.specifications.minimum.0.type', 'OS Version')
            ->assertJsonPath('data.specifications.recommended.0.value', '16 GB RAM');

        $this->assertDatabaseHas('product_game_accounts', [
            'username' => 'steam_user_1',
        ]);
    }

    public function test_catalog_show_returns_product_details(): void
    {
        $cat = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
        $launcher = ProductLauncherCategory::create(['name' => 'Steam', 'slug' => 'steam']);
        $instruction = ProductInstruction::create(['title' => 'Steam Offline Activation', 'content' => 'Guide']);

        $product = Product::create([
            'name' => 'Grand Theft Auto V',
            'slug' => 'grand-theft-auto-v',
            'description' => 'Open world game',
            'price' => 650000,
            'discount_price' => 480000,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'steam_url' => 'https://store.steampowered.com/app/271590/',
            'status' => 'published',
        ]);
        $product->genreCategories()->attach([$cat->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson("/api/v1/admin/catalog/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Product retrieved successfully')
            ->assertJsonPath('data.id', $product->id)
            ->assertJsonPath('data.name', 'Grand Theft Auto V')
            ->assertJsonPath('data.price', 480000)
            ->assertJsonPath('data.original_price', 650000)
            ->assertJsonPath('data.status', 'published')
            ->assertJsonPath('data.categories.0.name', 'Action');
    }

    public function test_catalog_update_modifies_product_data(): void
    {
        $cat = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
        $catNew = GenreCategory::create(['name' => 'Adventure', 'slug' => 'adventure']);
        $launcher = ProductLauncherCategory::create(['name' => 'Steam', 'slug' => 'steam']);
        $instruction = ProductInstruction::create(['title' => 'Guide', 'content' => 'Content']);

        $product = Product::create([
            'name' => 'Old Title',
            'slug' => 'old-title',
            'description' => 'Old Description',
            'price' => 500000,
            'discount_price' => 400000,
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'steam_url' => 'https://steam.com',
            'status' => 'listing',
        ]);
        $product->genreCategories()->attach([$cat->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/v1/admin/catalog/{$product->id}", [
                'name' => 'Updated Title',
                'price' => 350000,
                'category_ids' => [$catNew->id],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Updated Title')
            ->assertJsonPath('data.price', 350000)
            ->assertJsonPath('data.categories.0.name', 'Adventure');
    }

    public function test_catalog_bulk_delete_deletes_specified_products(): void
    {
        $p1 = Product::factory()->create();
        $p2 = Product::factory()->create();
        $p3 = Product::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson('/api/v1/admin/catalog', [
                'ids' => [$p1->id, $p2->id, $p3->id],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Catalogs deleted successfully.')
            ->assertJsonPath('data.deleted_count', 3)
            ->assertJsonPath('data.deleted_ids', [$p1->id, $p2->id, $p3->id]);

        $this->assertSoftDeleted('products', ['id' => $p1->id]);
        $this->assertSoftDeleted('products', ['id' => $p2->id]);
        $this->assertSoftDeleted('products', ['id' => $p3->id]);
    }

    public function test_catalog_archive_status_toggles_archive(): void
    {
        $product = Product::factory()->create([
            'name' => 'Grand Theft Auto V',
            'status' => 'published',
        ]);

        // 1. Archive the product
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson("/api/v1/admin/catalog/archive/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Product archived successfully')
            ->assertJsonPath('data.id', $product->id)
            ->assertJsonPath('data.is_archived', true);

        $this->assertNotEmpty($response->json('data.archived_at'));

        // 2. Un-archive the product
        $response2 = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson("/api/v1/admin/catalog/archive/{$product->id}");

        $response2->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_archived', false)
            ->assertJsonPath('data.archived_at', null);
    }

    public function test_catalog_archive_index_returns_archived_products(): void
    {
        $p1 = Product::factory()->create([
            'name' => 'Archived Game',
            'status' => 'archive',
            'archived_at' => now(),
        ]);

        $p2 = Product::factory()->create([
            'name' => 'Active Game',
            'status' => 'published',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/catalog/archive');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Products retrieved successfully');

        $names = collect($response->json('data.products'))->pluck('name')->toArray();
        $this->assertContains('Archived Game', $names);
        $this->assertNotContains('Active Game', $names);
    }

    public function test_admin_can_fetch_steam_game_data_via_endpoint(): void
    {
        $actionCat = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
        $steamLauncher = ProductLauncherCategory::create(['name' => 'Steam', 'slug' => 'steam']);

        Http::fake([
            'store.steampowered.com/api/appdetails*' => Http::response([
                '271590' => [
                    'success' => true,
                    'data' => [
                        'name' => 'Grand Theft Auto V',
                        'steam_appid' => 271590,
                        'short_description' => 'Los Santos is a city of bright lights.',
                        'detailed_description' => '<p>When a young street hustler...</p>',
                        'header_image' => 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
                        'price_overview' => [
                            'currency' => 'IDR',
                            'initial' => 40100000,
                            'final' => 40100000,
                        ],
                        'genres' => [
                            ['id' => '1', 'description' => 'Action'],
                        ],
                        'pc_requirements' => [
                            'minimum' => '<strong>OS:</strong> Windows 10 64 Bit<br><strong>Processor:</strong> Intel Core 2 Quad CPU Q6600<br><strong>Memory:</strong> 4 GB RAM',
                            'recommended' => '<strong>OS:</strong> Windows 10 64 Bit<br><strong>Processor:</strong> Intel Core i5 3470<br><strong>Memory:</strong> 8 GB RAM',
                        ],
                        'release_date' => [
                            'coming_soon' => false,
                        ],
                    ],
                ],
            ], 200),
        ]);

        // Test POST
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/catalog/steam-data', [
                'steam_url' => 'https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Steam game data retrieved successfully')
            ->assertJsonPath('data.name', 'Grand Theft Auto V')
            ->assertJsonPath('data.steam_app_id', 271590)
            ->assertJsonPath('data.price', 401000)
            ->assertJsonPath('data.categories.0.name', 'Action')
            ->assertJsonPath('data.launchers.0.name', 'Steam')
            ->assertJsonPath('data.specifications.minimum.0.type', 'OS')
            ->assertJsonPath('data.specifications.minimum.0.value', 'Windows 10 64 Bit');

        // Test GET with query param
        $responseGet = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/catalog/steam-data?url=https://store.steampowered.com/app/271590/');

        $responseGet->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Grand Theft Auto V');
    }

    public function test_fetch_steam_data_fails_for_invalid_url(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/catalog/steam-data', [
                'steam_url' => 'https://invalid-url.com/something',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_catalog_store_autofills_from_steam_url(): void
    {
        $cat = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
        $launcher = ProductLauncherCategory::create(['name' => 'Steam', 'slug' => 'steam']);
        $instruction = ProductInstruction::create(['title' => 'Steam Offline', 'content' => 'Guide']);

        Http::fake([
            'store.steampowered.com/api/appdetails*' => Http::response([
                '271590' => [
                    'success' => true,
                    'data' => [
                        'name' => 'Auto-Fetched GTA V',
                        'steam_appid' => 271590,
                        'short_description' => 'Auto fetched description',
                        'header_image' => 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
                        'price_overview' => [
                            'currency' => 'IDR',
                            'initial' => 40100000,
                            'final' => 40100000,
                        ],
                        'genres' => [
                            ['id' => '1', 'description' => 'Action'],
                        ],
                        'pc_requirements' => [
                            'minimum' => '<strong>OS:</strong> Windows 10 64 Bit<br><strong>Memory:</strong> 8 GB RAM',
                            'recommended' => '<strong>OS:</strong> Windows 10 64 Bit<br><strong>Memory:</strong> 16 GB RAM',
                        ],
                    ],
                ],
            ], 200),
        ]);

        $payload = [
            'steam_url' => 'https://store.steampowered.com/app/271590/',
            'status' => 'published',
            'instruction_template_id' => $instruction->id,
            'game_account' => [
                'username' => 'steam_acc_user',
                'password' => 'steam_acc_pass',
            ],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/catalog', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Auto-Fetched GTA V')
            ->assertJsonPath('data.price', 401000)
            ->assertJsonPath('data.status', 'published')
            ->assertJsonPath('data.categories.0.name', 'Action')
            ->assertJsonPath('data.launchers.0.name', 'Steam')
            ->assertJsonPath('data.specifications.minimum.0.type', 'OS')
            ->assertJsonPath('data.specifications.minimum.0.value', 'Windows 10 64 Bit');

        $this->assertDatabaseHas('products', [
            'name' => 'Auto-Fetched GTA V',
            'steam_url' => 'https://store.steampowered.com/app/271590/',
        ]);
    }

    public function test_catalog_store_succeeds_when_only_steam_url_is_provided_with_default_draft_status(): void
    {
        $cat = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
        $launcher = ProductLauncherCategory::create(['name' => 'Steam', 'slug' => 'steam']);

        Http::fake([
            'store.steampowered.com/api/appdetails*' => Http::response([
                '271590' => [
                    'success' => true,
                    'data' => [
                        'name' => 'Grand Theft Auto V',
                        'steam_appid' => 271590,
                        'short_description' => 'GTA V description',
                        'header_image' => 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
                        'price_overview' => [
                            'currency' => 'IDR',
                            'initial' => 40100000,
                            'final' => 40100000,
                        ],
                        'genres' => [
                            ['id' => '1', 'description' => 'Action'],
                        ],
                    ],
                ],
            ], 200),
        ]);

        // Only steam_url passed, with potential empty strings for category_ids and launcher_ids
        $payload = [
            'steam_url' => 'https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/',
            'category_ids' => [''],
            'launcher_ids' => [''],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/catalog', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Grand Theft Auto V')
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.price', 401000);

        $this->assertDatabaseHas('products', [
            'name' => 'Grand Theft Auto V',
            'status' => 'draft',
        ]);
    }

    public function test_pre_order_game_creation_does_not_save_credentials_to_db(): void
    {
        $payload = [
            'name' => 'Upcoming Blockbuster 2027',
            'price' => 750000,
            'status' => 'pre-order',
            'steam_url' => 'https://store.steampowered.com/app/123456/',
            'game_account' => [
                'username' => 'premature_user',
                'password' => 'premature_pass',
            ],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/catalog', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.status', 'pre-order');

        $productId = $response->json('data.id');

        // Product must be saved as pre-order
        $this->assertDatabaseHas('products', [
            'id' => $productId,
            'status' => 'pre-order',
        ]);

        // Credentials MUST NOT be saved into product_game_accounts (FR-25 / BUG-016)
        $this->assertDatabaseMissing('product_game_accounts', [
            'product_id' => $productId,
        ]);
    }

    public function test_pre_order_game_edit_does_not_prematurely_switch_status_to_listing_without_credentials(): void
    {
        $product = Product::factory()->create([
            'name' => 'Cyber Shadow 2077',
            'status' => 'pre-order',
        ]);

        // Attempting to update product with status listing without game credentials
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/v1/admin/catalog/{$product->id}", [
                'name' => 'Cyber Shadow 2077 Updated',
                'price' => 600000,
                'status' => 'listing',
            ]);

        // Should be rejected by validation requiring credentials to transition to listed
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['game_account']);

        // Database status must remain pre-order
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'status' => 'pre-order',
        ]);
    }
}
