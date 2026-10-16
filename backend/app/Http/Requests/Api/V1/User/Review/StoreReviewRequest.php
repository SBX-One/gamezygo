<?php

namespace App\Http\Requests\Api\V1\User\Review;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Prepare data before validation.
   */
  protected function prepareForValidation(): void
  {
    if (!$this->has('product_id') && $this->route('product')) {
      $product = $this->route('product');
      $this->merge([
        'product_id' => is_object($product) ? $product->id : $product,
      ]);
    }

    if (!$this->has('order_item_id') && $this->route('orderItem')) {
      $orderItem = $this->route('orderItem');
      $this->merge([
        'order_item_id' => is_object($orderItem) ? $orderItem->id : $orderItem,
      ]);
    }
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, mixed>
   */
  public function rules(): array
  {
    return [
      'product_id'    => ['nullable', 'integer', 'exists:products,id'],
      'order_item_id' => ['nullable', 'integer', 'exists:order_items,id'],
      'rating'        => ['required', 'integer', 'min:1', 'max:5'],
      'review'        => ['required', 'string', 'min:3', 'max:2000'],
      'images'        => ['nullable', 'array', 'max:10'],
      'images.*'      => ['file', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
    ];
  }
}
