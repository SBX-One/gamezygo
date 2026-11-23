<?php

namespace App\Http\Requests\Api\V1\Admin\Category;

use Illuminate\Foundation\Http\FormRequest;

class AdminBlogSubCategoryStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];

        if (! $this->route('categoryId')) {
            $rules['category_id'] = ['required', 'integer', 'exists:blog_categories,id'];
        }

        return $rules;
    }
}
