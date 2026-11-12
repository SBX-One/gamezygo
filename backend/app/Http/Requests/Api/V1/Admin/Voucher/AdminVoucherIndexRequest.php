<?php

namespace App\Http\Requests\Api\V1\Admin\Voucher;

use Illuminate\Foundation\Http\FormRequest;

class AdminVoucherIndexRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'search'        => ['nullable', 'string'],
      'status'        => ['nullable', 'string'],
      'discount_type' => ['nullable', 'string', 'in:percent,percentage,fixed'],
      'sort_by'       => ['nullable', 'string', 'in:latest,oldest,most_used,highest_discount'],
      'page'          => ['nullable', 'integer', 'min:1'],
      'per_page'      => ['nullable', 'integer', 'min:1', 'max:100'],
    ];
  }
}

