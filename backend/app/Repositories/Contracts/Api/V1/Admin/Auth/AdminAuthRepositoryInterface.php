<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Auth;

use App\Models\Admin;

interface AdminAuthRepositoryInterface
{
    /**
     * Find an admin by email address.
     */
    public function findByEmail(string $email): ?Admin;

    /**
     * Find an admin by ID.
     */
    public function findById(int|string $id): ?Admin;

    /**
     * Create a new admin record.
     *
     * @param  array<string, mixed>  $data
     */
    public function createAdmin(array $data): Admin;
}
