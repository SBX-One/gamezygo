<?php

namespace App\Http\Controllers\Api\V1\User\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\User\Product\ProductCollection;
use App\Http\Resources\Api\V1\User\Product\ProductCredentialResource;
use App\Http\Resources\Api\V1\User\Product\ProductDetailResource;
use App\Http\Resources\Api\V1\User\Product\ProductFilterResource;
use App\Models\Product;
use App\Services\Api\V1\User\Product\ProductService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    public function index(Request $request): ProductCollection
    {
        $filters = $request->only([
            'filter',
            'search',
            'category',
            'launcher',
            'price_range',
            'sort_by',
        ]);

        $products = $this->productService->getGuestProducts($filters);

        return new ProductCollection($products);
    }

    /**
     * Display a listing of available product filters.
     */
    public function filters(): JsonResponse
    {
        $filters = $this->productService->getProductFilters();

        return response()->json([
            'success' => true,
            'message' => 'Product filters retrieved successfully',
            'data' => (new ProductFilterResource($filters))->resolve(),
        ], 200);
    }

    public function show(Product $product): ProductDetailResource
    {
        $productDetail = $this->productService->getProductDetail($product->slug);

        return new ProductDetailResource($productDetail);
    }

    /**
     * Retrieve game credentials for a product owned by authenticated user.
     */
    public function credentials(Request $request, string $slug): JsonResponse
    {
        $user = $request->user() ?? auth('api')->user();

        try {
            $account = $this->productService->getProductCredentials($user, $slug);

            return response()->json([
                'success' => true,
                'message' => 'Game credentials retrieved successfully',
                'data' => (new ProductCredentialResource($account))->resolve(),
            ], 200);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'You do not own this game',
                'data' => null,
            ], 403);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'Product not found',
                'data' => null,
            ], 404);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
            ], 400);
        }
    }
}
