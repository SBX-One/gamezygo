<?php

namespace App\Http\Resources\Api\V1\User\ProductSpecificationRequirement;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductSpecificationRequirementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'label'       => $this->label,
            'requirement' => $this->requirement,
            'type'        => $this->type,
        ];
    }
}
