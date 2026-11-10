<?php

namespace App\Http\Requests\Api\V1\Admin\Subscription;

use Illuminate\Foundation\Http\FormRequest;

class AdminSubscriptionFeatureSyncRequest extends FormRequest
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
      'benefits'               => ['required', 'array', 'min:1'],
      'benefits.*.id'          => ['nullable', 'integer'],
      'benefits.*.description' => ['required', 'string', 'max:255'],
    ];
  }
}

