<?php

namespace App\Http\Requests\Api\V1\Admin\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class AdminCatalogSteamDataRequest extends FormRequest
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
            'steam_url' => ['required_without:url', 'string'],
            'url' => ['nullable', 'string'],
        ];
    }

    /**
     * Get the resolved steam url from input.
     */
    public function getSteamUrl(): string
    {
        return (string) ($this->input('steam_url') ?? $this->input('url'));
    }
}
