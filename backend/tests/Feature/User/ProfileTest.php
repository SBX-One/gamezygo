<?php

namespace Tests\Feature\User;

use App\Models\GenreCategory;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
  use RefreshDatabase;

  public function test_unauthenticated_user_cannot_access_profile(): void
  {
    $response = $this->getJson('/api/v1/user/profile');

    $response->assertStatus(401);
  }

  public function test_authenticated_user_can_view_profile_with_all_required_data(): void
  {
    $user = User::create([
      'name'              => 'Arya Gamer',
      'email'             => 'arya.gamer@example.com',
      'phone'             => '081234567890',
      'password'          => bcrypt('secret123'),
      'status'            => 'active',
      'total_points'      => 950,
      'total_transaction' => 3,
    ]);

    // Create another user with higher points to test ranking calculation
    User::create([
      'name'              => 'Top Gamer',
      'email'             => 'top.gamer@example.com',
      'password'          => bcrypt('secret123'),
      'status'            => 'active',
      'total_points'      => 1500,
      'total_transaction' => 5,
    ]);

    // Create game products and assign to user's owned games
    $products = Product::factory()->count(2)->create();
    $user->ownedGames()->attach($products->pluck('id'));

    // Create 4 orders to verify only 3 recent transactions are returned
    for ($i = 1; $i <= 4; $i++) {
      Order::create([
        'user_id'         => $user->id,
        'order_code'      => "ORD-2026-00{$i}",
        'subtotal_price'  => 500000,
        'discount_amount' => 50000,
        'total_price'     => 450000,
        'status'          => 'paid',
        'expired_at'      => now()->addHour(),
        'paid_at'         => now(),
        'created_at'      => now()->subDays(5 - $i),
      ]);
    }

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/profile');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'id',
          'name',
          'email',
          'phone',
          'avatar_url',
          'status',
          'joined_at',
          'total_transaction',
          'total_points',
          'total_games_owned',
          'rankings' => [
            'weekly',
            'monthly',
            'all_time',
          ],
          'recent_transactions' => [
            '*' => [
              'id',
              'order_code',
              'subtotal_price',
              'discount_amount',
              'total_price',
              'status',
              'paid_at',
              'created_at',
              'total_items',
            ],
          ],
        ],
      ]);

    $data = $response->json('data');

    $this->assertEquals('arya.gamer@example.com', $data['email']);
    $this->assertEquals('081234567890', $data['phone']);
    $this->assertEquals(950, $data['total_points']);
    $this->assertEquals(3, $data['total_transaction']);
    $this->assertEquals(2, $data['total_games_owned']);
    $this->assertEquals(2, $data['rankings']['all_time']); // Ranked 2nd after top gamer
    $this->assertCount(3, $data['recent_transactions']); // Strictly 3 recent transactions
    $this->assertEquals('ORD-2026-004', $data['recent_transactions'][0]['order_code']); // Most recent first
  }

  public function test_authenticated_user_can_update_profile_info(): void
  {
    $user = User::create([
      'name'         => 'Original Name',
      'email'        => 'user@example.com',
      'phone'        => '0811111111',
      'password'     => bcrypt('secret123'),
      'status'       => 'active',
      'total_points' => 100,
    ]);

    $token = auth('api')->login($user);

    $payload = [
      'name'       => 'Updated Name',
      'phone'      => '0899999999',
      'avatar_url' => 'https://example.com/new-avatar.jpg',
    ];

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->putJson('/api/v1/user/profile', $payload);

    $response->assertStatus(200)
      ->assertJsonPath('data.name', 'Updated Name')
      ->assertJsonPath('data.phone', '0899999999')
      ->assertJsonPath('data.avatar_url', 'https://example.com/new-avatar.jpg');

    $this->assertDatabaseHas('users', [
      'id'         => $user->id,
      'name'       => 'Updated Name',
      'phone'      => '0899999999',
      'avatar_url' => 'https://example.com/new-avatar.jpg',
    ]);
  }

  public function test_authenticated_user_can_upload_avatar_image(): void
  {
    Storage::fake('public');

    $user = User::create([
      'name'     => 'Avatar Tester',
      'email'    => 'avatar@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $file = UploadedFile::fake()->create('custom-avatar.jpg', 100, 'image/jpeg');

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/user/profile', [
        'name'   => 'Avatar Tester Updated',
        'avatar' => $file,
      ]);

    $response->assertStatus(200)
      ->assertJsonPath('data.name', 'Avatar Tester Updated');

    $this->assertNotNull($response->json('data.avatar_url'));
    $this->assertStringContainsString('avatars/', $response->json('data.avatar_url'));
  }

  public function test_profile_update_validation_fails_with_invalid_data(): void
  {
    $user = User::create([
      'name'     => 'Valid User',
      'email'    => 'valid@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->putJson('/api/v1/user/profile', [
        'name'  => '',
        'phone' => str_repeat('0', 30), // Exceeds 20 characters
      ]);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
        'message' => 'Validation error',
      ])
      ->assertJsonStructure([
        'errors' => [
          'name',
          'phone',
        ],
      ]);
  }

  public function test_authenticated_user_can_change_password_successfully(): void
  {
    $user = User::create([
      'name'     => 'Password Changer',
      'email'    => 'changer@example.com',
      'password' => bcrypt('oldpassword123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $payload = [
      'current_password'          => 'oldpassword123',
      'new_password'              => 'newpassword123',
      'new_password_confirmation' => 'newpassword123',
    ];

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->putJson('/api/v1/user/profile/change-password', $payload);

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Password berhasil diperbarui',
      ]);

    $this->assertTrue(\Illuminate\Support\Facades\Hash::check('newpassword123', $user->fresh()->password));
  }

  public function test_change_password_fails_if_old_password_is_incorrect(): void
  {
    $user = User::create([
      'name'     => 'Password Changer',
      'email'    => 'changer2@example.com',
      'password' => bcrypt('oldpassword123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $payload = [
      'current_password'          => 'wrongoldpassword',
      'new_password'              => 'newpassword123',
      'new_password_confirmation' => 'newpassword123',
    ];

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->putJson('/api/v1/user/profile/change-password', $payload);

    $response->assertStatus(400)
      ->assertJson([
        'success' => false,
        'message' => 'Password lama yang Anda masukkan tidak sesuai.',
      ]);
  }

  public function test_change_password_validation_fails_if_confirmation_does_not_match(): void
  {
    $user = User::create([
      'name'     => 'Password Changer',
      'email'    => 'changer3@example.com',
      'password' => bcrypt('oldpassword123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $payload = [
      'current_password'          => 'oldpassword123',
      'new_password'              => 'newpassword123',
      'new_password_confirmation' => 'differentpassword123',
    ];

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->putJson('/api/v1/user/profile/change-password', $payload);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
        'message' => 'Validation error',
      ])
      ->assertJsonValidationErrors(['new_password']);
  }

  public function test_change_password_validation_fails_if_new_password_is_same_as_old(): void
  {
    $user = User::create([
      'name'     => 'Password Changer',
      'email'    => 'changer4@example.com',
      'password' => bcrypt('oldpassword123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $payload = [
      'current_password'          => 'oldpassword123',
      'new_password'              => 'oldpassword123',
      'new_password_confirmation' => 'oldpassword123',
    ];

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->putJson('/api/v1/user/profile/change-password', $payload);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
        'message' => 'Validation error',
      ])
      ->assertJsonValidationErrors(['new_password']);
  }

  public function test_unauthenticated_user_cannot_access_profile_products(): void
  {
    $response = $this->getJson('/api/v1/user/profile/products');

    $response->assertStatus(401);
  }

  public function test_authenticated_user_can_view_owned_products_with_pagination_and_meta(): void
  {
    $user = User::create([
      'name'     => 'Game Owner',
      'email'    => 'owner@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $actionCategory = GenreCategory::create([
      'name' => 'Action',
      'slug' => 'action',
    ]);
    $adventureCategory = GenreCategory::create([
      'name' => 'Adventure',
      'slug' => 'adventure',
    ]);

    $product1 = Product::factory()->create([
      'name'           => "Assassin's Creed Black Flag Resynced",
      'slug'           => 'assassins-creed-black-flag-resynced',
      'price'          => 439000,
      'discount_price' => 307300,
    ]);
    $product1->genreCategories()->attach([$actionCategory->id, $adventureCategory->id]);

    $product2 = Product::factory()->create([
      'name'           => 'Tomb Raider',
      'slug'           => 'tomb-raider',
      'price'          => 349000,
      'discount_price' => 209400,
    ]);
    $product2->genreCategories()->attach([$adventureCategory->id]);

    $user->ownedGames()->attach([$product1->id, $product2->id]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/profile/products');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Products retrieved successfully',
      ])
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          '*' => [
            'id',
            'name',
            'slug',
            'thumbnail',
            'price',
            'discount_price',
            'discount',
            'categories' => [
              '*' => [
                'id',
                'name',
                'slug',
              ],
            ],
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
      ]);

    $this->assertCount(2, $response->json('data'));
    $this->assertEquals(2, $response->json('meta.total'));
    $this->assertEquals(1, $response->json('meta.current_page'));
    $this->assertEquals(20, $response->json('meta.per_page'));
  }

  public function test_authenticated_user_can_filter_owned_products_by_search(): void
  {
    $user = User::create([
      'name'     => 'Search Gamer',
      'email'    => 'search@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $game1 = Product::factory()->create([
      'name' => "Assassin's Creed Black Flag Resynced",
      'slug' => 'assassins-creed-black-flag-resynced',
    ]);
    $game2 = Product::factory()->create([
      'name' => 'Grand Theft Auto V',
      'slug' => 'grand-theft-auto-v',
    ]);

    $user->ownedGames()->attach([$game1->id, $game2->id]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/profile/products?search=Assassin');

    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(1, $data);
    $this->assertEquals("Assassin's Creed Black Flag Resynced", $data[0]['name']);
  }

  public function test_authenticated_user_can_filter_owned_products_by_genre_categories(): void
  {
    $user = User::create([
      'name'     => 'Genre Gamer',
      'email'    => 'genre@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $action = GenreCategory::create(['name' => 'Action', 'slug' => 'action']);
    $rpg = GenreCategory::create(['name' => 'RPG', 'slug' => 'rpg']);
    $racing = GenreCategory::create(['name' => 'Racing', 'slug' => 'racing']);

    $gameAction = Product::factory()->create(['name' => 'Action Game']);
    $gameAction->genreCategories()->attach($action->id);

    $gameRpg = Product::factory()->create(['name' => 'RPG Game']);
    $gameRpg->genreCategories()->attach($rpg->id);

    $gameRacing = Product::factory()->create(['name' => 'Racing Game']);
    $gameRacing->genreCategories()->attach($racing->id);

    $user->ownedGames()->attach([$gameAction->id, $gameRpg->id, $gameRacing->id]);

    $token = auth('api')->login($user);

    // Query with genre_categories[0]=action&genre_categories[1]=rpg
    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/profile/products?genre_categories[0]=action&genre_categories[1]=rpg');

    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(2, $data);

    $names = array_column($data, 'name');
    $this->assertContains('Action Game', $names);
    $this->assertContains('RPG Game', $names);
    $this->assertNotContains('Racing Game', $names);
  }

  public function test_profile_products_isolates_user_data(): void
  {
    $userA = User::create([
      'name'     => 'User A',
      'email'    => 'usera@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $userB = User::create([
      'name'     => 'User B',
      'email'    => 'userb@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $gameA = Product::factory()->create(['name' => 'Game A']);
    $gameB = Product::factory()->create(['name' => 'Game B']);

    $userA->ownedGames()->attach($gameA->id);
    $userB->ownedGames()->attach($gameB->id);

    $token = auth('api')->login($userA);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/user/profile/products');

    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(1, $data);
    $this->assertEquals('Game A', $data[0]['name']);
  }
}
