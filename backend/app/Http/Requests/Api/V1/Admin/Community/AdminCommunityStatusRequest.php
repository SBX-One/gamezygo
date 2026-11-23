<?php

namespace App\Http\Requests\Api\V1\Admin\Community;

use Illuminate\Foundation\Http\FormRequest;

class AdminCommunityStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_active' => ['required', 'boolean'],
        ];
    }
}
