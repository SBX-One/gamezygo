<?php

namespace App\Http\Requests\Api\V1\Admin\Faq;

use Illuminate\Foundation\Http\FormRequest;

class AdminFaqIndexRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'search'    => ['nullable', 'string'],
      'page_name' => ['nullable', 'string'],
      'page'      => ['nullable', 'integer', 'min:1'],
      'is_active' => ['nullable', 'string', 'in:true,false,1,0'],
      'sort_by'   => ['nullable', 'string', 'in:order_number,latest,oldest'],
      'per_page'  => ['nullable', 'integer', 'min:1', 'max:100'],
    ];
  }
}

