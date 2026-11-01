<?php

namespace App\Http\Resources\Api\V1\User\Product;

use App\Http\Resources\Api\V1\User\GenreCategory\GenreCategoryResource;
use App\Http\Resources\Api\V1\User\ProductInstruction\ProductInstructionResource;
use App\Http\Resources\Api\V1\User\ProductLauncherCategory\ProductLauncherCategoryResource;
use App\Http\Resources\Api\V1\User\ProductSpecificationRequirement\ProductSpecificationRequirementResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                         => $this->id,
            'name'                       => $this->name,
            'description'                => $this->description,
            'price'                      => $this->price,
            'price_discount'             => $this->discount_price,
            'discount'                   => $this->discount,
            'steam_url'                  => $this->steam_url,
            'status'                     => $this->status,
            'rating'                     => $this->reviews_avg_rating ? (float) number_format((float) $this->reviews_avg_rating, 1) : 0.0,
            'categories'                 => GenreCategoryResource::collection(
                $this->whenLoaded('genreCategories')
            ),
            'launcher_category'          => new ProductLauncherCategoryResource(
                $this->whenLoaded('productLauncherCategory')
            ),
            'specification_requirements' => ProductSpecificationRequirementResource::collection(
                $this->whenLoaded('specificationRequirements')
            ),
            'product_instruction'        => new ProductInstructionResource(
                $this->whenLoaded('productInstruction')
            ),
        ];
    }

    /**
     * Customize the response for the resource.
     *
     * @param Request $request
     * @param JsonResponse $response
     * @return void
     */
    public function withResponse(Request $request, JsonResponse $response): void
    {
        $response->setData([
            'success' => true,
            'message' => 'Product retrieved successfully',
            'data'    => $this->toArray($request),
        ]);
    }
}
