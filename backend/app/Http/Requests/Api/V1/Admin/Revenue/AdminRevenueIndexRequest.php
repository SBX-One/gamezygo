<?php

namespace App\Http\Requests\Api\V1\Admin\Revenue;

use Illuminate\Foundation\Http\FormRequest;

class AdminRevenueIndexRequest extends FormRequest
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
            'period' => ['nullable', 'string', 'in:today,yesterday,weekly,this_week,week,monthly,this_month,month,yearly,this_year,year,all_time,all,custom'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ];
    }
}
