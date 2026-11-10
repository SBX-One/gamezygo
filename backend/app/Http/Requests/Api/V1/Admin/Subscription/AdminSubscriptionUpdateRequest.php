<?php

namespace App\Http\Requests\Api\V1\Admin\Subscription;

use Illuminate\Foundation\Http\FormRequest;

class AdminSubscriptionUpdateRequest extends FormRequest
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
      'name'            => ['sometimes', 'required', 'string', 'max:255'],
      'price'           => ['sometimes', 'required', 'numeric', 'min:0'],
      'duration_months' => ['sometimes', 'required', 'integer', 'min:1'],
      'duration_days'   => ['nullable', 'integer', 'min:1'],
    ];
  }
}

