<?php

namespace App\Http\Requests\Api\V1\Admin\Review;

use Illuminate\Foundation\Http\FormRequest;

class AdminReviewIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rating' => ['nullable'],
            'star' => ['nullable'],
            'status' => ['nullable', 'string', 'in:pending,approved,rejected,archived'],
            'search' => ['nullable', 'string', 'max:255'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
            'sort_by' => ['nullable', 'string', 'in:latest,newest,oldest,username_asc,username_desc,name_asc,name_desc,a-z,z-a,email_asc,email_desc,rating_desc,rating_asc,highest_rating,lowest_rating,created_at_asc,created_at_desc'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
