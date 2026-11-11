<?php

namespace App\Http\Requests\Api\V1\Admin\Faq;

use Illuminate\Foundation\Http\FormRequest;

class AdminFaqUpdateRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'question'     => ['sometimes', 'string'],
      'answer'       => ['sometimes', 'string'],
      'page'         => ['nullable', 'string', 'max:100'],
      'order_number' => ['nullable', 'integer', 'min:0'],
      'is_active'    => ['nullable', 'boolean'],
    ];
  }
}

