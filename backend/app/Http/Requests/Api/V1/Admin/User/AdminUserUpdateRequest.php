<?php

namespace App\Http\Requests\Api\V1\Admin\User;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'points' => ['nullable', 'integer', 'min:0'],
            'subscription_duration_adjustment' => ['nullable', 'integer'],
            'duration_adjustment' => ['nullable', 'integer'],
            'duration_months' => ['nullable', 'integer'],
            'subscription_plan_id' => ['nullable', 'integer', 'exists:subscription_plans,id'],
        ];
    }
}
