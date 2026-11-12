<?php

namespace App\Http\Requests\Api\V1\Admin\Voucher;

use Illuminate\Foundation\Http\FormRequest;

class AdminVoucherProductStoreRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'product_ids'   => ['required', 'array', 'min:1'],
      'product_ids.*' => ['required', 'integer', 'exists:products,id'],
    ];
  }
}

