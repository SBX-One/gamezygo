<?php

namespace App\Http\Requests\Api\V1\Admin\Faq;

use Illuminate\Foundation\Http\FormRequest;

class AdminFaqSortRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'orders' => ['required', 'array', 'min:1'],
            'orders.*.id' => ['required', 'integer', 'exists:faqs,id'],
            'orders.*.order_number' => ['required', 'integer', 'min:0'],
        ];
    }
}
