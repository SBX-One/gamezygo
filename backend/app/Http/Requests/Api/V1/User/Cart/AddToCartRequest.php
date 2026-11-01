<?php

namespace App\Http\Requests\Api\V1\User\Cart;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class AddToCartRequest extends FormRequest
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
      'product_id'   => ['required_without:product_slug', 'nullable', 'integer', 'exists:products,id'],
      'product_slug' => ['required_without:product_id', 'nullable', 'string', 'exists:products,slug'],
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
      'product_id.required_without'   => 'Product ID or product slug is required.',
      'product_id.exists'             => 'Product not found.',
      'product_slug.required_without' => 'Product ID or product slug is required.',
      'product_slug.exists'           => 'Product not found.',
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
      'errors'  => $validator->errors(),
    ], 422));
  }
}
