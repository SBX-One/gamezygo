<?php

namespace App\Repositories\Api\V1\Admin\Faq;

use App\Models\Faq;
use App\Repositories\Contracts\Api\V1\Admin\Faq\AdminFaqRepositoryInterface;
use App\Services\Cache\RedisCacheService;

class AdminFaqRepository implements AdminFaqRepositoryInterface
{
    /**
     * Get paginated FAQs with filters.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getFaqs(array $filters): array
    {
        $query = Faq::query();

        // 1. Search
        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%");
            });
        }

        // 2. Filter by Page Name
        if (! empty($filters['page_name'])) {
            $query->where('page', $filters['page_name']);
        }

        // 3. Filter by Active Status
        if (isset($filters['is_active'])) {
            $isActive = filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $isActive);
        }

        // 4. Sorting
        $sortBy = $filters['sort_by'] ?? 'order_number';
        if ($sortBy === 'latest') {
            $query->orderByDesc('created_at');
        } elseif ($sortBy === 'oldest') {
            $query->orderBy('created_at');
        } else {
            $query->orderBy('order_number')->orderByDesc('created_at');
        }

        $perPage = (int) ($filters['per_page'] ?? 10);
        $page = (int) ($filters['page'] ?? 1);

        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        $faqs = collect($paginator->items())->map(function (Faq $item) {
            return [
                'id' => $item->id,
                'question' => $item->question,
                'answer' => $item->answer,
                'page' => $item->page ?? 'general',
                'order_number' => (int) $item->order_number,
                'is_active' => (bool) $item->is_active,
                'created_at' => $item->created_at?->toISOString(),
                'updated_at' => $item->updated_at?->toISOString(),
            ];
        })->values()->all();

        return [
            'total_faqs' => $paginator->total(),
            'faqs' => $faqs,
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
     * Get single FAQ by ID.
     *
     * @return array<string, mixed>
     */
    public function getFaqById(int $id): array
    {
        $item = Faq::findOrFail($id);

        return [
            'id' => $item->id,
            'question' => $item->question,
            'answer' => $item->answer,
            'page' => $item->page ?? 'general',
            'order_number' => (int) $item->order_number,
            'is_active' => (bool) $item->is_active,
            'created_at' => $item->created_at?->toISOString(),
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Create a new FAQ.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createFaq(array $data): array
    {
        $page = $data['page'] ?? 'general';

        if (! isset($data['order_number'])) {
            $maxOrder = Faq::where('page', $page)->max('order_number') ?? 0;
            $orderNumber = $maxOrder + 1;
        } else {
            $orderNumber = (int) $data['order_number'];
        }

        $item = Faq::create([
            'question' => $data['question'],
            'answer' => $data['answer'],
            'page' => $page,
            'order_number' => $orderNumber,
            'is_active' => isset($data['is_active']) ? (bool) $data['is_active'] : true,
        ]);

        return [
            'id' => $item->id,
            'question' => $item->question,
            'answer' => $item->answer,
            'page' => $item->page ?? 'general',
            'order_number' => (int) $item->order_number,
            'is_active' => (bool) $item->is_active,
            'created_at' => $item->created_at?->toISOString(),
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Update FAQ by ID.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateFaq(int $id, array $data): array
    {
        $item = Faq::findOrFail($id);
        $item->update($data);

        return [
            'id' => $item->id,
            'question' => $item->question,
            'answer' => $item->answer,
            'page' => $item->page ?? 'general',
            'order_number' => (int) $item->order_number,
            'is_active' => (bool) $item->is_active,
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }

    /**
     * Update active status of FAQ.
     *
     * @return array<string, mixed>
     */
    public function updateStatus(int $id, bool $isActive): array
    {
        $item = Faq::findOrFail($id);
        $item->is_active = $isActive;
        $item->save();

        return [
            'id' => $item->id,
            'is_active' => (bool) $item->is_active,
        ];
    }

    /**
     * Reorder multiple FAQs.
     *
     * @param  array<int, array{id: int, order_number: int}>  $orders
     */
    public function reorderFaqs(array $orders): void
    {
        foreach ($orders as $row) {
            Faq::where('id', $row['id'])->update([
                'order_number' => (int) $row['order_number'],
            ]);
        }
    }

    /**
     * Delete FAQ by ID.
     */
    public function deleteFaq(int $id): void
    {
        $item = Faq::findOrFail($id);
        $item->delete();
    }

    /**
     * Bulk delete FAQs by IDs.
     *
     * @param  array<int>  $ids
     */
    public function deleteFaqs(array $ids): int
    {
        $deleted = Faq::whereIn('id', $ids)->delete();

        app(RedisCacheService::class)->flushTags(RedisCacheService::TAG_FAQS);

        return $deleted;
    }

    /**
     * Get list of distinct/available page placements.
     *
     * @return array<string>
     */
    public function getAvailablePages(): array
    {
        $defaultPages = ['home', 'catalog', 'subscription', 'checkout', 'general'];
        $existingPages = Faq::distinct()->pluck('page')->filter()->values()->all();

        return array_values(array_unique(array_merge($defaultPages, $existingPages)));
    }
}
