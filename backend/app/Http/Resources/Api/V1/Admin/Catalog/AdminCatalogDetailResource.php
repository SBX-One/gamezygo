<?php

namespace App\Http\Resources\Api\V1\Admin\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminCatalogDetailResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    $sellingPrice = $this->discount_price > 0 ? (int) $this->discount_price : (int) $this->price;
    $originalPrice = (int) $this->price;

    // Launchers
    $launchers = [];
    if ($this->relationLoaded('productLauncherCategory') && $this->productLauncherCategory) {
      $launchers[] = [
        'id'   => $this->productLauncherCategory->id,
        'name' => $this->productLauncherCategory->name,
      ];
    } elseif ($this->product_launcher_category_id) {
      $launcher = $this->productLauncherCategory;
      if ($launcher) {
        $launchers[] = [
          'id'   => $launcher->id,
          'name' => $launcher->name,
        ];
      }
    }

    // Specifications
    $minimumSpecs = [];
    $recommendedSpecs = [];
    if ($this->relationLoaded('specificationRequirements') || $this->specificationRequirements()->exists()) {
      $specs = $this->specificationRequirements;
      foreach ($specs as $spec) {
        $item = [
          'type'  => $spec->label,
          'value' => $spec->requirement,
        ];
        if ($spec->type === 'recommended') {
          $recommendedSpecs[] = $item;
        } else {
          $minimumSpecs[] = $item;
        }
      }
    }

    // Instruction Template
    $instructionTemplate = null;
    $instruction = $this->relationLoaded('productInstruction')
      ? $this->productInstruction
      : $this->productInstruction()->first();
    if ($instruction) {
      $instructionTemplate = [
        'id'   => $instruction->id,
        'name' => $instruction->title,
      ];
    }

    // Promotion Section ID
    $promotionSectionId = null;
    $customSection = $this->relationLoaded('customSections')
      ? $this->customSections->first()
      : $this->customSections()->first();
    if ($customSection) {
      $promotionSectionId = $customSection->id;
    }

    return [
      'id'                   => $this->id,
      'name'                 => $this->name,
      'slug'                 => $this->slug,
      'image_url'            => $this->thumbnail ?? 'https://placehold.co/100x100',
      'price'                => $sellingPrice,
      'original_price'       => $originalPrice,
      'status'               => (string) $this->status,
      'categories'           => $this->genreCategories->map(function ($cat) {
        return [
          'id'   => $cat->id,
          'name' => $cat->name,
        ];
      })->values()->all(),
      'launchers'            => $launchers,
      'promotion_section_id' => $promotionSectionId,
      'steam_url'            => $this->steam_url,
      'specifications'       => [
        'minimum'     => $minimumSpecs,
        'recommended' => $recommendedSpecs,
      ],
      'instruction_template' => $instructionTemplate,
      'created_at'           => $this->created_at ? $this->created_at->toIso8601String() : null,
    ];
  }
}
