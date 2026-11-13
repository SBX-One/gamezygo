<?php

namespace App\Http\Requests\Api\V1\Admin\User;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserTransactionIndexRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'status'   => ['nullable', 'string'],
      'sort_by'  => ['nullable', 'string', 'in:latest,oldest,amount_high,amount_low'],
      'page'     => ['nullable', 'integer', 'min:1'],
      'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
    ];
  }
}
