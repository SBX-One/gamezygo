<?php

namespace App\Http\Requests\Api\V1\Admin\Blog;

use Illuminate\Foundation\Http\FormRequest;

class AdminBlogIndexRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, mixed>
   */
  public function rules(): array
  {
    return [
      'search'      => ['nullable', 'string'],
      'status'      => ['nullable', 'string', 'in:draft,published,archived'],
      'category_id' => ['nullable', 'integer', 'exists:blog_categories,id'],
      'page'        => ['nullable', 'integer', 'min:1'],
      'per_page'    => ['nullable', 'integer', 'min:1', 'max:100'],
    ];
  }
}

