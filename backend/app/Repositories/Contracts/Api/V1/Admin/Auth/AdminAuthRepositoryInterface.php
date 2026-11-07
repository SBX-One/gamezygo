<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Auth;

use App\Models\Admin;

interface AdminAuthRepositoryInterface
{
  /**
   * Find an admin by email address.
   *
   * @param string $email
   * @return Admin|null
   */
  public function findByEmail(string $email): ?Admin;

  /**
   * Find an admin by ID.
   *
   * @param int|string $id
   * @return Admin|null
   */
  public function findById(int|string $id): ?Admin;

  /**
   * Create a new admin record.
   *
   * @param array<string, mixed> $data
   * @return Admin
   */
  public function createAdmin(array $data): Admin;
}

