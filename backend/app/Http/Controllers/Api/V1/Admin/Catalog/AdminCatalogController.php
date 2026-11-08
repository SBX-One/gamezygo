<?php

namespace App\Http\Controllers\Api\V1\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Catalog\AdminCatalogDeleteRequest;
use App\Http\Requests\Api\V1\Admin\Catalog\AdminCatalogIndexRequest;
use App\Http\Requests\Api\V1\Admin\Catalog\AdminCatalogSteamDataRequest;
use App\Http\Requests\Api\V1\Admin\Catalog\AdminCatalogStoreRequest;
use App\Http\Requests\Api\V1\Admin\Catalog\AdminCatalogUpdateRequest;
use App\Http\Resources\Api\V1\Admin\Catalog\AdminCatalogArchiveStatusResource;
use App\Http\Resources\Api\V1\Admin\Catalog\AdminCatalogDetailResource;
use App\Http\Resources\Api\V1\Admin\Catalog\AdminCatalogItemResource;
use App\Services\Api\V1\Admin\Catalog\AdminCatalogService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;

class AdminCatalogController extends Controller
{
  public function __construct(
    protected AdminCatalogService $catalogService
  ) {
  }

  /**
   * Display a listing of products with filters and pagination.
   *
   * @param AdminCatalogIndexRequest $request
   * @return JsonResponse
   */
  public function index(AdminCatalogIndexRequest $request): JsonResponse
  {
    $perPage = (int) $request->input('per_page', 10);
    $result = $this->catalogService->getCatalog($request->all(), $perPage, false);

    /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
    $paginator = $result['paginator'];

    return response()->json([
      'success' => true,
      'message' => 'Products retrieved successfully',
      'data'    => [
        'total_products' => $result['total_products'],
        'products'       => AdminCatalogItemResource::collection($paginator->items()),
        'meta'           => [
          'current_page' => $paginator->currentPage(),
          'from'         => $paginator->firstItem(),
          'last_page'    => $paginator->lastPage(),
          'per_page'     => $paginator->perPage(),
          'to'           => $paginator->lastItem(),
          'total'        => $paginator->total(),
        ],
      ],
    ]);
  }

  /**
   * Display a listing of archived products.
   *
   * @param AdminCatalogIndexRequest $request
   * @return JsonResponse
   */
  public function archiveIndex(AdminCatalogIndexRequest $request): JsonResponse
  {
    $perPage = (int) $request->input('per_page', 10);
    $result = $this->catalogService->getCatalog($request->all(), $perPage, true);

    /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
    $paginator = $result['paginator'];

    return response()->json([
      'success' => true,
      'message' => 'Products retrieved successfully',
      'data'    => [
        'total_products' => $result['total_products'],
        'products'       => AdminCatalogItemResource::collection($paginator->items()),
        'meta'           => [
          'current_page' => $paginator->currentPage(),
          'from'         => $paginator->firstItem(),
          'last_page'    => $paginator->lastPage(),
          'per_page'     => $paginator->perPage(),
          'to'           => $paginator->lastItem(),
          'total'        => $paginator->total(),
        ],
      ],
    ]);
  }

  /**
   * Store a newly created product in catalog.
   *
   * @param AdminCatalogStoreRequest $request
   * @return JsonResponse
   */
  public function store(AdminCatalogStoreRequest $request): JsonResponse
  {
    $thumbnail = $request->file('thumbnail') ?? $request->input('thumbnail');
    $product = $this->catalogService->storeProduct($request->validated(), $thumbnail);

    return response()->json([
      'success' => true,
      'message' => 'Product created successfully',
      'data'    => (new AdminCatalogDetailResource($product))->resolve(),
    ], 201);
  }

  /**
   * Display the specified product.
   *
   * @param int|string $id
   * @return JsonResponse
   */
  public function show(int|string $id): JsonResponse
  {
    try {
      $product = $this->catalogService->getProduct($id);

      return response()->json([
        'success' => true,
        'message' => 'Product retrieved successfully',
        'data'    => (new AdminCatalogDetailResource($product))->resolve(),
      ]);
    } catch (ModelNotFoundException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Product not found.',
      ], 404);
    }
  }

  /**
   * Update the specified product in catalog.
   *
   * @param AdminCatalogUpdateRequest $request
   * @param int|string $id
   * @return JsonResponse
   */
  public function update(AdminCatalogUpdateRequest $request, int|string $id): JsonResponse
  {
    try {
      $thumbnail = $request->file('thumbnail') ?? $request->input('thumbnail');
      $product = $this->catalogService->updateProduct($id, $request->validated(), $thumbnail);

      return response()->json([
        'success' => true,
        'message' => 'Product created successfully',
        'data'    => (new AdminCatalogDetailResource($product))->resolve(),
      ]);
    } catch (ModelNotFoundException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Product not found.',
      ], 404);
    }
  }

  /**
   * Bulk remove products from catalog.
   *
   * @param AdminCatalogDeleteRequest $request
   * @return JsonResponse
   */
  public function destroy(AdminCatalogDeleteRequest $request): JsonResponse
  {
    $ids = array_map('intval', $request->input('ids', []));
    $result = $this->catalogService->deleteProducts($ids);

    return response()->json([
      'success' => true,
      'message' => 'Catalogs deleted successfully.',
      'data'    => [
        'deleted_count' => $result['deleted_count'],
        'deleted_ids'   => $result['deleted_ids'],
      ],
    ]);
  }

  /**
   * Toggle or set archive status for the specified product.
   *
   * @param int|string $productId
   * @return JsonResponse
   */
  public function archiveStatus(int|string $productId): JsonResponse
  {
    try {
      $product = $this->catalogService->archiveProduct($productId);

      return response()->json([
        'success' => true,
        'message' => 'Product archived successfully',
        'data'    => (new AdminCatalogArchiveStatusResource($product))->resolve(),
      ]);
    } catch (ModelNotFoundException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Product not found.',
      ], 404);
    }
  }

  /**
   * Fetch game details from Steam URL for auto-filling catalog form.
   *
   * @param AdminCatalogSteamDataRequest $request
   * @return JsonResponse
   */
  public function fetchSteamData(AdminCatalogSteamDataRequest $request): JsonResponse
  {
    $steamUrl = $request->getSteamUrl();
    $data = $this->catalogService->fetchSteamData($steamUrl);

    if (!$data) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to retrieve game data from Steam URL. Please verify the URL and try again.',
      ], 422);
    }

    return response()->json([
      'success' => true,
      'message' => 'Steam game data retrieved successfully',
      'data'    => $data,
    ]);
  }
}

