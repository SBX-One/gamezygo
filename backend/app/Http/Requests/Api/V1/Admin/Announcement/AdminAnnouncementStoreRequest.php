<?php

namespace App\Http\Requests\Api\V1\Admin\Announcement;

use Illuminate\Foundation\Http\FormRequest;

class AdminAnnouncementStoreRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'banner_file' => ['required'],
      'link'        => ['nullable', 'string', 'max:500'],
      'is_publish'  => ['nullable', 'boolean'],
      'sort'        => ['nullable', 'integer', 'min:0'],
    ];
  }
}

