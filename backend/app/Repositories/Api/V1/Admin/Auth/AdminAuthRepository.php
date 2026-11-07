<?php

namespace App\Repositories\Api\V1\Admin\Auth;

use App\Models\Admin;
use App\Repositories\Contracts\Api\V1\Admin\Auth\AdminAuthRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class AdminAuthRepository implements AdminAuthRepositoryInterface
{
  /**
   * Find an admin by email address.
   *
   * @param string $email
   * @return Admin|null
   */
  public function findByEmail(string $email): ?Admin
  {
    return Admin::where('email', $email)->first();
  }

  /**
   * Find an admin by ID.
   *
   * @param int|string $id
   * @return Admin|null
   */
  public function findById(int|string $id): ?Admin
  {
    return Admin::find($id);
  }

  /**
   * Create a new admin record.
   *
   * @param array<string, mixed> $data
   * @return Admin
   */
  public function createAdmin(array $data): Admin
  {
    return Admin::create([
      'name'     => $data['name'],
      'email'    => $data['email'],
      'password' => Hash::make($data['password']),
    ]);
  }
}

