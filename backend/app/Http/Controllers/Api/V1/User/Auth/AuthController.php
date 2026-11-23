<?php

namespace App\Http\Controllers\Api\V1\User\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\Auth\LoginRequest;
use App\Http\Requests\Api\V1\User\Auth\RegisterRequest;
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
    ) {}

    /**
     * Register a new user account.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'token' => $result['token'],
                    'token_type' => $result['token_type'],
                    'expires_in' => $result['expires_in'],
                    'user' => new UserResource($result['user']),
                ],
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Login user with email and password credentials.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'token' => $result['token'],
                    'token_type' => $result['token_type'],
                    'expires_in' => $result['expires_in'],
                    'user' => new UserResource($result['user']),
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
     * Refresh current JWT token.
     */
    public function refresh(): JsonResponse
    {
        try {
            $result = $this->authService->refreshToken();

            return response()->json([
                'success' => true,
                'message' => 'Token refreshed successfully',
                'data' => [
                    'token' => $result['token'],
                    'token_type' => $result['token_type'],
                    'expires_in' => $result['expires_in'],
                    'user' => new UserResource($result['user']),
                ],
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token cannot be refreshed: '.$e->getMessage(),
            ], 401);
        }
    }

    /**
     * Redirect user to Google OAuth consent screen or return the authorization URL.
     */
    public function redirectToGoogle(Request $request): JsonResponse|RedirectResponse
    {
        $url = $this->authService->getGoogleRedirectUrl();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Redirect URL generated successfully',
                'data' => [
                    'url' => $url,
                ],
            ]);
        }

        return redirect()->away($url);
    }

    /**
     * Handle the callback returned by Google OAuth redirect.
     */
    public function handleGoogleCallback(): JsonResponse
    {
        try {
            $result = $this->authService->handleGoogleCallback();

            return response()->json([
                'success' => true,
                'message' => 'Google authentication successful',
                'data' => [
                    'token' => $result['token'],
                    'token_type' => $result['token_type'],
                    'expires_in' => $result['expires_in'],
                    'user' => new UserResource($result['user']),
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
     */
    public function googleLogin(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required_without_all:id_token,access_token|nullable|string',
            'id_token' => 'required_without_all:token,access_token|nullable|string',
            'access_token' => 'required_without_all:token,id_token|nullable|string',
        ]);

        $token = $request->input('token') ?? $request->input('id_token') ?? $request->input('access_token');

        try {
            $result = $this->authService->loginWithGoogleToken($token);

            return response()->json([
                'success' => true,
                'message' => 'Google login successful',
                'data' => [
                    'token' => $result['token'],
                    'token_type' => $result['token_type'],
                    'expires_in' => $result['expires_in'],
                    'user' => new UserResource($result['user']),
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
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user() ?? auth('api')->user();

        return response()->json([
            'success' => true,
            'message' => 'User profile retrieved successfully',
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Logout user and invalidate JWT token.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $this->authService->logout();
        } catch (Throwable) {
            // Ignored if JWT token is already invalidated
        }

        if ($request->user() && method_exists($request->user(), 'currentAccessToken') && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out',
        ]);
    }
}
