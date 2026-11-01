<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Tests\TestCase;

class GoogleAuthTest extends TestCase
{
  use RefreshDatabase;

  public function test_google_redirect_returns_authorization_url(): void
  {
    $response = $this->getJson('/api/v1/auth/google/redirect');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'url',
        ],
      ]);

    $this->assertStringContainsString('accounts.google.com', $response->json('data.url'));
  }

  public function test_google_login_validation_fails_without_token(): void
  {
    $response = $this->postJson('/api/v1/auth/google-login', []);

    $response->assertStatus(422)
      ->assertJsonValidationErrors(['token', 'id_token', 'access_token']);
  }

  public function test_google_login_fails_with_invalid_token(): void
  {
    Http::fake([
      'https://oauth2.googleapis.com/tokeninfo*' => Http::response(['error' => 'invalid_token'], 400),
      'https://www.googleapis.com/oauth2/v3/userinfo' => Http::response(['error' => 'invalid_token'], 401),
    ]);

    $response = $this->postJson('/api/v1/auth/google-login', [
      'token' => 'invalid-token-123',
    ]);

    $response->assertStatus(401)
      ->assertJson([
        'success' => false,
      ]);
  }

  public function test_google_login_creates_new_user_with_valid_id_token(): void
  {
    Http::fake([
      'https://oauth2.googleapis.com/tokeninfo*' => Http::response([
        'sub'            => 'google-uid-12345',
        'email'          => 'john.doe@example.com',
        'name'           => 'John Doe',
        'picture'        => 'https://example.com/photo.jpg',
        'email_verified' => 'true',
      ], 200),
    ]);

    $response = $this->postJson('/api/v1/auth/google-login', [
      'token' => 'valid-mocked-google-id-token',
    ]);

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'token',
          'token_type',
          'user' => [
            'id',
            'name',
            'email',
            'avatar_url',
            'status',
            'total_points',
          ],
        ],
      ]);

    $this->assertDatabaseHas('users', [
      'email'     => 'john.doe@example.com',
      'google_id' => 'google-uid-12345',
      'name'      => 'John Doe',
      'status'    => 'active',
    ]);
  }

  public function test_google_login_authenticates_existing_user(): void
  {
    $existingUser = User::create([
      'name'       => 'Jane Existing',
      'email'      => 'jane@example.com',
      'google_id'  => 'google-uid-999',
      'status'     => 'active',
      'password'   => bcrypt('secret'),
    ]);

    Http::fake([
      'https://oauth2.googleapis.com/tokeninfo*' => Http::response([
        'sub'   => 'google-uid-999',
        'email' => 'jane@example.com',
        'name'  => 'Jane Existing',
      ], 200),
    ]);

    $response = $this->postJson('/api/v1/auth/google-login', [
      'id_token' => 'mocked-id-token',
    ]);

    $response->assertStatus(200)
      ->assertJsonPath('data.user.id', $existingUser->id)
      ->assertJsonPath('data.user.email', 'jane@example.com');
  }

  public function test_authenticated_user_can_access_me_endpoint(): void
  {
    $user = User::factory()->create([
      'name'   => 'Arya Test',
      'email'  => 'arya@gamezygo.com',
      'status' => 'active',
    ]);

    $token = $user->createToken('test_token')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/auth/me');

    $response->assertStatus(200)
      ->assertJsonPath('data.name', 'Arya Test')
      ->assertJsonPath('data.email', 'arya@gamezygo.com');
  }

  public function test_unauthenticated_request_to_me_returns_401(): void
  {
    $response = $this->getJson('/api/v1/auth/me');

    $response->assertStatus(401);
  }

  public function test_logout_revokes_current_token(): void
  {
    $user = User::factory()->create();
    $token = $user->createToken('test_token')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/auth/logout');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Successfully logged out',
      ]);

    $this->assertCount(0, $user->fresh()->tokens);
  }
}
