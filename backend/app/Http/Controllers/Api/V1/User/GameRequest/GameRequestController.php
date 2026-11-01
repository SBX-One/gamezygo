<?php

namespace App\Http\Controllers\Api\V1\User\GameRequest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\GameRequest\StoreGameRequestRequest;
use App\Http\Resources\Api\V1\User\GameRequest\GameRequestCollection;
use App\Http\Resources\Api\V1\User\GameRequest\GameRequestResource;
use App\Services\Api\V1\User\GameRequest\GameRequestService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class GameRequestController extends Controller
{
  public function __construct(
    protected GameRequestService $gameRequestService
  ) {
  }

  /**
   * Display requested games (public view, user's requests via ?scope=mine, or added games via ?scope=added).
   *
   * @param Request $request
   * @return GameRequestCollection
   */
  public function index(Request $request): GameRequestCollection
  {
    $scope = $request->query('scope');

    if ($scope === 'mine') {
      try {
        $user = $request->user('api') ?? auth('api')->user() ?? $request->user('sanctum') ?? auth('sanctum')->user() ?? $request->user();
      } catch (Throwable) {
        $user = null;
      }

      if (!$user) {
        throw new AuthenticationException('Unauthenticated.');
      }

      $filters = $request->only(['page', 'per_page', 'search', 'status']);
      $requests = $this->gameRequestService->getUserRequests($user, $filters);

      return new GameRequestCollection($requests, isPublic: true);
    }

    $filters = $request->only(['search', 'status', 'page', 'per_page']);

    // Scope for games that have already been added to the catalog
    if (in_array($scope, ['added', 'available', 'ditambahkan'], true)) {
      $filters['status'] = 'available';
    }

    $requests = $this->gameRequestService->getAllRequests($filters);

    return new GameRequestCollection($requests, isPublic: true);
  }

  /**
   * Display game requests created by the authenticated user.
   *
   * @param Request $request
   * @return GameRequestCollection
   */
  public function userRequests(Request $request): GameRequestCollection
  {
    $user = $request->user() ?? auth('api')->user();
    $filters = $request->only(['page', 'per_page', 'search', 'status']);
    $requests = $this->gameRequestService->getUserRequests($user, $filters);

    return new GameRequestCollection($requests, isPublic: true);
  }

  /**
   * Create a new game request by providing a Steam store URL.
   *
   * @param StoreGameRequestRequest $request
   * @return JsonResponse
   */
  public function store(StoreGameRequestRequest $request): JsonResponse
  {
    $user = $request->user() ?? auth('api')->user();

    try {
      $gameRequest = $this->gameRequestService->createGameRequest($user, $request->validated());

      return response()->json([
        'success' => true,
        'message' => 'Game request created successfully',
        'data'    => (new GameRequestResource($gameRequest))->resolve(),
      ], 201);
    } catch (ValidationException $e) {
      return response()->json([
        'success' => false,
        'message' => $e->validator->errors()->first() ?: 'Validation error',
        'data'    => null,
      ], 422);
    } catch (Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage(),
        'data'    => null,
      ], 400);
    }
  }

  /**
   * Remove a game request by ID (param).
   *
   * @param Request $request
   * @param int $id
   * @return JsonResponse
   */
  public function destroy(Request $request, int $id): JsonResponse
  {
    $user = $request->user() ?? auth('api')->user();

    try {
      $this->gameRequestService->deleteGameRequest($user, $id);

      return response()->json([
        'success' => true,
        'message' => 'Game request deleted successfully',
        'data'    => null,
      ], 200);
    } catch (ModelNotFoundException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Game request not found',
        'data'    => null,
      ], 404);
    } catch (AuthorizationException $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage() ?: 'You are not authorized to delete this game request',
        'data'    => null,
      ], 403);
    } catch (Throwable $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage(),
        'data'    => null,
      ], 400);
    }
  }
}
