<?php

namespace App\Http\Controllers\Api\V1\User\Community;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\User\Community\CommunityCollection;
use App\Http\Resources\Api\V1\User\Community\CommunityDetailResource;
use App\Http\Resources\Api\V1\User\Community\CommunityTagResource;
use App\Services\Api\V1\User\Community\CommunityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
  public function __construct(
    protected CommunityService $communityService
  ) {}

  /**
   * Display a listing of active communities with filters and pagination.
   *
   * @param Request $request
   * @return CommunityCollection
   */
  public function index(Request $request): CommunityCollection
  {
    $filters = $request->only([
      'search',
      'tag_id',
      'tag_ids',
      'tag',
      'sort_by',
      'page',
      'per_page',
    ]);

    $communities = $this->communityService->getActiveCommunities($filters);

    return new CommunityCollection($communities);
  }

  /**
   * Display available community tags for active communities.
   *
   * @return JsonResponse
   */
  public function tags(): JsonResponse
  {
    $tags = $this->communityService->getCommunityTags();

    return response()->json([
      'success' => true,
      'message' => 'Community tags retrieved successfully',
      'data'    => CommunityTagResource::collection($tags),
    ]);
  }

  /**
   * Display details of a specific active community.
   *
   * @param int $id
   * @return JsonResponse|CommunityDetailResource
   */
  public function show(int $id): JsonResponse|CommunityDetailResource
  {
    $community = $this->communityService->getActiveCommunityById($id);

    if (!$community) {
      return response()->json([
        'success' => false,
        'message' => 'Community not found',
      ], 404);
    }

    return new CommunityDetailResource($community);
  }
}
