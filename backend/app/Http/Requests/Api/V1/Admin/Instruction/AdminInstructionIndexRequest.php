<?php

namespace App\Http\Requests\Api\V1\Admin\Instruction;

use Illuminate\Foundation\Http\FormRequest;

class AdminInstructionIndexRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'search'   => ['nullable', 'string'],
      'is_used'  => ['nullable', 'string', 'in:true,false,1,0'],
      'sort_by'  => ['nullable', 'string', 'in:latest,oldest,most_used,title'],
      'page'     => ['nullable', 'integer', 'min:1'],
      'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
    ];
  }
}

