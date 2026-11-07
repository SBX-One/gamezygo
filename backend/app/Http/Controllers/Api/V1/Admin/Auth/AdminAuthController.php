<?php

namespace App\Http\Controllers\Api\V1\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Auth\AdminLoginRequest;
use App\Http\Resources\Api\V1\Admin\Auth\AdminResource;
use App\Services\Api\V1\Admin\Auth\AdminAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AdminAuthController extends Controller
{
  public function __construct(
    protected AdminAuthService $adminAuthService
  ) {
  }

  /**
   * Login admin with email and password credentials.
   *
   * @param AdminLoginRequest $request
   * @return JsonResponse
   */
  public function login(AdminLoginRequest $request): JsonResponse
  {
    try {
      $result = $this->adminAuthService->login($request->validated());

      return response()->json([
        'success' => true,
        'message' => 'Admin login successful',
        'data'    => [
          'token'      => $result['token'],
          'token_type' => $result['token_type'],
          'expires_in' => $result['expires_in'],
          'admin'      => new AdminResource($result['admin']),
        ],
      ]);
    } catch (Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage(),
      ], 401);
    }
  }

  /**
   * Get the currently authenticated admin profile.
   *
   * @param Request $request
   * @return JsonResponse
   */
  public function me(Request $request): JsonResponse
  {
    $admin = $this->adminAuthService->getAuthenticatedAdmin()
      ?? $request->user('admin')
      ?? $request->user();

    return response()->json([
      'success' => true,
      'message' => 'Admin profile retrieved successfully',
      'data'    => new AdminResource($admin),
    ]);
  }

  /**
   * Refresh current admin JWT token.
   *
   * @return JsonResponse
   */
  public function refresh(): JsonResponse
  {
    try {
      $result = $this->adminAuthService->refreshToken();

      return response()->json([
        'success' => true,
        'message' => 'Admin token refreshed successfully',
        'data'    => [
          'token'      => $result['token'],
          'token_type' => $result['token_type'],
          'expires_in' => $result['expires_in'],
          'admin'      => new AdminResource($result['admin']),
        ],
      ]);
    } catch (Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to refresh token: ' . $e->getMessage(),
      ], 401);
    }
  }

  /**
   * Logout authenticated admin and invalidate token.
   *
   * @return JsonResponse
   */
  public function logout(): JsonResponse
  {
    try {
      $this->adminAuthService->logout();

      return response()->json([
        'success' => true,
        'message' => 'Admin successfully logged out',
      ]);
    } catch (Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to logout: ' . $e->getMessage(),
      ], 400);
    }
  }
}

