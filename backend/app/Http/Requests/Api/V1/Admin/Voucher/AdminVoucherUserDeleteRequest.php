<?php

namespace App\Http\Requests\Api\V1\Admin\Voucher;

use Illuminate\Foundation\Http\FormRequest;

class AdminVoucherUserDeleteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_ids' => ['required', 'array', 'min:1'],
            'user_ids.*' => ['required', 'integer'],
        ];
    }
}
