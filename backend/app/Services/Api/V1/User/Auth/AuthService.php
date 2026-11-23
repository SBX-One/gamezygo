<?php

namespace App\Services\Api\V1\User\Auth;

use App\Repositories\Contracts\Api\V1\User\Auth\AuthRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;

class AuthService
{
    public function __construct(
        protected AuthRepositoryInterface $authRepository
    ) {}

    /**
     * Register a new user and generate a JWT token.
     */
    public function register(array $data): array
    {
        $user = $this->authRepository->createUser($data);

        $token = auth('api')->login($user);

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ];
    }

    /**
     * Login user with email & password credentials and generate a JWT token.
     *
     * @throws Exception
     */
    public function login(array $credentials): array
    {
        if (! $token = auth('api')->attempt($credentials)) {
            throw new Exception('Invalid email or password.');
        }

        $user = auth('api')->user();

        if ($user->status !== 'active') {
            auth('api')->logout();
            throw new Exception("Your account is {$user->status}. Please contact support.");
        }

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ];
    }

    /**
     * Refresh the current JWT token.
     */
    public function refreshToken(): array
    {
        $token = auth('api')->refresh();
        $user = auth('api')->user();

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ];
    }

    /**
     * Invalidate the current JWT token.
     */
    public function logout(): void
    {
        auth('api')->logout();
    }

    /**
     * Get Google OAuth redirect authorization URL.
     */
    public function getGoogleRedirectUrl(): string
    {
        return Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
    }

    /**
     * Handle Google OAuth redirect callback and generate JWT token.
     *
     * @throws Exception
     */
    public function handleGoogleCallback(): array
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        if (! $googleUser || ! $googleUser->getEmail()) {
            throw new Exception('Unable to authenticate with Google.');
        }

        $user = $this->authRepository->updateOrCreateGoogleUser([
            'google_id' => $googleUser->getId(),
            'name' => $googleUser->getName() ?? 'User',
            'email' => $googleUser->getEmail(),
            'avatar_url' => $googleUser->getAvatar(),
        ]);

        $token = auth('api')->login($user);

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ];
    }

    /**
     * Validate Google token (ID token or Access token) from frontend SDK and authenticate user with JWT.
     *
     * @throws Exception
     */
    public function loginWithGoogleToken(string $token): array
    {
        $googleData = $this->verifyGoogleToken($token);

        if (! $googleData || empty($googleData['email'])) {
            throw new Exception('Invalid Google authentication token.');
        }

        $user = $this->authRepository->updateOrCreateGoogleUser([
            'google_id' => $googleData['google_id'],
            'name' => $googleData['name'] ?? 'User',
            'email' => $googleData['email'],
            'avatar_url' => $googleData['avatar_url'] ?? null,
        ]);

        $jwtToken = auth('api')->login($user);

        return [
            'user' => $user,
            'token' => $jwtToken,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ];
    }

    /**
     * Verify token with Google API (verifies ID token first, falls back to Access token/userinfo).
     */
    protected function verifyGoogleToken(string $token): ?array
    {
        // 1. Try verifying as Google ID Token (used by Google Identity Services / Next.js @react-oauth/google credential)
        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $token,
        ]);

        if ($response->successful()) {
            $data = $response->json();
            if (! empty($data['email']) && ! empty($data['sub'])) {
                return [
                    'google_id' => $data['sub'],
                    'name' => $data['name'] ?? 'User',
                    'email' => $data['email'],
                    'avatar_url' => $data['picture'] ?? null,
                ];
            }
        }

        // 2. Try verifying as Access Token via userinfo endpoint
        $userInfoResponse = Http::withToken($token)->get('https://www.googleapis.com/oauth2/v3/userinfo');

        if ($userInfoResponse->successful()) {
            $data = $userInfoResponse->json();
            if (! empty($data['email']) && ! empty($data['sub'])) {
                return [
                    'google_id' => $data['sub'],
                    'name' => $data['name'] ?? 'User',
                    'email' => $data['email'],
                    'avatar_url' => $data['picture'] ?? null,
                ];
            }
        }

        return null;
    }
}
