<?php

namespace App\Http\Requests\Api\V1\Admin\Catalog;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;

class AdminCatalogUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $mergeData = [];

        if ($this->has('category_ids') && is_array($this->category_ids)) {
            $mergeData['category_ids'] = array_values(array_filter(
                $this->category_ids,
                fn ($val) => $val !== null && $val !== '' && is_numeric($val) && (int) $val > 0
            ));
        }

        if ($this->has('launcher_ids') && is_array($this->launcher_ids)) {
            $mergeData['launcher_ids'] = array_values(array_filter(
                $this->launcher_ids,
                fn ($val) => $val !== null && $val !== '' && is_numeric($val) && (int) $val > 0
            ));
        }

        if (! empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'thumbnail' => ['nullable'],
            'status' => ['sometimes', 'required', 'string', 'in:published,draft,listing,pre-order,archive'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:genre_categories,id'],
            'launcher_ids' => ['nullable', 'array'],
            'launcher_ids.*' => ['integer', 'exists:product_launcher_categories,id'],
            'promotion_section_id' => ['nullable', 'integer', 'exists:custom_sections,id'],
            'steam_url' => ['nullable', 'string'],
            'game_account' => ['nullable', 'array'],
            'game_account.username' => ['nullable', 'string'],
            'game_account.password' => ['nullable', 'string'],
            'specifications' => ['nullable', 'array'],
            'specifications.minimum' => ['nullable', 'array'],
            'specifications.minimum.*.type' => ['nullable', 'string'],
            'specifications.minimum.*.value' => ['nullable', 'string'],
            'specifications.recommended' => ['nullable', 'array'],
            'specifications.recommended.*.type' => ['nullable', 'string'],
            'specifications.recommended.*.value' => ['nullable', 'string'],
            'instruction_template_id' => ['nullable', 'integer', 'exists:product_instructions,id'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->input('status') === 'published') {
                $productId = $this->route('id') ?? $this->route('catalog') ?? $this->route('product');
                $product = $productId ? Product::find($productId) : null;

                $gameAccount = $this->input('game_account');
                $hasGameAccount = (! empty($gameAccount['username']) && ! empty($gameAccount['password']))
                  || ($product && $product->gameAccount()->exists());
                if (! $hasGameAccount) {
                    $validator->errors()->add('game_account', 'Game account username and password are required to publish the product.');
                }

                $minSpecs = $this->input('specifications.minimum');
                $hasMinSpecs = (! empty($minSpecs) && is_array($minSpecs) && ! empty($minSpecs[0]['type']) && ! empty($minSpecs[0]['value']))
                  || ($product && $product->specificationRequirements()->where('type', 'minimum')->exists());
                if (! $hasMinSpecs) {
                    $validator->errors()->add('specifications.minimum', 'Minimum specifications are required to publish the product.');
                }

                $recSpecs = $this->input('specifications.recommended');
                $hasRecSpecs = (! empty($recSpecs) && is_array($recSpecs) && ! empty($recSpecs[0]['type']) && ! empty($recSpecs[0]['value']))
                  || ($product && $product->specificationRequirements()->where('type', 'recommended')->exists());
                if (! $hasRecSpecs) {
                    $validator->errors()->add('specifications.recommended', 'Recommended specifications are required to publish the product.');
                }

                $hasInstruction = $this->filled('instruction_template_id')
                  || ($product && ! empty($product->product_instruction_id));
                if (! $hasInstruction) {
                    $validator->errors()->add('instruction_template_id', 'Instruction template is required to publish the product.');
                }

                $hasThumbnail = $this->hasFile('thumbnail')
                  || $this->filled('thumbnail')
                  || ($product && ($product->files()->exists() || ! empty($product->thumbnail)));
                if (! $hasThumbnail) {
                    $validator->errors()->add('thumbnail', 'Thumbnail is required to publish the product.');
                }
            }
        });
    }
}
