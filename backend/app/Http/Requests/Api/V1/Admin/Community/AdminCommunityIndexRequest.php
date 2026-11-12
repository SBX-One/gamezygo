<?php

namespace App\Http\Requests\Api\V1\Admin\Community;

use Illuminate\Foundation\Http\FormRequest;

class AdminCommunityIndexRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'search'    => ['nullable', 'string'],
      'tag_ids'   => ['nullable', 'array'],
      'tag_ids.*' => ['integer', 'exists:community_tags,id'],
      'is_active' => ['nullable', 'string', 'in:true,false,1,0'],
      'sort_by'   => ['nullable', 'string', 'in:position,order_number,latest,oldest,name'],
      'page'      => ['nullable', 'integer', 'min:1'],
      'per_page'  => ['nullable', 'integer', 'min:1', 'max:100'],
    ];
  }
}

