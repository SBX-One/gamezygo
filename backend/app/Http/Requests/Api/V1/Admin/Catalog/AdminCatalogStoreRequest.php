<?php

namespace App\Http\Requests\Api\V1\Admin\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class AdminCatalogStoreRequest extends FormRequest
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

    if (!$this->filled('status')) {
      $mergeData['status'] = 'draft';
    }

    if ($this->has('category_ids') && is_array($this->category_ids)) {
      $mergeData['category_ids'] = array_values(array_filter(
        $this->category_ids,
        fn($val) => $val !== null && $val !== '' && is_numeric($val) && (int) $val > 0
      ));
    }

    if ($this->has('launcher_ids') && is_array($this->launcher_ids)) {
      $mergeData['launcher_ids'] = array_values(array_filter(
        $this->launcher_ids,
        fn($val) => $val !== null && $val !== '' && is_numeric($val) && (int) $val > 0
      ));
    }

    if (!empty($mergeData)) {
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
      'name'                               => ['required_without:steam_url', 'nullable', 'string', 'max:255'],
      'price'                              => ['required_without:steam_url', 'nullable', 'numeric', 'min:0'],
      'original_price'                     => ['nullable', 'numeric', 'min:0'],
      'thumbnail'                          => ['nullable'],
      'status'                             => ['nullable', 'string', 'in:published,draft,listing,pre-order,archive'],
      'category_ids'                       => ['nullable', 'array'],
      'category_ids.*'                     => ['integer', 'exists:genre_categories,id'],
      'launcher_ids'                       => ['nullable', 'array'],
      'launcher_ids.*'                     => ['integer', 'exists:product_launcher_categories,id'],
      'promotion_section_id'               => ['nullable', 'integer', 'exists:custom_sections,id'],
      'steam_url'                          => ['nullable', 'string'],
      'game_account'                       => ['nullable', 'array'],
      'game_account.username'              => ['nullable', 'string'],
      'game_account.password'              => ['nullable', 'string'],
      'specifications'                     => ['nullable', 'array'],
      'specifications.minimum'             => ['nullable', 'array'],
      'specifications.minimum.*.type'      => ['nullable', 'string'],
      'specifications.minimum.*.value'     => ['nullable', 'string'],
      'specifications.recommended'         => ['nullable', 'array'],
      'specifications.recommended.*.type'  => ['nullable', 'string'],
      'specifications.recommended.*.value' => ['nullable', 'string'],
      'instruction_template_id'            => ['nullable', 'integer', 'exists:product_instructions,id'],
    ];
  }

  /**
   * Configure the validator instance.
   */
  public function withValidator($validator): void
  {
    $validator->after(function ($validator) {
      if ($this->input('status') === 'published') {
        $hasSteamUrl = $this->filled('steam_url');

        $gameAccount = $this->input('game_account');
        if (empty($gameAccount['username']) || empty($gameAccount['password'])) {
          $validator->errors()->add('game_account', 'Game account username and password are required to publish the product.');
        }

        $minSpecs = $this->input('specifications.minimum');
        if (!$hasSteamUrl && (empty($minSpecs) || !is_array($minSpecs) || empty($minSpecs[0]['type']) || empty($minSpecs[0]['value']))) {
          $validator->errors()->add('specifications.minimum', 'Minimum specifications are required to publish the product.');
        }

        $recSpecs = $this->input('specifications.recommended');
        if (!$hasSteamUrl && (empty($recSpecs) || !is_array($recSpecs) || empty($recSpecs[0]['type']) || empty($recSpecs[0]['value']))) {
          $validator->errors()->add('specifications.recommended', 'Recommended specifications are required to publish the product.');
        }

        if (!$this->filled('instruction_template_id')) {
          $validator->errors()->add('instruction_template_id', 'Instruction template is required to publish the product.');
        }

        if (!$hasSteamUrl && !$this->hasFile('thumbnail') && !$this->filled('thumbnail')) {
          $validator->errors()->add('thumbnail', 'Thumbnail is required to publish the product.');
        }
      }
    });
  }
}

