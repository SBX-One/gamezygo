<?php

namespace App\Repositories\Api\V1\Admin\Instruction;

use App\Models\ProductInstruction;
use App\Repositories\Contracts\Api\V1\Admin\Instruction\AdminInstructionRepositoryInterface;

class AdminInstructionRepository implements AdminInstructionRepositoryInterface
{
    /**
     * Get paginated instruction templates with filters.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getInstructions(array $filters): array
    {
        $query = ProductInstruction::withCount('products');

        // 1. Search
        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // 2. Is Used Filter
        if (isset($filters['is_used'])) {
            $isUsed = $filters['is_used'];
            if (in_array($isUsed, ['true', '1', true, 1], true)) {
                $query->has('products');
            } elseif (in_array($isUsed, ['false', '0', false, 0], true)) {
                $query->doesntHave('products');
            }
        }

        // 3. Sorting
        $sortBy = $filters['sort_by'] ?? 'latest';
        if ($sortBy === 'oldest') {
            $query->orderBy('created_at');
        } elseif ($sortBy === 'most_used') {
            $query->orderByDesc('products_count')->orderByDesc('created_at');
        } elseif ($sortBy === 'title') {
            $query->orderBy('title');
        } else {
            $query->orderByDesc('updated_at');
        }

        $perPage = (int) ($filters['per_page'] ?? 10);
        $page = (int) ($filters['page'] ?? 1);

        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        $instructions = collect($paginator->items())->map(function (ProductInstruction $item) {
            $count = (int) ($item->products_count ?? $item->products()->count());

            return [
                'id' => $item->id,
                'title' => $item->title,
                'is_used' => $count > 0,
                'total_products' => $count,
                'created_at' => $item->created_at?->toISOString(),
                'last_edit' => ($item->updated_at ?? $item->created_at)?->toISOString(),
            ];
        })->values()->all();

        return [
            'total_instructions' => $paginator->total(),
            'instructions' => $instructions,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'from' => $paginator->firstItem(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'to' => $paginator->lastItem(),
                'total' => $paginator->total(),
            ],
        ];
    }

    /**
     * Get single instruction template by ID.
     *
     * @return array<string, mixed>
     */
    public function getInstructionById(int $id): array
    {
        $item = ProductInstruction::withCount('products')->findOrFail($id);
        $count = (int) ($item->products_count ?? $item->products()->count());

        return [
            'id' => $item->id,
            'title' => $item->title,
            'content' => $item->content,
            'is_used' => $count > 0,
            'total_products' => $count,
            'created_at' => $item->created_at?->toISOString(),
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Create a new instruction template.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createInstruction(array $data): array
    {
        $item = ProductInstruction::create([
            'title' => $data['title'],
            'content' => $data['content'],
        ]);

        return [
            'id' => $item->id,
            'title' => $item->title,
            'content' => $item->content,
            'created_at' => $item->created_at?->toISOString(),
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Update instruction template by ID.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateInstruction(int $id, array $data): array
    {
        $item = ProductInstruction::findOrFail($id);
        $item->update($data);

        return [
            'id' => $item->id,
            'title' => $item->title,
            'content' => $item->content,
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Delete instruction template by ID.
     */
    public function deleteInstruction(int $id): void
    {
        $item = ProductInstruction::findOrFail($id);
        $item->delete();
    }
}
