<?php

namespace App\Http\Requests\Api\V1\Admin\User;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:active,inactive,suspended,suspend,banned'],
        ];
    }
}
