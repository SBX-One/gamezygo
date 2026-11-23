<?php

namespace App\Http\Controllers\Api\V1\Admin\Community;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Community\AdminCommunityIndexRequest;
use App\Http\Requests\Api\V1\Admin\Community\AdminCommunitySortRequest;
use App\Http\Requests\Api\V1\Admin\Community\AdminCommunityStatusRequest;
use App\Http\Requests\Api\V1\Admin\Community\AdminCommunityStoreRequest;
use App\Http\Requests\Api\V1\Admin\Community\AdminCommunityUpdateRequest;
use App\Repositories\Contracts\Api\V1\Admin\Community\AdminCommunityRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminCommunityController extends Controller
{
    public function __construct(
        protected AdminCommunityRepositoryInterface $communityRepository
    ) {}

    /**
     * List communities with search, tag filter, and sorting.
     */
    public function index(AdminCommunityIndexRequest $request): JsonResponse
    {
        $data = $this->communityRepository->getCommunities($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Communities retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Get available community tags.
     */
    public function tags(): JsonResponse
    {
        $data = $this->communityRepository->getTags();

        return response()->json([
            'success' => true,
            'message' => 'Community tags retrieved successfully',
            'data' => [
                'tags' => $data,
            ],
        ]);
    }

    /**
     * Show single community details.
     */
    public function show(int $communityId): JsonResponse
    {
        $data = $this->communityRepository->getCommunityById($communityId);

        return response()->json([
            'success' => true,
            'message' => 'Community retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Create a new community.
     */
    public function store(AdminCommunityStoreRequest $request): JsonResponse
    {
        $data = $this->communityRepository->createCommunity($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Community created successfully',
            'data' => $data,
        ], 201);
    }

    /**
     * Update community by ID.
     */
    public function update(AdminCommunityUpdateRequest $request, int $communityId): JsonResponse
    {
        $data = $this->communityRepository->updateCommunity($communityId, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Community updated successfully',
            'data' => $data,
        ]);
    }

    /**
     * Update community active status.
     */
    public function status(AdminCommunityStatusRequest $request, int $communityId): JsonResponse
    {
        $isActive = (bool) $request->validated('is_active');
        $data = $this->communityRepository->updateStatus($communityId, $isActive);

        return response()->json([
            'success' => true,
            'message' => 'Community status updated successfully',
            'data' => $data,
        ]);
    }

    /**
     * Sort communities by array of IDs.
     */
    public function sort(AdminCommunitySortRequest $request): JsonResponse
    {
        $data = $this->communityRepository->sortCommunities($request->validated('community_ids'));

        return response()->json([
            'success' => true,
            'message' => 'Communities sorted successfully',
            'data' => $data,
        ]);
    }

    /**
     * Delete community by ID.
     */
    public function destroy(int $communityId): JsonResponse
    {
        $this->communityRepository->deleteCommunity($communityId);

        return response()->json([
            'success' => true,
            'message' => 'Community deleted successfully',
            'data' => null,
        ]);
    }
}
