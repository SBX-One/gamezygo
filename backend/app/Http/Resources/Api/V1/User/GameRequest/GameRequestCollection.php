<?php

namespace App\Http\Resources\Api\V1\User\GameRequest;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class GameRequestCollection extends ResourceCollection
{
  protected bool $isPublic = true;

  public function __construct($resource, bool $isPublic = true)
  {
    parent::__construct($resource);
    $this->isPublic = $isPublic;
  }

  /**
   * Transform the resource collection into an array.
   *
   * @return array<int|string, mixed>
   */
  public function toArray(Request $request): array
  {
    $resourceClass = $this->isPublic
      ? PublicGameRequestResource::class
      : GameRequestResource::class;

    return [
      'success' => true,
      'message' => 'Game requests retrieved successfully',
      'data'    => $resourceClass::collection($this->collection),
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
