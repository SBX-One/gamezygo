<?php

namespace App\Http\Requests\Api\V1\Admin\Voucher;

use Illuminate\Foundation\Http\FormRequest;

class AdminVoucherBulkDeleteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:vouchers,id'],
        ];
    }
}
