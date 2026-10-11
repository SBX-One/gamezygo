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
  ) {
  }

  /**
   * Get Google OAuth redirect authorization URL.
   *
   * @return string
   */
  public function getGoogleRedirectUrl(): string
  {
    return Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
  }

  /**
   * Handle Google OAuth redirect callback and generate Sanctum token.
   *
   * @return array
   * @throws Exception
   */
  public function handleGoogleCallback(): array
  {
    $googleUser = Socialite::driver('google')->stateless()->user();

    if (!$googleUser || !$googleUser->getEmail()) {
      throw new Exception('Unable to authenticate with Google.');
    }

    $user = $this->authRepository->updateOrCreateGoogleUser([
      'google_id'  => $googleUser->getId(),
      'name'       => $googleUser->getName() ?? 'User',
      'email'      => $googleUser->getEmail(),
      'avatar_url' => $googleUser->getAvatar(),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return [
      'user'       => $user,
      'token'      => $token,
      'token_type' => 'Bearer',
    ];
  }

  /**
   * Validate Google token (ID token or Access token) from frontend SDK and authenticate user.
   *
   * @param string $token
   * @return array
   * @throws Exception
   */
  public function loginWithGoogleToken(string $token): array
  {
    $googleData = $this->verifyGoogleToken($token);

    if (!$googleData || empty($googleData['email'])) {
      throw new Exception('Invalid Google authentication token.');
    }

    $user = $this->authRepository->updateOrCreateGoogleUser([
      'google_id'  => $googleData['google_id'],
      'name'       => $googleData['name'] ?? 'User',
      'email'      => $googleData['email'],
      'avatar_url' => $googleData['avatar_url'] ?? null,
    ]);

    $authToken = $user->createToken('auth_token')->plainTextToken;

    return [
      'user'       => $user,
      'token'      => $authToken,
      'token_type' => 'Bearer',
    ];
  }

  /**
   * Verify token with Google API (verifies ID token first, falls back to Access token/userinfo).
   *
   * @param string $token
   * @return array|null
   */
  protected function verifyGoogleToken(string $token): ?array
  {
    // 1. Try verifying as Google ID Token (used by Google Identity Services / Next.js @react-oauth/google credential)
    $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
      'id_token' => $token,
    ]);

    if ($response->successful()) {
      $data = $response->json();
      if (!empty($data['email']) && !empty($data['sub'])) {
        return [
          'google_id'  => $data['sub'],
          'name'       => $data['name'] ?? 'User',
          'email'      => $data['email'],
          'avatar_url' => $data['picture'] ?? null,
        ];
      }
    }

    // 2. Try verifying as Access Token via userinfo endpoint
    $userInfoResponse = Http::withToken($token)->get('https://www.googleapis.com/oauth2/v3/userinfo');

    if ($userInfoResponse->successful()) {
      $data = $userInfoResponse->json();
      if (!empty($data['email']) && !empty($data['sub'])) {
        return [
          'google_id'  => $data['sub'],
          'name'       => $data['name'] ?? 'User',
          'email'      => $data['email'],
          'avatar_url' => $data['picture'] ?? null,
        ];
      }
    }

    return null;
  }
}
