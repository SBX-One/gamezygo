<?php

namespace App\Http\Controllers\Api\V1\User\GameRequest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\GameRequest\StoreGameRequestRequest;
use App\Http\Resources\Api\V1\User\GameRequest\GameRequestCollection;
use App\Http\Resources\Api\V1\User\GameRequest\GameRequestResource;
use App\Services\Api\V1\User\GameRequest\GameRequestService;
use Illuminate\Auth\Access\AuthorizationException;
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
   * Display all requested games (public view without auth requirement).
   *
   * @param Request $request
   * @return GameRequestCollection
   */
  public function index(Request $request): GameRequestCollection
  {
    $filters = $request->only(['search', 'status', 'page', 'per_page']);
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
    $filters = $request->only(['page', 'per_page']);
    $requests = $this->gameRequestService->getUserRequests($user, $filters);

    return new GameRequestCollection($requests, isPublic: false);
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
