<?php

namespace App\Services\Midtrans;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MidtransService
{
  protected string $serverKey;
  protected string $clientKey;
  protected bool $isProduction;

  public function __construct()
  {
    $this->serverKey = config('services.midtrans.server_key', '');
    $this->clientKey = config('services.midtrans.client_key', '');
    $this->isProduction = (bool) config('services.midtrans.is_production', false);
  }

  /**
   * Get Midtrans Snap Base URL.
   */
  public function getSnapBaseUrl(): string
  {
    return $this->isProduction
      ? 'https://app.midtrans.com/snap/v1'
      : 'https://app.sandbox.midtrans.com/snap/v1';
  }

  /**
   * Get Midtrans Core API Base URL.
   */
  public function getApiBaseUrl(): string
  {
    return $this->isProduction
      ? 'https://api.midtrans.com/v2'
      : 'https://api.sandbox.midtrans.com/v2';
  }

  /**
   * Create a Snap payment transaction on Midtrans.
   *
   * @param Order $order
   * @param Payment $payment
   * @return array|null
   */
  public function createSnapTransaction(Order $order, Payment $payment): ?array
  {
    $payload = $this->buildSnapPayload($order, $payment);

    if (empty($this->serverKey) || app()->environment('testing')) {
      return [
        'token'        => 'mock-snap-token-' . $payment->gateway_reference,
        'redirect_url' => 'https://app.sandbox.midtrans.com/snap/v2/vtweb/mock-' . $payment->gateway_reference,
      ];
    }

    try {
      $response = Http::withBasicAuth($this->serverKey, '')
        ->acceptJson()
        ->timeout(10)
        ->post($this->getSnapBaseUrl() . '/transactions', $payload);

      if ($response->successful()) {
        return $response->json();
      }

      Log::warning('Midtrans Snap Creation Failed', [
        'status' => $response->status(),
        'body'   => $response->body(),
      ]);

      return null;
    } catch (\Throwable $e) {
      Log::error('Midtrans Exception: ' . $e->getMessage());
      return null;
    }
  }

  /**
   * Check transaction status directly with Midtrans.
   *
   * @param string $orderIdOrReference
   * @return array|null
   */
  public function checkTransactionStatus(string $orderIdOrReference): ?array
  {
    if (empty($this->serverKey) || app()->environment('testing')) {
      return null;
    }

    try {
      $response = Http::withBasicAuth($this->serverKey, '')
        ->acceptJson()
        ->timeout(10)
        ->get($this->getApiBaseUrl() . "/{$orderIdOrReference}/status");

      if ($response->successful()) {
        return $response->json();
      }

      return null;
    } catch (\Throwable $e) {
      Log::error('Midtrans Status Check Exception: ' . $e->getMessage());
      return null;
    }
  }

  /**
   * Build comprehensive Snap transaction payload including customer details,
   * shipping/billing details, and product item details.
   *
   * @param Order $order
   * @param Payment $payment
   * @return array
   */
  public function buildSnapPayload(Order $order, Payment $payment): array
  {
    $order->loadMissing(['user', 'items.purchasable', 'voucher']);

    $user = $order->user;
    $fullName = trim($user?->name ?? 'Customer');
    $nameParts = explode(' ', $fullName, 2);
    $firstName = $nameParts[0] ?? 'Customer';
    $lastName = $nameParts[1] ?? '';

    // Customer & Address Details (Shipping & Billing)
    $customerDetails = [
      'first_name'       => $firstName,
      'last_name'        => $lastName,
      'email'            => $user?->email ?? 'customer@example.com',
      'phone'            => $user?->phone ?? '081234567890',
      'billing_address'  => [
        'first_name'   => $firstName,
        'last_name'    => $lastName,
        'email'        => $user?->email ?? 'customer@example.com',
        'phone'        => $user?->phone ?? '081234567890',
        'address'      => 'Digital Goods Delivery',
        'city'         => 'Jakarta',
        'postal_code'  => '10110',
        'country_code' => 'IDN',
      ],
      'shipping_address' => [
        'first_name'   => $firstName,
        'last_name'    => $lastName,
        'email'        => $user?->email ?? 'customer@example.com',
        'phone'        => $user?->phone ?? '081234567890',
        'address'      => 'Digital Goods Delivery',
        'city'         => 'Jakarta',
        'postal_code'  => '10110',
        'country_code' => 'IDN',
      ],
    ];

    // Product & Item Details
    $itemDetails = [];
    foreach ($order->items as $item) {
      $purchasable = $item->purchasable;
      $itemName = $purchasable?->name ?? 'Game Product';

      $itemDetails[] = [
        'id'            => substr('ITEM-' . $item->id, 0, 50),
        'price'         => (int) $item->price,
        'quantity'      => 1,
        'name'          => substr($itemName, 0, 50),
        'category'      => $purchasable instanceof \App\Models\Product ? 'Game' : 'Subscription',
        'merchant_name' => 'Gamezygo',
      ];
    }

    // Include voucher discount as negative line item to keep sum equal to gross_amount
    if ((int) $order->discount_amount > 0) {
      $voucherCode = $order->voucher?->code ?? 'VOUCHER';
      $itemDetails[] = [
        'id'            => substr('DISCOUNT-' . $voucherCode, 0, 50),
        'price'         => -((int) $order->discount_amount),
        'quantity'      => 1,
        'name'          => substr("Discount ({$voucherCode})", 0, 50),
        'category'      => 'Discount',
        'merchant_name' => 'Gamezygo',
      ];
    }

    // Ensure sum of item_details matches gross_amount (strict Midtrans rule)
    $itemsSum = array_reduce($itemDetails, fn ($sum, $item) => $sum + ($item['price'] * $item['quantity']), 0);
    if ($itemsSum !== (int) $payment->amount) {
      $itemDetails = [
        [
          'id'            => substr($payment->gateway_reference, 0, 50),
          'price'         => (int) $payment->amount,
          'quantity'      => 1,
          'name'          => substr('Order ' . $order->order_code, 0, 50),
          'category'      => 'Game',
          'merchant_name' => 'Gamezygo',
        ],
      ];
    }

    return [
      'transaction_details' => [
        'order_id'     => $payment->gateway_reference,
        'gross_amount' => (int) $payment->amount,
      ],
      'customer_details'    => $customerDetails,
      'item_details'        => $itemDetails,
    ];
  }
}
