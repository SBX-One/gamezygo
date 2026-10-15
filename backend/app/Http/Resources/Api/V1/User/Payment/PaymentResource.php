<?php

namespace App\Http\Resources\Api\V1\User\Payment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
  /**
   * Additional metadata, such as snap token or redirect url.
   */
  protected ?array $gatewayData;

  public function __construct($resource, ?array $gatewayData = null)
  {
    parent::__construct($resource);
    $this->gatewayData = $gatewayData;
  }

  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    $data = [
      'id'                => $this->id,
      'order_id'          => $this->order_id,
      'payment_method'    => $this->payment_method,
      'gateway_reference' => $this->gateway_reference,
      'amount'            => (int) $this->amount,
      'status'            => $this->status,
      'expired_at'        => $this->expired_at ? $this->expired_at->toIso8601String() : null,
    ];

    if (!empty($this->gatewayData['token'])) {
      $data['snap_token'] = $this->gatewayData['token'];
    }

    if (!empty($this->gatewayData['redirect_url'])) {
      $data['redirect_url'] = $this->gatewayData['redirect_url'];
    }

    return $data;
  }
}
