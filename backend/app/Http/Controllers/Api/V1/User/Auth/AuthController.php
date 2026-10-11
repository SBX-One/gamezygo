<?php

namespace App\Http\Controllers\Api\V1\User\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\User\Auth\UserResource;
use App\Services\Api\V1\User\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Throwable;

class AuthController extends Controller
{
  public function __construct(
    protected AuthService $authService
  ) {
  }

  /**
   * Redirect user to Google OAuth consent screen or return the authorization URL.
   *
   * @param Request $request
   * @return JsonResponse|RedirectResponse
   */
  public function redirectToGoogle(Request $request): JsonResponse|RedirectResponse
  {
    $url = $this->authService->getGoogleRedirectUrl();

    if ($request->wantsJson()) {
      return response()->json([
        'success' => true,
        'message' => 'Redirect URL generated successfully',
        'data'    => [
          'url' => $url,
        ],
      ]);
    }

    return redirect()->away($url);
  }

  /**
   * Handle the callback returned by Google OAuth redirect.
   *
   * @return JsonResponse
   */
  public function handleGoogleCallback(): JsonResponse
  {
    try {
      $result = $this->authService->handleGoogleCallback();

      return response()->json([
        'success' => true,
        'message' => 'Google authentication successful',
        'data'    => [
          'token'      => $result['token'],
          'token_type' => $result['token_type'],
          'user'       => new UserResource($result['user']),
        ],
      ]);
    } catch (Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage(),
      ], 400);
    }
  }

  /**
   * Authenticate user with Google ID token or Access token from SPA / Next.js frontend.
   *
   * @param Request $request
   * @return JsonResponse
   */
  public function googleLogin(Request $request): JsonResponse
  {
    $request->validate([
      'token'        => 'required_without_all:id_token,access_token|nullable|string',
      'id_token'     => 'required_without_all:token,access_token|nullable|string',
      'access_token' => 'required_without_all:token,id_token|nullable|string',
    ]);

    $token = $request->input('token') ?? $request->input('id_token') ?? $request->input('access_token');

    try {
      $result = $this->authService->loginWithGoogleToken($token);

      return response()->json([
        'success' => true,
        'message' => 'Google login successful',
        'data'    => [
          'token'      => $result['token'],
          'token_type' => $result['token_type'],
          'user'       => new UserResource($result['user']),
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
   * Get authenticated user profile.
   *
   * @param Request $request
   * @return JsonResponse
   */
  public function me(Request $request): JsonResponse
  {
    return response()->json([
      'success' => true,
      'message' => 'User profile retrieved successfully',
      'data'    => new UserResource($request->user()),
    ]);
  }

  /**
   * Logout user and revoke current access token.
   *
   * @param Request $request
   * @return JsonResponse
   */
  public function logout(Request $request): JsonResponse
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
      'success' => true,
      'message' => 'Successfully logged out',
    ]);
  }
}
