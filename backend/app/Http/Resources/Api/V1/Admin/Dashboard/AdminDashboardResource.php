<?php

namespace App\Http\Resources\Api\V1\Admin\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminDashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'income' => $this->resource['income'],
            'orders' => $this->resource['orders'],
            'user_active' => $this->resource['user_active'],
            'active_subs' => $this->resource['active_subs'],
            'product_performance' => $this->resource['product_performance'],
            'recent_transactions' => $this->resource['recent_transactions'],
            'game_requests' => $this->resource['game_requests'],
        ];
    }
}
