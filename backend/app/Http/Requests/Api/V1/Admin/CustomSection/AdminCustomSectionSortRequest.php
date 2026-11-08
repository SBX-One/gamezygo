<?php

namespace App\Http\Requests\Api\V1\Admin\CustomSection;

use Illuminate\Foundation\Http\FormRequest;

class AdminCustomSectionSortRequest extends FormRequest
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
      'section_ids'   => ['required', 'array', 'min:1'],
      'section_ids.*' => ['integer', 'exists:custom_sections,id'],
    ];
  }
}

