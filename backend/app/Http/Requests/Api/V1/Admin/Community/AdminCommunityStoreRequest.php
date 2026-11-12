<?php

namespace App\Http\Requests\Api\V1\Admin\Community;

use Illuminate\Foundation\Http\FormRequest;

class AdminCommunityStoreRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'name'         => ['required', 'string', 'max:255'],
      'link'         => ['nullable', 'string', 'max:500'],
      'tag_ids'      => ['nullable', 'array'],
      'tag_ids.*'    => ['integer', 'exists:community_tags,id'],
      'banner_file'  => ['nullable'],
      'is_active'    => ['nullable', 'boolean'],
      'order_number' => ['nullable', 'integer', 'min:0'],
    ];
  }
}

