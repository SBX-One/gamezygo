<?php

namespace App\Repositories\Contracts\Api\V1\User\Auth;

use App\Models\User;

interface AuthRepositoryInterface
{
    /**
     * Find a user by email address.
     */
    public function findByEmail(string $email): ?User;

    /**
     * Find a user by Google ID.
     */
    public function findByGoogleId(string $googleId): ?User;

    /**
     * Create a new user record.
     */
    public function createUser(array $data): User;

    /**
     * Update existing user or create a new user from Google profile data.
     */
    public function updateOrCreateGoogleUser(array $data): User;
}
