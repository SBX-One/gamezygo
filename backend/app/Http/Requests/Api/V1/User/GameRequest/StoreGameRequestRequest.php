<?php

namespace App\Http\Requests\Api\V1\User\GameRequest;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreGameRequestRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'steam_url' => [
                'required',
                'string',
                'regex:#^https?://store\.steampowered\.com/app/\d+#i',
            ],
            'note' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'steam_url.required' => 'Steam URL is required.',
            'steam_url.regex' => 'The steam url format is invalid. It must be a valid Steam store URL (e.g. https://store.steampowered.com/app/123456).',
        ];
    }

    /**
     * Handle failed validation response.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => $validator->errors()->first() ?: 'Validation error',
            'errors' => $validator->errors(),
        ], 422));
    }
}
