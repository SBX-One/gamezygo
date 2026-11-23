<?php

namespace App\Http\Requests\Api\V1\Admin\Announcement;

use Illuminate\Foundation\Http\FormRequest;

class AdminAnnouncementIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string'],
            'is_publish' => ['nullable', 'string', 'in:true,false,1,0'],
            'sort_by' => ['nullable', 'string', 'in:sort,latest,oldest'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
