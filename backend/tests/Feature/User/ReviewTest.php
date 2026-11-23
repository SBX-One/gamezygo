<?php

namespace Tests\Feature\User;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_approved_reviews(): void
    {
        $product = Product::factory()->create();
        $user = User::factory()->create();

        Review::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'approved',
            'rating' => 5,
            'review' => 'Great game!',
        ]);

        Review::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'pending',
            'rating' => 4,
            'review' => 'Still pending review',
        ]);

        $response = $this->getJson('/api/v1/reviews');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Reviews retrieved successfully',
            ]);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('Great game!', $data[0]['review']);
    }

    public function test_authenticated_user_can_view_own_reviews_via_scope_mine(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $product = Product::factory()->create();

        Review::factory()->create([
            'user_id' => $userA->id,
            'product_id' => $product->id,
            'status' => 'pending',
            'rating' => 5,
            'review' => 'User A Review',
        ]);

        Review::factory()->create([
            'user_id' => $userB->id,
            'product_id' => $product->id,
            'status' => 'pending',
            'rating' => 4,
            'review' => 'User B Review',
        ]);

        $token = auth('api')->login($userA);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/reviews?scope=mine');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Reviews retrieved successfully',
            ]);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('User A Review', $data[0]['review']);
        $this->assertEquals('pending', $data[0]['status']);
    }

    public function test_unauthenticated_user_cannot_view_reviews_with_scope_mine(): void
    {
        $response = $this->getJson('/api/v1/reviews?scope=mine');

        $response->assertStatus(401);
    }

    public function test_user_can_create_review_with_images_and_order_item(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $product = Product::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);
        $orderItem = OrderItem::create([
            'order_id' => $order->id,
            'purchasable_type' => Product::class,
            'purchasable_id' => $product->id,
            'price' => 100000,
        ]);

        $token = auth('api')->login($user);

        $image1 = UploadedFile::fake()->image('review-1.jpg');
        $image2 = UploadedFile::fake()->image('review-2.jpg');

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/reviews', [
                'product_id' => $product->id,
                'order_item_id' => $orderItem->id,
                'rating' => 5,
                'review' => 'Game sangat bagus dan proses aktivasi juga mudah.',
                'images' => [$image1, $image2],
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Review created successfully',
                'data' => [
                    'product_id' => $product->id,
                    'order_item_id' => $orderItem->id,
                    'rating' => 5,
                    'review' => 'Game sangat bagus dan proses aktivasi juga mudah.',
                    'status' => 'pending',
                ],
            ]);

        $data = $response->json('data');
        $this->assertNotEmpty($data['id']);
        $this->assertCount(2, $data['images']);
        $this->assertArrayHasKey('id', $data['images'][0]);
        $this->assertArrayHasKey('url', $data['images'][0]);

        $this->assertDatabaseHas('reviews', [
            'id' => $data['id'],
            'user_id' => $user->id,
            'product_id' => $product->id,
            'order_item_id' => $orderItem->id,
            'rating' => 5,
            'review' => 'Game sangat bagus dan proses aktivasi juga mudah.',
            'status' => 'pending',
        ]);

        $this->assertDatabaseCount('files', 2);
        $this->assertDatabaseHas('files', [
            'related_type' => Review::class,
            'related_id' => $data['id'],
        ]);
    }

    public function test_user_cannot_create_review_with_invalid_data(): void
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/reviews', [
                'rating' => 10, // Max 5
                'review' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['rating', 'review']);
    }

    public function test_user_can_create_review_without_product_id_and_order_item_id(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $image = UploadedFile::fake()->image('review.jpg');

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/reviews', [
                'rating' => 5,
                'review' => 'Game sangat bagus dan proses aktivasi juga mudah.',
                'images' => [$image],
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Review created successfully',
                'data' => [
                    'product_id' => null,
                    'order_item_id' => null,
                    'rating' => 5,
                    'review' => 'Game sangat bagus dan proses aktivasi juga mudah.',
                    'status' => 'pending',
                ],
            ]);

        $this->assertDatabaseHas('reviews', [
            'user_id' => $user->id,
            'product_id' => null,
            'order_item_id' => null,
            'rating' => 5,
            'review' => 'Game sangat bagus dan proses aktivasi juga mudah.',
        ]);
    }

    public function test_user_can_update_own_review(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $product = Product::factory()->create();
        $review = Review::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 3,
            'review' => 'Initial review',
        ]);

        $token = auth('api')->login($user);

        $newImage = UploadedFile::fake()->image('updated.jpg');

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/reviews/{$review->id}", [
                'rating' => 5,
                'review' => 'Updated review text',
                'images' => [$newImage],
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Review updated successfully',
                'data' => [
                    'id' => $review->id,
                    'rating' => 5,
                    'review' => 'Updated review text',
                ],
            ]);

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'rating' => 5,
            'review' => 'Updated review text',
        ]);
    }

    public function test_user_cannot_update_other_users_review(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $product = Product::factory()->create();

        $review = Review::factory()->create([
            'user_id' => $userB->id,
            'product_id' => $product->id,
            'rating' => 3,
            'review' => 'User B review',
        ]);

        $token = auth('api')->login($userA);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/user/reviews/{$review->id}", [
                'rating' => 5,
                'review' => 'Hacked review',
            ]);

        $response->assertStatus(403);
    }

    public function test_updating_non_existent_review_returns_404(): void
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/user/reviews/999999', [
                'rating' => 5,
                'review' => 'Updated review',
            ]);

        $response->assertStatus(404);
    }

    public function test_user_can_delete_own_review_and_polymorphic_files(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $product = Product::factory()->create();
        $review = Review::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 5,
            'review' => 'Delete me',
        ]);

        $filePath = 'reviews/'.$review->id.'/test.jpg';
        Storage::disk('public')->put($filePath, 'fake content');

        $review->images()->create([
            'file_name' => 'test.jpg',
            'file_type' => 'image/jpeg',
            'file_path' => $filePath,
            'file_size' => 1024,
        ]);

        $this->assertDatabaseCount('files', 1);

        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/v1/user/reviews/{$review->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Review deleted successfully',
                'data' => null,
            ]);

        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
        $this->assertDatabaseMissing('files', [
            'related_type' => Review::class,
            'related_id' => $review->id,
        ]);
    }

    public function test_user_cannot_delete_other_users_review(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $product = Product::factory()->create();

        $review = Review::factory()->create([
            'user_id' => $userB->id,
            'product_id' => $product->id,
            'rating' => 5,
            'review' => 'User B review',
        ]);

        $token = auth('api')->login($userA);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/v1/user/reviews/{$review->id}");

        $response->assertStatus(403);
    }

    public function test_deleting_non_existent_review_returns_404(): void
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson('/api/v1/user/reviews/999999');

        $response->assertStatus(404);
    }
}
