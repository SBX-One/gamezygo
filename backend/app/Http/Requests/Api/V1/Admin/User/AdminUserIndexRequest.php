<?php

namespace App\Http\Requests\Api\V1\Admin\User;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subscription_plan_id' => ['nullable', 'integer'],
            'status' => ['nullable', 'string', 'in:active,inactive,suspended,suspend,banned'],
            'login_type' => ['nullable', 'string', 'in:google,email'],
            'min_points' => ['nullable', 'integer', 'min:0'],
            'max_points' => ['nullable', 'integer', 'min:0'],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'in:latest,oldest,points_high,points_low,username_asc,username_desc,email_asc,email_desc'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
