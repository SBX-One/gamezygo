<?php

namespace App\Http\Resources\Api\V1\Admin\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminRecentTransactionsResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'today_transactions' => $this->resource['today_transactions'],
      'week_transactions'  => $this->resource['week_transactions'],
      'month_transactions' => $this->resource['month_transactions'],
      'transactins'        => $this->resource['transactins'],
    ];
  }
}

