<?php

namespace App\Http\Resources\Api\V1\Admin\Revenue;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminRevenueResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'total_revenue'       => $this->resource['total_revenue'],
      'average_order_value' => $this->resource['average_order_value'],
      'total_orders'        => $this->resource['total_orders'],
      'voucher_burn'        => $this->resource['voucher_burn'],
      'revenue_chart'       => $this->resource['revenue_chart'],
      'income_spread'       => $this->resource['income_spread'],
      'products'            => $this->resource['products'],
      'bundle_statistics'   => $this->resource['bundle_statistics'],
      'vouchers'            => $this->resource['vouchers'],
    ];
  }
}

