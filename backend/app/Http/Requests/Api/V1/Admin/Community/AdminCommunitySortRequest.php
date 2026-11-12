<?php

namespace App\Http\Requests\Api\V1\Admin\Community;

use Illuminate\Foundation\Http\FormRequest;

class AdminCommunitySortRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'community_ids'   => ['required', 'array', 'min:1'],
      'community_ids.*' => ['required', 'integer', 'exists:communities,id'],
    ];
  }
}

