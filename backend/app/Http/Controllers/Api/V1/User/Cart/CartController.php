<?php

namespace App\Http\Controllers\Api\V1\User\Cart;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\Cart\AddToCartRequest;
use App\Http\Requests\Api\V1\User\Cart\RemoveFromCartRequest;
use App\Http\Resources\Api\V1\User\Cart\AddToCartResource;
use App\Http\Resources\Api\V1\User\Cart\CartResource;
use App\Services\Api\V1\User\Cart\CartService;
use DomainException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class CartController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {}

    /**
     * Display all items in the user's cart along with summary calculations.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user() ?? auth('api')->user();

        $cartSummary = $this->cartService->getCartSummary($user);

        return response()->json([
            'success' => true,
            'message' => 'Cart retrieved successfully',
            'data' => (new CartResource($cartSummary))->resolve(),
        ], 200);
    }

    /**
     * Add a product to the user's cart.
     */
    public function store(AddToCartRequest $request): JsonResponse
    {
        $user = $request->user() ?? auth('api')->user();
        $productId = $request->validated('product_id');
        $productSlug = $request->validated('product_slug');

        try {
            $result = $this->cartService->addItemToCart($user, $productId, $productSlug);

            return response()->json([
                'success' => true,
                'message' => 'Product added to cart successfully',
                'data' => (new AddToCartResource($result))->resolve(),
            ], 200);
        } catch (DomainException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
            ], 422);
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

    /**
     * Remove a product from the user's cart.
     */
    public function destroy(RemoveFromCartRequest $request, int|string|null $productId = null): JsonResponse
    {
        $user = $request->user() ?? auth('api')->user();
        $targetId = $productId ?? $request->input('product_id');
        $targetSlug = $request->input('product_slug');

        if (empty($targetId) && empty($targetSlug)) {
            // If neither is provided, clear the entire cart
            $cartSummary = $this->cartService->clearUserCart($user);

            return response()->json([
                'success' => true,
                'message' => 'Cart cleared successfully',
                'data' => (new CartResource($cartSummary))->resolve(),
            ], 200);
        }

        try {
            $cartSummary = $this->cartService->removeItemFromCart($user, $targetId, $targetSlug);

            return response()->json([
                'success' => true,
                'message' => 'Product removed from cart successfully',
                'data' => (new CartResource($cartSummary))->resolve(),
            ], 200);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found in cart',
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

    /**
     * Clear all items in the user's cart.
     */
    public function clear(Request $request): JsonResponse
    {
        $user = $request->user() ?? auth('api')->user();

        $cartSummary = $this->cartService->clearUserCart($user);

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully',
            'data' => (new CartResource($cartSummary))->resolve(),
        ], 200);
    }
}
