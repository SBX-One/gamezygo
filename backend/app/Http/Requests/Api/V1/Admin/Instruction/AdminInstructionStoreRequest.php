<?php

namespace App\Http\Requests\Api\V1\Admin\Instruction;

use Illuminate\Foundation\Http\FormRequest;

class AdminInstructionStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ];
    }
}
