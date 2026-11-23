<?php

namespace App\Http\Requests\Api\V1\Admin\Blog;

use Illuminate\Foundation\Http\FormRequest;

class AdminBlogUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('category_ids') && is_array($this->category_ids)) {
            $cleaned = array_values(array_filter($this->category_ids, fn ($val) => $val !== '' && $val !== null));
            $this->merge(['category_ids' => $cleaned]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'content' => ['sometimes', 'required', 'string'],
            'banner_file' => ['nullable'],
            'status' => ['sometimes', 'required', 'string', 'in:draft,published,archived'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:blog_categories,id'],
            'category_id' => ['nullable', 'integer', 'exists:blog_categories,id'],
        ];
    }
}
