<?php

namespace App\Http\Resources\Api\V1\User\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url ?? 'https://ui-avatars.com/api/?name='.urlencode($this->name ?? 'User'),
            'phone' => $this->phone,
            'status' => $this->status,
            'total_points' => $this->total_points ?? 0,
            'total_transaction' => $this->total_transaction ?? 0,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
        ];
    }
}
