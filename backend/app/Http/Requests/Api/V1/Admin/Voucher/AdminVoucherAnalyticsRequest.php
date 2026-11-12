<?php

namespace App\Http\Requests\Api\V1\Admin\Voucher;

use Illuminate\Foundation\Http\FormRequest;

class AdminVoucherAnalyticsRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'period'     => ['nullable', 'string', 'in:daily,weekly,monthly'],
      'start_date' => ['nullable', 'date'],
      'end_date'   => ['nullable', 'date'],
    ];
  }
}

