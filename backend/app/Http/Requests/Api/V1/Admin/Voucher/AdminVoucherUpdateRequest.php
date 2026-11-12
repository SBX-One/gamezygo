<?php

namespace App\Http\Requests\Api\V1\Admin\Voucher;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminVoucherUpdateRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    $voucherId = $this->route('voucherId') ?? $this->route('voucher');

    return [
      'name'                 => ['sometimes', 'string', 'max:255'],
      'code'                 => ['sometimes', 'string', 'max:50', Rule::unique('vouchers', 'code')->ignore($voucherId)],
      'discount_type'        => ['sometimes', 'string', 'in:percent,percentage,fixed'],
      'discount_value'       => ['sometimes', 'numeric', 'min:0'],
      'max_discount'         => ['nullable', 'numeric', 'min:0'],
      'min_purchase'         => ['nullable', 'numeric', 'min:0'],
      'applies_to'           => ['nullable', 'string', 'in:all,one_time,subscription'],
      'target_type'          => ['nullable', 'string', 'in:all_users,specific_users'],
      'product_scope'        => ['nullable', 'string', 'in:all_products,specific_products'],
      'product_ids'          => ['nullable', 'array'],
      'product_ids.*'        => ['integer', 'exists:products,id'],
      'user_ids'             => ['nullable', 'array'],
      'user_ids.*'           => ['integer', 'exists:users,id'],
      'slot'                 => ['nullable', 'integer', 'min:0'],
      'usage_limit_per_user' => ['nullable', 'integer', 'min:0'],
      'started_at'           => ['nullable', 'date'],
      'expired_at'           => ['nullable', 'date'],
      'status'               => ['nullable', 'string'],
      'is_active'            => ['nullable', 'boolean'],
    ];
  }
}

