<?php

namespace App\Http\Requests\Api\V1\Admin\Announcement;

use Illuminate\Foundation\Http\FormRequest;

class AdminAnnouncementPublishRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_publish' => ['required', 'boolean'],
        ];
    }
}
