<?php

namespace App\Http\Requests\Api\V1\Admin\Category;

use Illuminate\Foundation\Http\FormRequest;

class AdminProductCategoryUpdateRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'name'        => ['sometimes', 'required', 'string', 'max:255'],
      'description' => ['nullable', 'string', 'max:1000'],
    ];
  }
}

