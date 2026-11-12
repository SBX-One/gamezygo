<?php

namespace App\Http\Requests\Api\V1\Admin\Review;

use Illuminate\Foundation\Http\FormRequest;

class AdminReviewStatusRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'status' => ['required', 'string', 'in:pending,approved,rejected,archived'],
    ];
  }
}

