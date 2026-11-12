<?php

namespace App\Http\Requests\Api\V1\Admin\Category;

use Illuminate\Foundation\Http\FormRequest;

class AdminProductSubCategoryIndexRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'search'      => ['nullable', 'string', 'max:255'],
      'category_id' => ['nullable', 'integer', 'exists:genre_categories,id'],
      'page'        => ['nullable', 'integer', 'min:1'],
      'per_page'    => ['nullable', 'integer', 'min:1', 'max:100'],
    ];
  }
}

