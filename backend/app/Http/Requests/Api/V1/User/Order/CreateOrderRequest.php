<?php

namespace App\Http\Requests\Api\V1\User\Order;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateOrderRequest extends FormRequest
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
      'item_type'  => ['required', 'string', 'in:product'],
      'product_id' => ['required', 'integer', 'exists:products,id'],
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
      'item_type.required'  => 'Item type wajib diisi.',
      'item_type.in'        => 'Item type yang didukung saat ini hanya product.',
      'product_id.required' => 'Product ID wajib diisi.',
      'product_id.exists'   => 'Product tidak ditemukan.',
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
