<?php

namespace App\Http\Requests\Api\V1\User\Order;

use Illuminate\Contracts\Validation\ValidationRule;
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'item_type' => ['required', 'string', 'in:product,subscription,cart'],
            'product_id' => ['required_if:item_type,product', 'nullable', 'integer', 'exists:products,id'],
            'subscription_plan_id' => ['required_if:item_type,subscription', 'nullable', 'integer', 'exists:subscription_plans,id'],
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
            'item_type.required' => 'Item type wajib diisi.',
            'item_type.in' => 'Item type harus berupa product, subscription, atau cart.',
            'product_id.required_if' => 'Product ID wajib diisi untuk item product.',
            'product_id.exists' => 'Product tidak ditemukan.',
            'subscription_plan_id.required_if' => 'Subscription Plan ID wajib diisi untuk item subscription.',
            'subscription_plan_id.exists' => 'Paket subscription tidak ditemukan.',
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
