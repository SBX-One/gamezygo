<?php

namespace App\Http\Controllers\Api\V1\Admin\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\User\AdminUserIndexRequest;
use App\Http\Requests\Api\V1\Admin\User\AdminUserStatusRequest;
use App\Http\Requests\Api\V1\Admin\User\AdminUserSuspendRequest;
use App\Http\Requests\Api\V1\Admin\User\AdminUserTransactionIndexRequest;
use App\Http\Requests\Api\V1\Admin\User\AdminUserUpdateRequest;
use App\Repositories\Contracts\Api\V1\Admin\User\AdminUserRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminUserController extends Controller
{
    public function __construct(
        protected AdminUserRepositoryInterface $userRepository
    ) {}

    /**
     * List all users with filters and pagination.
     */
    public function index(AdminUserIndexRequest $request): JsonResponse
    {
        $data = $this->userRepository->getUsers($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Users retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Get single user details by ID.
     */
    public function show(int $userId): JsonResponse
    {
        $data = $this->userRepository->getUserById($userId);

        return response()->json([
            'success' => true,
            'message' => 'User details retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Update user points or subscription duration adjustment.
     */
    public function update(AdminUserUpdateRequest $request, int $userId): JsonResponse
    {
        $data = $this->userRepository->updateUser($userId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $data,
        ]);
    }

    /**
     * Update user status (active, inactive, suspended, banned).
     */
    public function status(AdminUserStatusRequest $request, int $userId): JsonResponse
    {
        $data = $this->userRepository->updateStatus($userId, $request->validated()['status']);

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully',
            'data' => $data,
        ]);
    }

    /**
     * Suspend a user.
     */
    public function suspend(AdminUserSuspendRequest $request, int $userId): JsonResponse
    {
        $data = $this->userRepository->suspendUser($userId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'User suspended successfully',
            'data' => $data,
        ]);
    }

    /**
     * Unsuspend a user.
     */
    public function unsuspend(int $userId): JsonResponse
    {
        $data = $this->userRepository->unsuspendUser($userId);

        return response()->json([
            'success' => true,
            'message' => 'User unsuspended successfully',
            'data' => $data,
        ]);
    }

    /**
     * Delete a user.
     */
    public function destroy(int $userId): JsonResponse
    {
        $data = $this->userRepository->deleteUser($userId);

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully',
            'data' => $data,
        ]);
    }

    /**
     * Get devices linked to a user.
     */
    public function devices(int $userId): JsonResponse
    {
        $data = $this->userRepository->getUserDevices($userId);

        return response()->json([
            'success' => true,
            'message' => 'User devices retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Get products/games owned by a user.
     */
    public function products(int $userId): JsonResponse
    {
        $data = $this->userRepository->getUserProducts($userId);

        return response()->json([
            'success' => true,
            'message' => 'User products retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Get transactions of a user.
     */
    public function transactions(AdminUserTransactionIndexRequest $request, int $userId): JsonResponse
    {
        $data = $this->userRepository->getUserTransactions($userId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'User transactions retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Get points history of a user.
     */
    public function pointsHistory(int $userId): JsonResponse
    {
        $data = $this->userRepository->getUserPointsHistory($userId);

        return response()->json([
            'success' => true,
            'message' => 'User points history retrieved successfully',
            'data' => $data,
        ]);
    }
}
