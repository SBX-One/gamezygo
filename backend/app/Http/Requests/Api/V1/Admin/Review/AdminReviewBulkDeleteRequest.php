<?php

namespace App\Http\Requests\Api\V1\Admin\Review;

use Illuminate\Foundation\Http\FormRequest;

class AdminReviewBulkDeleteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'review_ids' => ['required', 'array', 'min:1'],
            'review_ids.*' => ['integer', 'exists:reviews,id'],
        ];
    }
}
