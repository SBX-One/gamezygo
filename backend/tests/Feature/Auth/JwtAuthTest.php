<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JwtAuthTest extends TestCase
{
  use RefreshDatabase;

  public function test_user_can_register_successfully(): void
  {
    $payload = [
      'name'                  => 'John Doe',
      'email'                 => 'johndoe@example.com',
      'password'              => 'password123',
      'password_confirmation' => 'password123',
      'phone'                 => '081234567890',
    ];

    $response = $this->postJson('/api/v1/auth/register', $payload);

    $response->assertStatus(201)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'token',
          'token_type',
          'expires_in',
          'user' => [
            'id',
            'name',
            'email',
            'phone',
            'status',
          ],
        ],
      ]);

    $this->assertDatabaseHas('users', [
      'email'  => 'johndoe@example.com',
      'name'   => 'John Doe',
      'status' => 'active',
    ]);
  }

  public function test_registration_validation_fails_with_invalid_data(): void
  {
    $response = $this->postJson('/api/v1/auth/register', [
      'name'     => '',
      'email'    => 'not-an-email',
      'password' => 'short',
    ]);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
        'message' => 'Validation error',
      ])
      ->assertJsonStructure([
        'errors' => [
          'name',
          'email',
          'password',
        ],
      ]);
  }

  public function test_user_can_login_with_valid_credentials(): void
  {
    User::create([
      'name'     => 'Jane Doe',
      'email'    => 'janedoe@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
      'email'    => 'janedoe@example.com',
      'password' => 'secret123',
    ]);

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'token',
          'token_type',
          'expires_in',
          'user' => [
            'id',
            'name',
            'email',
          ],
        ],
      ])
      ->assertJsonPath('data.user.email', 'janedoe@example.com');
  }

  public function test_login_fails_with_invalid_credentials(): void
  {
    User::create([
      'name'     => 'Jane Doe',
      'email'    => 'janedoe@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
      'email'    => 'janedoe@example.com',
      'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401)
      ->assertJson([
        'success' => false,
        'message' => 'Invalid email or password.',
      ]);
  }

  public function test_login_fails_when_user_is_not_active(): void
  {
    User::create([
      'name'     => 'Banned User',
      'email'    => 'banned@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'banned',
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
      'email'    => 'banned@example.com',
      'password' => 'secret123',
    ]);

    $response->assertStatus(401)
      ->assertJson([
        'success' => false,
      ]);
  }

  public function test_me_endpoint_is_removed(): void
  {
    $user = User::create([
      'name'     => 'Arya Active',
      'email'    => 'arya.active@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/auth/me');

    $response->assertStatus(404);
  }

  public function test_authenticated_user_can_refresh_token(): void
  {
    $user = User::create([
      'name'     => 'Refresh Tester',
      'email'    => 'refresh@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/auth/refresh');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'token',
          'token_type',
          'expires_in',
          'user',
        ],
      ]);

    $newToken = $response->json('data.token');
    $this->assertNotEmpty($newToken);
    $this->assertNotEquals($token, $newToken);
  }

  public function test_authenticated_user_can_logout(): void
  {
    $user = User::create([
      'name'     => 'Logout Tester',
      'email'    => 'logout@example.com',
      'password' => bcrypt('secret123'),
      'status'   => 'active',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/auth/logout');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Successfully logged out',
      ]);
  }
}
