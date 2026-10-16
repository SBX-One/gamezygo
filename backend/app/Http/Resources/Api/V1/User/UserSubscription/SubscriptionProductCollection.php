<?php

namespace App\Http\Resources\Api\V1\User\UserSubscription;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class SubscriptionProductCollection extends ResourceCollection
{
  /**
   * Transform the resource collection into an array.
   *
   * @return array<int|string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'success' => true,
      'message' => 'Subscription products retrieved successfully',
      'data'    => SubscriptionProductResource::collection($this->collection),
    ];
  }

  /**
   * Customize the pagination information for the resource.
   *
   * @param Request $request
   * @param array $paginated
   * @param array $default
   * @return array
   */
  public function paginationInformation(Request $request, array $paginated, array $default): array
  {
    return [
      'meta' => [
        'current_page' => $paginated['current_page'],
        'from'         => $paginated['from'],
        'last_page'    => $paginated['last_page'],
        'per_page'     => $paginated['per_page'],
        'to'           => $paginated['to'],
        'total'        => $paginated['total'],
      ],
    ];
  }
}
