<?php

namespace App\Http\Controllers\Api\V1\User\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\User\Product\ProductCollection;
use App\Http\Resources\Api\V1\User\Product\ProductDetailResource;
use App\Models\Product;
use App\Services\Api\V1\User\Product\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {
    }

    
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

    public function show(Product $product): ProductDetailResource
    {
        $productDetail = $this->productService->getProductDetail($product->slug);

        return new ProductDetailResource($productDetail);
    }
}
