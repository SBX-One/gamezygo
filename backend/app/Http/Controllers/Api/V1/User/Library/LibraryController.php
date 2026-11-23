<?php

namespace App\Http\Controllers\Api\V1\User\Library;

use App\Http\Controllers\Controller;
use App\Services\Library\LibraryService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class LibraryController extends Controller
{
    public function __construct(
        protected LibraryService $libraryService
    ) {}

    /**
     * Data Isolation Shield: Get decrypted Game Library items strictly isolated to authenticated user.
     */
    public function getLibrary(Request $request): JsonResponse
    {
        $user = $request->user() ?? auth('api')->user();

        if (! $user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated',
            ], 401);
        }

        $library = $this->libraryService->getLibrary($user);

        return response()->json([
            'status' => 'success',
            'message' => 'Game library retrieved successfully',
            'data' => $library,
        ]);
    }

    /**
     * Data Isolation Shield: Get decrypted credentials for a specific game owned by the authenticated user.
     *
     * @param  string  $productIdentifier  Slug or ID of the product
     */
    public function show(Request $request, string $productIdentifier): JsonResponse
    {
        $user = $request->user() ?? auth('api')->user();

        if (! $user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated',
            ], 401);
        }

        try {
            $data = $this->libraryService->getProductCredentials($user, $productIdentifier);

            return response()->json([
                'status' => 'success',
                'message' => 'Game credentials retrieved successfully',
                'data' => $data,
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage() ?: 'Unauthorized access to credentials.',
                'data' => null,
            ], 403);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage() ?: 'Game credentials not found.',
                'data' => null,
            ], 404);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }
}
