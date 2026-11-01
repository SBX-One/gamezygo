<?php

namespace App\Http\Resources\Api\V1\User\Faq;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class FaqCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'message' => 'FAQs retrieved successfully',
            'data'    => FaqResource::collection($this->collection),
        ];
    }
}
