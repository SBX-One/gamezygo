<?php

namespace App\Http\Controllers\Api\V1\User\Review;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\Review\StoreReviewRequest;
use App\Http\Requests\Api\V1\User\Review\UpdateReviewRequest;
use App\Http\Resources\Api\V1\User\Review\ReviewCollection;
use App\Http\Resources\Api\V1\User\Review\UserReviewResource;
use App\Services\Api\V1\User\Review\ReviewService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ReviewController extends Controller
{
  public function __construct(
    protected ReviewService $reviewService
  ) {
  }

  /**
   * Display approved reviews (guest view) or user's own reviews when ?scope=mine.
   *
   * @param Request $request
   * @return ReviewCollection
   */
  public function index(Request $request): ReviewCollection
  {
    if ($request->query('scope') === 'mine') {
      try {
        $user = $request->user('api') ?? auth('api')->user() ?? $request->user('sanctum') ?? auth('sanctum')->user() ?? $request->user();
      } catch (Throwable) {
        $user = null;
      }

      if (!$user) {
        throw new AuthenticationException('Unauthenticated.');
      }

      $filters = $request->only(['product_id', 'status', 'rating']);
      $reviews = $this->reviewService->getUserReviews($user, $filters);

      return new ReviewCollection($reviews);
    }

    $filters = $request->only([
      'product_id',
      'product_slug',
      'rating',
    ]);

    $reviews = $this->reviewService->getApprovedReviews($filters);

    return new ReviewCollection($reviews);
  }

  /**
   * Display reviews created by authenticated user.
   *
   * @param Request $request
   * @return ReviewCollection
   */
  public function userReviews(Request $request): ReviewCollection
  {
    $user = $request->user() ?? auth('api')->user();
    $filters = $request->only(['product_id', 'status', 'rating']);
    $reviews = $this->reviewService->getUserReviews($user, $filters);

    return new ReviewCollection($reviews);
  }

  /**
   * Create a new review with polymorphic image attachments.
   *
   * @param StoreReviewRequest $request
   * @return JsonResponse
   */
  public function store(StoreReviewRequest $request): JsonResponse
  {
    $user = $request->user() ?? auth('api')->user();

    try {
      $validated = $request->validated();
      $images = $request->file('images', []);
      if (!is_array($images)) {
        $images = $images ? [$images] : [];
      }

      $review = $this->reviewService->createReview($user, $validated, $images);

      return response()->json([
        'success' => true,
        'message' => 'Review created successfully',
        'data'    => (new UserReviewResource($review))->resolve(),
      ], 201);
    } catch (Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage(),
        'data'    => null,
      ], 400);
    }
  }

  /**
   * Update an existing review with optional new images.
   *
   * @param UpdateReviewRequest $request
   * @param int $id
   * @return JsonResponse
   */
  public function update(UpdateReviewRequest $request, int $id): JsonResponse
  {
    $user = $request->user() ?? auth('api')->user();

    try {
      $validated = $request->validated();
      $images = $request->file('images', []);
      if (!is_array($images)) {
        $images = $images ? [$images] : [];
      }

      $review = $this->reviewService->updateReview($user, $id, $validated, $images);

      return response()->json([
        'success' => true,
        'message' => 'Review updated successfully',
        'data'    => (new UserReviewResource($review))->resolve(),
      ], 200);
    } catch (ModelNotFoundException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Review not found',
        'data'    => null,
      ], 404);
    } catch (AuthorizationException $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage() ?: 'You are not authorized to update this review',
        'data'    => null,
      ], 403);
    } catch (Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage(),
        'data'    => null,
      ], 400);
    }
  }

  /**
   * Delete an existing review by ID.
   *
   * @param Request $request
   * @param int $id
   * @return JsonResponse
   */
  public function destroy(Request $request, int $id): JsonResponse
  {
    $user = $request->user() ?? auth('api')->user();

    try {
      $this->reviewService->deleteReview($user, $id);

      return response()->json([
        'success' => true,
        'message' => 'Review deleted successfully',
        'data'    => null,
      ], 200);
    } catch (ModelNotFoundException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Review not found',
        'data'    => null,
      ], 404);
    } catch (AuthorizationException $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage() ?: 'You are not authorized to delete this review',
        'data'    => null,
      ], 403);
    } catch (Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage(),
        'data'    => null,
      ], 400);
    }
  }
}
