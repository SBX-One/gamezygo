<?php

namespace App\Repositories\Contracts\Api\V1\Admin\User;

interface AdminUserRepositoryInterface
{
    /**
     * Get filtered and paginated users list.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getUsers(array $filters): array;

    /**
     * Get single user detailed profile and statistics.
     *
     * @return array<string, mixed>
     */
    public function getUserById(int $id): array;

    /**
     * Update user points and/or adjust subscription duration.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateUser(int $id, array $data): array;

    /**
     * Update user status.
     *
     * @return array<string, mixed>
     */
    public function updateStatus(int $id, string $status): array;

    /**
     * Suspend a user with reason and expiry date.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function suspendUser(int $id, array $data): array;

    /**
     * Remove suspension from a user.
     *
     * @return array<string, mixed>
     */
    public function unsuspendUser(int $id): array;

    /**
     * Delete a user account.
     *
     * @return array<string, mixed>
     */
    public function deleteUser(int $id): array;

    /**
     * Get user login devices.
     *
     * @return array<string, mixed>
     */
    public function getUserDevices(int $id): array;

    /**
     * Get paginated products owned by user.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getUserProducts(int $id, array $filters = []): array;

    /**
     * Get paginated transactions made by user.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getUserTransactions(int $id, array $filters = []): array;

    /**
     * Get paginated point histories of user.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getUserPointsHistory(int $id, array $filters = []): array;
}
