<?php

namespace App\Services\Api\V1\Admin\Auth;

use App\Models\Admin;
use App\Repositories\Contracts\Api\V1\Admin\Auth\AdminAuthRepositoryInterface;
use Exception;

class AdminAuthService
{
    public function __construct(
        protected AdminAuthRepositoryInterface $adminAuthRepository
    ) {}

    /**
     * Login admin with email and password credentials.
     *
     * @param  array<string, string>  $credentials
     * @return array<string, mixed>
     *
     * @throws Exception
     */
    public function login(array $credentials): array
    {
        if (! $token = auth('admin')->attempt($credentials)) {
            throw new Exception('Invalid email or password.');
        }

        $admin = auth('admin')->user();

        return [
            'admin' => $admin,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth('admin')->factory()->getTTL() * 60,
        ];
    }

    /**
     * Refresh current admin JWT token.
     *
     * @return array<string, mixed>
     */
    public function refreshToken(): array
    {
        $token = auth('admin')->refresh();
        $admin = auth('admin')->user();

        return [
            'admin' => $admin,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth('admin')->factory()->getTTL() * 60,
        ];
    }

    /**
     * Invalidate current admin JWT token.
     */
    public function logout(): void
    {
        auth('admin')->logout();
    }

    /**
     * Get the currently authenticated admin.
     */
    public function getAuthenticatedAdmin(): ?Admin
    {
        return auth('admin')->user();
    }
}
