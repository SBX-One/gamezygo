<?php

namespace App\Http\Controllers\Api\V1\User\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\Profile\ChangePasswordRequest;
use App\Http\Requests\Api\V1\User\Profile\GetProfileProductsRequest;
use App\Http\Requests\Api\V1\User\Profile\UpdateProfileRequest;
use App\Http\Resources\Api\V1\User\Product\ProductResource;
use App\Http\Resources\Api\V1\User\Profile\ProfileResource;
use App\Services\Api\V1\User\Profile\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ProfileController extends Controller
{
  public function __construct(
    protected ProfileService $profileService
  ) {
  }

  /**
   * Display the authenticated user profile with stats, rankings, and recent transactions.
   *
   * @param Request $request
   * @return JsonResponse
   */
  public function show(Request $request): JsonResponse
  {
    $user = $request->user() ?? auth('api')->user();

    $profile = $this->profileService->getProfile($user);

    return response()->json([
      'success' => true,
      'message' => 'User profile retrieved successfully',
      'data'    => new ProfileResource($profile),
    ]);
  }

  /**
   * Update authenticated user profile details.
   *
   * @param UpdateProfileRequest $request
   * @return JsonResponse
   */
  public function update(UpdateProfileRequest $request): JsonResponse
  {
    try {
      $user = $request->user() ?? auth('api')->user();
      $avatarFile = $request->file('avatar');

      $updatedUser = $this->profileService->updateProfile($user, $request->validated(), $avatarFile);
      $profile = $this->profileService->getProfile($updatedUser);

      return response()->json([
        'success' => true,
        'message' => 'User profile updated successfully',
        'data'    => new ProfileResource($profile),
      ]);
    } catch (Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to update profile: ' . $e->getMessage(),
      ], 400);
    }
  }

  /**
   * Reset / change password by providing old password and confirmed new password.
   *
   * @param ChangePasswordRequest $request
   * @return JsonResponse
   */
  public function changePassword(ChangePasswordRequest $request): JsonResponse
  {
    try {
      $user = $request->user() ?? auth('api')->user();

      $this->profileService->changePassword(
        $user,
        $request->input('current_password'),
        $request->input('new_password')
      );

      return response()->json([
        'success' => true,
        'message' => 'Password berhasil diperbarui',
      ]);
    } catch (Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage(),
      ], 400);
    }
  }

  /**
   * Display a listing of products owned by authenticated user (Game Library).
   *
   * @param GetProfileProductsRequest $request
   * @return JsonResponse
   */
  public function products(GetProfileProductsRequest $request): JsonResponse
  {
    $user = $request->user() ?? auth('api')->user();

    $paginator = $this->profileService->getOwnedProducts($user, $request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Products retrieved successfully',
      'data'    => ProductResource::collection($paginator->items()),
      'meta'    => [
        'current_page' => $paginator->currentPage(),
        'from'         => $paginator->firstItem(),
        'last_page'    => $paginator->lastPage(),
        'per_page'     => $paginator->perPage(),
        'to'           => $paginator->lastItem(),
        'total'        => $paginator->total(),
      ],
    ]);
  }
}
