<?php

namespace App\Repositories\Api\V1\User\Auth;

use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Auth\AuthRepositoryInterface;
use Illuminate\Support\Str;

class AuthRepository implements AuthRepositoryInterface
{
    /**
     * Find a user by email address.
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    /**
     * Find a user by Google ID.
     */
    public function findByGoogleId(string $googleId): ?User
    {
        return User::where('google_id', $googleId)->first();
    }

    /**
     * Create a new user record.
     */
    public function createUser(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'phone' => $data['phone'] ?? null,
            'status' => 'active',
            'total_points' => 0,
            'total_transaction' => 0,
            'email_verified_at' => null,
        ]);
    }

    /**
     * Update existing user or create a new user from Google profile data.
     */
    public function updateOrCreateGoogleUser(array $data): User
    {
        $googleId = $data['google_id'] ?? null;
        $email = $data['email'] ?? null;

        $user = null;

        if ($googleId) {
            $user = $this->findByGoogleId($googleId);
        }

        if (! $user && $email) {
            $user = $this->findByEmail($email);
        }

        if ($user) {
            $updateData = [];

            if (empty($user->google_id) && $googleId) {
                $updateData['google_id'] = $googleId;
            }

            if (empty($user->avatar_url) && ! empty($data['avatar_url'])) {
                $updateData['avatar_url'] = $data['avatar_url'];
            }

            if (empty($user->email_verified_at)) {
                $updateData['email_verified_at'] = now();
            }

            if (! empty($updateData)) {
                $user->update($updateData);
            }

            return $user;
        }

        return User::create([
            'name' => $data['name'] ?? 'User',
            'email' => $email,
            'google_id' => $googleId,
            'avatar_url' => $data['avatar_url'] ?? null,
            'password' => bcrypt(Str::random(32)),
            'status' => 'active',
            'total_points' => 0,
            'total_transaction' => 0,
            'email_verified_at' => now(),
        ]);
    }
}
