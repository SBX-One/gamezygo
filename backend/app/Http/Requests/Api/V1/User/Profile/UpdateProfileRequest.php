<?php

namespace App\Http\Requests\Api\V1\User\Profile;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProfileRequest extends FormRequest
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
        $hasFile = $this->hasFile('avatar') || $this->hasFile('avatar_url') || $this->hasFile('profile_url');

        $rules = [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'regex:/^(\+?[0-9]{8,16})$/', 'max:20'],
            'avatar_url' => ['nullable', 'string', 'max:1000'],
            'profile_url' => ['nullable', 'string', 'max:1000'],
        ];

        if ($hasFile) {
            $rules['avatar'] = ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:5120'];
            $rules['avatar_url'] = ['nullable'];
            $rules['profile_url'] = ['nullable'];
        } else {
            $rules['avatar'] = ['nullable', 'string', 'max:1000'];
        }

        return $rules;
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name cannot be empty.',
            'name.string' => 'Name must be a valid string.',
            'name.max' => 'Name may not exceed 255 characters.',
            'avatar.image' => 'Avatar must be an image file (jpeg, png, jpg, webp, gif).',
            'avatar.mimes' => 'Avatar must be a file of type: jpeg, png, jpg, webp, gif.',
            'avatar.max' => 'Avatar image size may not exceed 5MB.',
            'phone.regex' => 'The phone number format is invalid. Please enter a valid phone number (e.g. 081234567890 or +6281234567890).',
            'phone.max' => 'Phone number may not exceed 20 characters.',
        ];
    }

    /**
     * Handle failed validation response.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors(),
        ], 422));
    }
}
