<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
  use RefreshDatabase;

  public function test_admin_can_login_with_valid_credentials(): void
  {
    $admin = Admin::create([
      'name'     => 'Super Admin',
      'email'    => 'admin@gamezygo.com',
      'password' => Hash::make('password123'),
    ]);

    $response = $this->postJson('/api/v1/admin/login', [
      'email'    => 'admin@gamezygo.com',
      'password' => 'password123',
    ]);

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'token',
          'token_type',
          'expires_in',
          'admin' => [
            'id',
            'name',
            'email',
          ],
        ],
      ])
      ->assertJsonPath('success', true)
      ->assertJsonPath('data.admin.email', 'admin@gamezygo.com')
      ->assertJsonPath('data.admin.name', 'Super Admin');

    $this->assertNotEmpty($response->json('data.token'));
  }

  public function test_admin_login_fails_with_invalid_credentials(): void
  {
    Admin::create([
      'name'     => 'Admin User',
      'email'    => 'admin@example.com',
      'password' => Hash::make('correctpassword'),
    ]);

    $response = $this->postJson('/api/v1/admin/login', [
      'email'    => 'admin@example.com',
      'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401)
      ->assertJson([
        'success' => false,
        'message' => 'Invalid email or password.',
      ]);
  }

  public function test_admin_login_fails_when_email_not_registered(): void
  {
    $response = $this->postJson('/api/v1/admin/login', [
      'email'    => 'nonexistent@example.com',
      'password' => 'password123',
    ]);

    $response->assertStatus(401)
      ->assertJson([
        'success' => false,
        'message' => 'Invalid email or password.',
      ]);
  }

  public function test_admin_login_validation_fails_with_invalid_data(): void
  {
    $response = $this->postJson('/api/v1/admin/login', [
      'email'    => 'not-an-email',
      'password' => '',
    ]);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
        'message' => 'Validation error',
      ])
      ->assertJsonStructure([
        'errors' => [
          'email',
          'password',
        ],
      ]);
  }

  public function test_regular_user_cannot_login_through_admin_endpoint(): void
  {
    User::create([
      'name'     => 'Regular Customer',
      'email'    => 'customer@example.com',
      'password' => Hash::make('customerpass'),
      'status'   => 'active',
    ]);

    $response = $this->postJson('/api/v1/admin/login', [
      'email'    => 'customer@example.com',
      'password' => 'customerpass',
    ]);

    $response->assertStatus(401)
      ->assertJson([
        'success' => false,
        'message' => 'Invalid email or password.',
      ]);
  }

  public function test_admin_me_endpoint_is_removed(): void
  {
    $admin = Admin::create([
      'name'     => 'Admin Arya',
      'email'    => 'arya.admin@example.com',
      'password' => Hash::make('secret123'),
    ]);

    $token = auth('admin')->login($admin);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->getJson('/api/v1/admin/me');

    $response->assertStatus(404);
  }

  public function test_unauthenticated_request_cannot_access_admin_refresh_endpoint(): void
  {
    $response = $this->postJson('/api/v1/admin/refresh');

    $response->assertStatus(401);
  }

  public function test_regular_user_token_cannot_access_admin_refresh_endpoint(): void
  {
    $user = User::create([
      'name'     => 'Customer Hacker',
      'email'    => 'hacker@example.com',
      'password' => Hash::make('secret123'),
      'status'   => 'active',
    ]);

    $userToken = auth('api')->login($user);

    $response = $this->withHeader('Authorization', "Bearer {$userToken}")
      ->postJson('/api/v1/admin/refresh');

    // Should be rejected because the token belongs to user, not admin
    $this->assertTrue(in_array($response->status(), [401, 403], true));
  }

  public function test_authenticated_admin_can_refresh_token(): void
  {
    $admin = Admin::create([
      'name'     => 'Refresh Admin',
      'email'    => 'refresh.admin@example.com',
      'password' => Hash::make('secret123'),
    ]);

    $token = auth('admin')->login($admin);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/admin/refresh');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'token',
          'token_type',
          'expires_in',
          'admin',
        ],
      ]);

    $newToken = $response->json('data.token');
    $this->assertNotEmpty($newToken);
    $this->assertNotEquals($token, $newToken);
  }

  public function test_authenticated_admin_can_logout(): void
  {
    $admin = Admin::create([
      'name'     => 'Logout Admin',
      'email'    => 'logout.admin@example.com',
      'password' => Hash::make('secret123'),
    ]);

    $token = auth('admin')->login($admin);

    $response = $this->withHeader('Authorization', "Bearer {$token}")
      ->postJson('/api/v1/admin/logout');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
        'message' => 'Admin successfully logged out',
      ]);
  }
}
