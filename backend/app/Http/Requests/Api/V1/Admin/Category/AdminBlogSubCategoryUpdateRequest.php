<?php

namespace App\Http\Requests\Api\V1\Admin\Category;

use Illuminate\Foundation\Http\FormRequest;

class AdminBlogSubCategoryUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:blog_categories,id'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
