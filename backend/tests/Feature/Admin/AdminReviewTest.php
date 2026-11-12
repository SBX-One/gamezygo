<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\GenreCategory;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\Review;
use App\Models\ReviewReply;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminReviewTest extends TestCase
{
  use RefreshDatabase;

  protected Admin $admin;
  protected string $adminToken;
  protected User $user;

  protected function setUp(): void
  {
    parent::setUp();

    $this->admin = Admin::create([
      'name'     => 'Gamezygo Admin',
      'email'    => 'admin@gamezygo.com',
      'password' => Hash::make('secretadmin123'),
    ]);

    $this->adminToken = auth('admin')->tokenById($this->admin->id);

    $this->user = User::create([
      'name'     => 'John Doe',
      'email'    => 'john@example.com',
      'password' => Hash::make('secret123'),
      'status'   => 'active',
    ]);
  }

  public function test_unauthenticated_request_is_rejected(): void
  {
    $response = $this->getJson('/api/v1/admin/reviews');
    $response->assertStatus(401);
  }

  public function test_customer_user_is_forbidden(): void
  {
    $userToken = auth('api')->tokenById($this->user->id);

    $response = $this->withHeader('Authorization', "Bearer {$userToken}")
      ->getJson('/api/v1/admin/reviews');

    $response->assertStatus(401);
  }

  public function test_admin_can_retrieve_reviews_index_with_rating_breakdown(): void
  {
    Review::create([
      'user_id' => $this->user->id,
      'review'  => 'Great game!',
      'rating'  => 5,
      'status'  => 'approved',
    ]);

    Review::create([
      'user_id' => $this->user->id,
      'review'  => 'Good game but has bugs',
      'rating'  => 4,
      'status'  => 'pending',
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/reviews');

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Reviews retrieved successfully')
      ->assertJsonPath('data.total_reviews', 2)
      ->assertJsonPath('data.rating_breakdown.5_star', 1)
      ->assertJsonPath('data.rating_breakdown.4_star', 1)
      ->assertJsonPath('data.rating_breakdown.average_rating', 4.5)
      ->assertJsonCount(2, 'data.reviews');
  }

  public function test_admin_can_filter_reviews_by_star_rating(): void
  {
    Review::create([
      'user_id' => $this->user->id,
      'review'  => 'Amazing!',
      'rating'  => 5,
      'status'  => 'approved',
    ]);

    Review::create([
      'user_id' => $this->user->id,
      'review'  => 'Terrible performance',
      'rating'  => 1,
      'status'  => 'rejected',
    ]);

    // Filter by rating 5
    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/reviews?rating=5');

    $response->assertStatus(200)
      ->assertJsonPath('data.total_reviews', 1)
      ->assertJsonPath('data.reviews.0.rating', 5)
      ->assertJsonPath('data.reviews.0.review', 'Amazing!');
  }

  public function test_admin_can_filter_reviews_by_status(): void
  {
    Review::create([
      'user_id' => $this->user->id,
      'review'  => 'Pending review',
      'rating'  => 3,
      'status'  => 'pending',
    ]);

    Review::create([
      'user_id' => $this->user->id,
      'review'  => 'Approved review',
      'rating'  => 4,
      'status'  => 'approved',
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/reviews?status=pending');

    $response->assertStatus(200)
      ->assertJsonPath('data.total_reviews', 1)
      ->assertJsonPath('data.reviews.0.status', 'pending');
  }

  public function test_admin_can_sort_reviews_by_latest_and_username_a_z(): void
  {
    $userA = User::create([
      'name'     => 'Alice Adams',
      'email'    => 'alice@example.com',
      'password' => Hash::make('secret123'),
      'status'   => 'active',
    ]);

    $userZ = User::create([
      'name'     => 'Zack Snyder',
      'email'    => 'zack@example.com',
      'password' => Hash::make('secret123'),
      'status'   => 'active',
    ]);

    Review::create([
      'user_id'    => $userZ->id,
      'review'     => 'Review from Zack',
      'rating'     => 4,
      'created_at' => now()->subDay(),
    ]);

    Review::create([
      'user_id'    => $userA->id,
      'review'     => 'Review from Alice',
      'rating'     => 5,
      'created_at' => now(),
    ]);

    // Test sort by latest (Alice created more recently)
    $responseLatest = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/reviews?sort_by=latest');

    $responseLatest->assertStatus(200)
      ->assertJsonPath('data.reviews.0.user.name', 'Alice Adams');

    // Test sort by username A-Z (Alice first)
    $responseAlpha = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/reviews?sort_by=username_asc');

    $responseAlpha->assertStatus(200)
      ->assertJsonPath('data.reviews.0.user.name', 'Alice Adams')
      ->assertJsonPath('data.reviews.1.user.name', 'Zack Snyder');
  }

  public function test_admin_can_sort_reviews_by_email_a_z(): void
  {
    $userB = User::create([
      'name'     => 'User B',
      'email'    => 'beta@example.com',
      'password' => Hash::make('secret123'),
      'status'   => 'active',
    ]);

    $userA = User::create([
      'name'     => 'User A',
      'email'    => 'alpha@example.com',
      'password' => Hash::make('secret123'),
      'status'   => 'active',
    ]);

    Review::create([
      'user_id' => $userB->id,
      'review'  => 'Beta review',
      'rating'  => 3,
    ]);

    Review::create([
      'user_id' => $userA->id,
      'review'  => 'Alpha review',
      'rating'  => 4,
    ]);

    $responseEmail = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/v1/admin/reviews?sort_by=email_asc');

    $responseEmail->assertStatus(200)
      ->assertJsonPath('data.reviews.0.user.email', 'alpha@example.com')
      ->assertJsonPath('data.reviews.1.user.email', 'beta@example.com');
  }

  public function test_admin_can_show_single_review(): void
  {
    $review = Review::create([
      'user_id' => $this->user->id,
      'review'  => 'Detailed review text',
      'rating'  => 5,
      'status'  => 'approved',
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson("/api/v1/admin/reviews/{$review->id}");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Review retrieved successfully')
      ->assertJsonPath('data.id', $review->id)
      ->assertJsonPath('data.review', 'Detailed review text')
      ->assertJsonPath('data.user.name', 'John Doe');
  }

  public function test_admin_can_update_review_status(): void
  {
    $review = Review::create([
      'user_id' => $this->user->id,
      'review'  => 'Review to approve',
      'rating'  => 5,
      'status'  => 'pending',
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson("/api/v1/admin/reviews/{$review->id}/status", [
        'status' => 'approved',
      ]);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Review status updated successfully')
      ->assertJsonPath('data.id', $review->id)
      ->assertJsonPath('data.status', 'approved');

    $this->assertEquals('approved', $review->fresh()->status);
  }

  public function test_admin_can_reply_to_review(): void
  {
    $review = Review::create([
      'user_id' => $this->user->id,
      'review'  => 'Review asking for help',
      'rating'  => 4,
      'status'  => 'approved',
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->postJson("/api/v1/admin/reviews/{$review->id}/reply", [
        'message' => 'Halo! Terima kasih atas ulasannya, senang bisa membantu!',
      ]);

    $response->assertStatus(201)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Review reply posted successfully')
      ->assertJsonPath('data.message', 'Halo! Terima kasih atas ulasannya, senang bisa membantu!')
      ->assertJsonPath('data.author_type', 'admin');

    $this->assertDatabaseHas('review_replies', [
      'review_id' => $review->id,
      'admin_id'  => $this->admin->id,
    ]);
  }

  public function test_admin_can_delete_review(): void
  {
    $review = Review::create([
      'user_id' => $this->user->id,
      'review'  => 'Review to delete',
      'rating'  => 1,
      'status'  => 'rejected',
    ]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson("/api/v1/admin/reviews/{$review->id}");

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('message', 'Review deleted successfully');

    $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
  }

  public function test_admin_can_bulk_delete_reviews(): void
  {
    $r1 = Review::create(['user_id' => $this->user->id, 'review' => 'R1', 'rating' => 1]);
    $r2 = Review::create(['user_id' => $this->user->id, 'review' => 'R2', 'rating' => 2]);
    $r3 = Review::create(['user_id' => $this->user->id, 'review' => 'R3', 'rating' => 3]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->deleteJson('/api/v1/admin/reviews', [
        'review_ids' => [$r1->id, $r2->id],
      ]);

    $response->assertStatus(200)
      ->assertJsonPath('success', true)
      ->assertJsonPath('data.deleted_count', 2);

    $this->assertDatabaseMissing('reviews', ['id' => $r1->id]);
    $this->assertDatabaseMissing('reviews', ['id' => $r2->id]);
    $this->assertDatabaseHas('reviews', ['id' => $r3->id]);
  }

  public function test_admin_can_access_legacy_route_without_v1(): void
  {
    Review::create(['user_id' => $this->user->id, 'review' => 'Legacy test', 'rating' => 5]);

    $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
      ->getJson('/api/admin/reviews');

    $response->assertStatus(200)
      ->assertJsonPath('success', true);
  }
}

