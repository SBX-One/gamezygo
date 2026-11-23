<?php

namespace App\Http\Requests\Api\V1\Admin\CustomSection;

use Illuminate\Foundation\Http\FormRequest;

class AdminCustomSectionStoreRequest extends FormRequest
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
            'name' => ['required_without:title', 'nullable', 'string', 'max:255'],
            'title' => ['required_without:name', 'nullable', 'string', 'max:255'],
        ];
    }
}
