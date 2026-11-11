<?php

namespace App\Repositories\Api\V1\Admin\GameRequest;

use App\Models\GameRequest;
use App\Repositories\Contracts\Api\V1\Admin\GameRequest\AdminGameRequestRepositoryInterface;

class AdminGameRequestRepository implements AdminGameRequestRepositoryInterface
{
  /**
   * Get list of pinned and requested games with pagination and filters.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getGameRequests(array $filters): array
  {
    $status = $filters['status'] ?? null;
    $sortBy = $filters['sort_by'] ?? 'most_requested';
    $perPage = (int) ($filters['per_page'] ?? 10);
    $page = (int) ($filters['page'] ?? 1);

    // 1. Pinned games query
    $pinnedQuery = GameRequest::query()->where('is_pinned', true);
    if ($status && $status !== 'all') {
      $pinnedQuery->where('status', $status);
    }
    $pinnedItems = $pinnedQuery
      ->orderByDesc('request_count')
      ->orderByDesc('created_at')
      ->get();

    $pinnedData = $pinnedItems->map(function ($item) {
      return [
        'id'                 => $item->id,
        'product_name'       => $item->product_name ?? $item->name,
        'total_requests'     => (int) ($item->request_count ?? 1),
        'first_requested_at' => $item->created_at ? $item->created_at->toISOString() : null,
        'steam_url'          => $item->steam_url,
        'status'             => $item->status,
        'is_pinned'          => (bool) $item->is_pinned,
      ];
    })->values()->all();

    // 2. Unpinned requested games query
    $requestedQuery = GameRequest::query()->where('is_pinned', false);
    if ($status && $status !== 'all') {
      $requestedQuery->where('status', $status);
    }

    if ($sortBy === 'latest') {
      $requestedQuery->orderByDesc('created_at');
    } elseif ($sortBy === 'oldest') {
      $requestedQuery->orderBy('created_at');
    } else {
      $requestedQuery->orderByDesc('request_count')->orderByDesc('created_at');
    }

    $paginator = $requestedQuery->paginate($perPage, ['*'], 'page', $page);

    $requestedData = collect($paginator->items())->map(function ($item) {
      return [
        'id'                 => $item->id,
        'product_name'       => $item->product_name ?? $item->name,
        'total_requests'     => (int) ($item->request_count ?? 1),
        'first_requested_at' => $item->created_at ? $item->created_at->toISOString() : null,
        'steam_url'          => $item->steam_url,
        'status'             => $item->status,
        'is_pinned'          => (bool) $item->is_pinned,
      ];
    })->values()->all();

    $totalRequestsCount = count($pinnedData) + $paginator->total();

    return [
      'total_requests'  => $totalRequestsCount,
      'pinned_games'    => [
        'total' => count($pinnedData),
        'items' => $pinnedData,
      ],
      'requested_games' => [
        'total' => $paginator->total(),
        'items' => $requestedData,
        'meta'  => [
          'current_page' => $paginator->currentPage(),
          'from'         => $paginator->firstItem(),
          'last_page'    => $paginator->lastPage(),
          'per_page'     => $paginator->perPage(),
          'to'           => $paginator->lastItem(),
          'total'        => $paginator->total(),
        ],
      ],
    ];
  }

  /**
   * Get single game request detail by ID.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function getGameRequestById(int $id): array
  {
    $item = GameRequest::findOrFail($id);

    return [
      'id'                 => $item->id,
      'product_name'       => $item->product_name ?? $item->name,
      'steam_url'          => $item->steam_url,
      'total_requests'     => (int) ($item->request_count ?? 1),
      'status'             => $item->status,
      'is_pinned'          => (bool) $item->is_pinned,
      'first_requested_at' => $item->created_at ? $item->created_at->toISOString() : null,
      'last_requested_at'  => $item->last_requested_at ? $item->last_requested_at->toISOString() : ($item->updated_at ? $item->updated_at->toISOString() : null),
      'reviewed_at'        => $item->reviewed_at ? $item->reviewed_at->toISOString() : null,
      'product_id'         => $item->product_id,
    ];
  }

  /**
   * Toggle pin status for a game request.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function togglePin(int $id): array
  {
    $item = GameRequest::findOrFail($id);
    $item->is_pinned = !$item->is_pinned;
    $item->save();

    return [
      'item' => [
        'id'           => $item->id,
        'product_name' => $item->product_name ?? $item->name,
        'status'       => $item->status,
        'is_pinned'    => (bool) $item->is_pinned,
      ],
      'is_pinned' => (bool) $item->is_pinned,
    ];
  }

  /**
   * Bulk update status for multiple game requests.
   *
   * @param array<int> $requestIds
   * @param string $status
   * @return array<string, mixed>
   */
  public function updateStatus(array $requestIds, string $status): array
  {
    $updateData = ['status' => $status];
    if (in_array(strtolower($status), ['accepted', 'reviewed'])) {
      $updateData['reviewed_at'] = now();
    }

    GameRequest::whereIn('id', $requestIds)->update($updateData);

    return [
      'total_updated' => count($requestIds),
      'status'        => $status,
      'updated_ids'   => array_map('intval', array_values($requestIds)),
    ];
  }
}

