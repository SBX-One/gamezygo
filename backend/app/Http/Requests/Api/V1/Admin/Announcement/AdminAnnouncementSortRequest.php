<?php

namespace App\Http\Requests\Api\V1\Admin\Announcement;

use Illuminate\Foundation\Http\FormRequest;

class AdminAnnouncementSortRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'announcement_ids' => ['required', 'array', 'min:1'],
            'announcement_ids.*' => ['required', 'integer', 'exists:announcements,id'],
        ];
    }
}
