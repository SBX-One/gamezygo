<?php

namespace App\Repositories\Contracts\Api\V1\Admin\User;

interface AdminUserRepositoryInterface
{
  /**
   * Get filtered and paginated users list.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getUsers(array $filters): array;

  /**
   * Get single user detailed profile and statistics.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function getUserById(int $id): array;

  /**
   * Update user points and/or adjust subscription duration.
   *
   * @param int $id
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function updateUser(int $id, array $data): array;

  /**
   * Update user status.
   *
   * @param int $id
   * @param string $status
   * @return array<string, mixed>
   */
  public function updateStatus(int $id, string $status): array;

  /**
   * Suspend a user with reason and expiry date.
   *
   * @param int $id
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function suspendUser(int $id, array $data): array;

  /**
   * Remove suspension from a user.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function unsuspendUser(int $id): array;

  /**
   * Delete a user account.
   *
   * @param int $id
   * @return void
   */
  public function deleteUser(int $id): void;

  /**
   * Get user login devices.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function getUserDevices(int $id): array;

  /**
   * Get paginated products owned by user.
   *
   * @param int $id
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getUserProducts(int $id, array $filters = []): array;

  /**
   * Get paginated transactions made by user.
   *
   * @param int $id
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getUserTransactions(int $id, array $filters = []): array;

  /**
   * Get paginated point histories of user.
   *
   * @param int $id
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getUserPointsHistory(int $id, array $filters = []): array;
}

