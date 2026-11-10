<?php

namespace App\Http\Requests\Api\V1\Admin\Auth;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class AdminLoginRequest extends FormRequest
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
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'email'    => ['required', 'string', 'email'],
      'password' => ['required', 'string'],
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
      'email.required'    => 'Email address is required.',
      'email.email'       => 'Please provide a valid email address.',
      'password.required' => 'Password is required.',
    ];
  }

  /**
   * Handle a failed validation attempt and format as JSON.
   */
  protected function failedValidation(Validator $validator): void
  {
    throw new HttpResponseException(response()->json([
      'success' => false,
      'message' => 'Validation error',
      'errors'  => $validator->errors(),
    ], 422));
  }
}

