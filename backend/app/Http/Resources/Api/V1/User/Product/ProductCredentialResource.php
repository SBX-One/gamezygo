<?php

namespace App\Http\Resources\Api\V1\User\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductCredentialResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    $username = $this->username;
    try {
      $username = decrypt($this->username);
    } catch (\Throwable) {
    }

    $password = $this->password;
    try {
      $password = decrypt($this->password);
    } catch (\Throwable) {
    }

    $accessToken = $this->access_token ?? null;
    if ($accessToken) {
      try {
        $accessToken = decrypt($accessToken);
      } catch (\Throwable) {
      }
    }

    return [
      'id'           => $this->id,
      'username'     => $username,
      'password'     => $password,
      'access_token' => $accessToken,
    ];
  }
}
