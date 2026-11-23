<?php

namespace App\Http\Requests\Api\V1\Admin\GameRequest;

use Illuminate\Foundation\Http\FormRequest;

class AdminGameRequestStatusUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'request_ids' => ['required', 'array', 'min:1'],
            'request_ids.*' => ['required', 'integer', 'exists:game_requests,id'],
            'status' => ['required', 'string'],
        ];
    }
}
