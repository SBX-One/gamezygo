<?php

namespace App\Repositories\Api\V1\Admin\Catalog;

use App\Models\File;
use App\Models\Product;
use App\Models\ProductGameAccount;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\ProductSpecificationRequirement;
use App\Repositories\Contracts\Api\V1\Admin\Catalog\AdminCatalogRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminCatalogRepository implements AdminCatalogRepositoryInterface
{
  /**
   * Get filtered and paginated catalog list.
   *
   * @param array<string, mixed> $filters
   * @param int $perPage
   * @param bool $archiveOnly
   * @return LengthAwarePaginator
   */
  public function getCatalogList(array $filters = [], int $perPage = 10, bool $archiveOnly = false): LengthAwarePaginator
  {
    $query = Product::query()
      ->with([
        'genreCategories',
        'productLauncherCategory',
        'productInstruction',
        'files',
      ]);

    if ($archiveOnly) {
      $query->where(function ($q) {
        $q->where('status', 'archive')
          ->orWhereNotNull('archived_at');
      });
    } else {
      // Exclude archived by default unless explicitly filtered
      if (empty($filters['status'])) {
        $query->where('status', '!=', 'archive')
          ->whereNull('archived_at');
      }
    }

    // Search keyword (by name, slug, description, or steam_url)
    if (!empty($filters['search'])) {
      $search = trim((string) $filters['search']);
      $searchPattern = '%' . strtolower($search) . '%';
      $query->where(function ($q) use ($searchPattern) {
        $q->whereRaw('LOWER(name) LIKE ?', [$searchPattern])
          ->orWhereRaw('LOWER(slug) LIKE ?', [$searchPattern])
          ->orWhereRaw('LOWER(description) LIKE ?', [$searchPattern])
          ->orWhereRaw('LOWER(steam_url) LIKE ?', [$searchPattern]);
      });
    }

    // Filter by categories
    if (!empty($filters['category_ids']) && is_array($filters['category_ids'])) {
      $categoryIds = array_map('intval', $filters['category_ids']);
      $query->whereHas('genreCategories', function ($q) use ($categoryIds) {
        $q->whereIn('genre_categories.id', $categoryIds);
      });
    }

    // Filter by status
    if (!empty($filters['status'])) {
      $statuses = is_array($filters['status']) ? $filters['status'] : [$filters['status']];
      $query->where(function ($q) use ($statuses) {
        foreach ($statuses as $st) {
          $normalized = strtolower(trim((string) $st));
          if (in_array($normalized, ['active', 'actiive'])) {
            $q->orWhere(function ($sub) {
              $sub->whereNotIn('status', ['archive', 'draft'])
                ->whereNull('archived_at');
            });
          } elseif ($normalized === 'draft') {
            $q->orWhere('status', 'draft');
          } elseif ($normalized === 'archive') {
            $q->orWhere('status', 'archive')
              ->orWhereNotNull('archived_at');
          } elseif ($normalized === 'pre-order') {
            $q->orWhere('status', 'pre-order');
          } elseif ($normalized === 'published' || $normalized === 'listing') {
            $q->orWhereIn('status', ['listing', 'published'])
              ->whereNull('archived_at');
          } else {
            $q->orWhere('status', $normalized);
          }
        }
      });
    }

    // Filter by min price
    if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
      $minPrice = (int) $filters['min_price'];
      $query->where(function ($q) use ($minPrice) {
        $q->where('price', '>=', $minPrice)
          ->orWhere(function ($sub) use ($minPrice) {
            $sub->where('discount_price', '>', 0)
              ->where('discount_price', '>=', $minPrice);
          });
      });
    }

    // Filter by max price
    if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
      $maxPrice = (int) $filters['max_price'];
      $query->where(function ($q) use ($maxPrice) {
        $q->where(function ($sub) use ($maxPrice) {
          $sub->where('discount_price', '>', 0)
            ->where('discount_price', '<=', $maxPrice);
        })->orWhere(function ($sub) use ($maxPrice) {
          $sub->where(function ($inner) {
            $inner->whereNull('discount_price')->orWhere('discount_price', 0);
          })->where('price', '<=', $maxPrice);
        });
      });
    }

    // Sort order
    $sortBy = (string) ($filters['sort_by'] ?? 'latest');
    match ($sortBy) {
      'oldest'     => $query->orderBy('created_at', 'asc')->orderBy('id', 'asc'),
      'a_z'        => $query->orderBy('name', 'asc')->orderBy('id', 'asc'),
      'z_a'        => $query->orderBy('name', 'desc')->orderBy('id', 'desc'),
      'price_low'  => $query->orderBy('price', 'asc')->orderBy('id', 'asc'),
      'price_high' => $query->orderBy('price', 'desc')->orderBy('id', 'desc'),
      default      => $query->orderBy('created_at', 'desc')->orderBy('id', 'desc'),
    };

    $page = isset($filters['page']) ? (int) $filters['page'] : null;

    return $query->paginate(perPage: $perPage, page: $page);
  }

  /**
   * Get total non-archived products count.
   *
   * @return int
   */
  public function getTotalProductCount(): int
  {
    return Product::query()
      ->where('status', '!=', 'archive')
      ->whereNull('archived_at')
      ->count();
  }

  /**
   * Find product by ID with all relations loaded.
   *
   * @param int|string $id
   * @return Product|null
   */
  public function findProduct(int|string $id): ?Product
  {
    return Product::query()
      ->with([
        'genreCategories',
        'productLauncherCategory',
        'productInstruction',
        'specificationRequirements',
        'gameAccount',
        'customSections',
        'files',
      ])
      ->find($id);
  }

  /**
   * Store new catalog product and related models.
   *
   * @param array<string, mixed> $data
   * @param mixed $thumbnail
   * @return Product
   */
  public function createProduct(array $data, mixed $thumbnail = null): Product
  {
    $this->dropLegacyPostgresStatusCheck();

    return DB::transaction(function () use ($data, $thumbnail) {
      $productName = !empty($data['name'])
        ? $data['name']
        : ('Steam Game ' . ($data['steam_app_id'] ?? rand(1000, 9999)));

      $slug = Str::slug($productName) . '-' . Str::lower(Str::random(5));

      $launcherId = !empty($data['launcher_ids'][0])
        ? (int) $data['launcher_ids'][0]
        : (ProductLauncherCategory::whereRaw('LOWER(name) = ?', ['steam'])->first()?->id
          ?? ProductLauncherCategory::first()?->id
          ?? ProductLauncherCategory::factory()->create(['name' => 'Steam', 'slug' => 'steam'])->id);

      $instructionId = !empty($data['instruction_template_id'])
        ? (int) $data['instruction_template_id']
        : (ProductInstruction::first()?->id ?? ProductInstruction::factory()->create()->id);

      $priceInput = (int) ($data['price'] ?? 0);
      $originalPriceInput = !empty($data['original_price']) ? (int) $data['original_price'] : $priceInput;

      $product = Product::create([
        'name'                         => $productName,
        'slug'                         => $slug,
        'description'                  => $data['description'] ?? $productName,
        'price'                        => $originalPriceInput,
        'discount_price'               => $priceInput < $originalPriceInput ? $priceInput : 0,
        'product_launcher_category_id' => $launcherId,
        'product_instruction_id'       => $instructionId,
        'steam_url'                    => $data['steam_url'] ?? 'https://store.steampowered.com',
        'status'                       => !empty($data['status']) ? $data['status'] : 'draft',
        'is_subscription_supported'    => false,
      ]);

      // Categories
      if (!empty($data['category_ids']) && is_array($data['category_ids'])) {
        $product->genreCategories()->sync($data['category_ids']);
      }

      // Promotion section
      if (!empty($data['promotion_section_id'])) {
        $product->customSections()->sync([$data['promotion_section_id']]);
      }

      // Game account
      if (!empty($data['game_account']['username']) || !empty($data['game_account']['password'])) {
        ProductGameAccount::create([
          'product_id' => $product->id,
          'username'   => (string) ($data['game_account']['username'] ?? ''),
          'password'   => (string) ($data['game_account']['password'] ?? ''),
        ]);
      }

      // Specifications
      $this->syncSpecifications($product, $data['specifications'] ?? []);

      // Thumbnail file
      $this->attachThumbnail($product, $thumbnail);

      return $this->findProduct($product->id) ?? $product;
    });
  }

  /**
   * Update catalog product and related models.
   *
   * @param Product $product
   * @param array<string, mixed> $data
   * @param mixed $thumbnail
   * @return Product
   */
  public function updateProduct(Product $product, array $data, mixed $thumbnail = null): Product
  {
    $this->dropLegacyPostgresStatusCheck();

    return DB::transaction(function () use ($product, $data, $thumbnail) {
      $updateData = [];

      if (!empty($data['name'])) {
        $updateData['name'] = $data['name'];
      }

      if (isset($data['price'])) {
        $priceInput = (int) $data['price'];
        $originalPriceInput = !empty($data['original_price']) ? (int) $data['original_price'] : (int) $product->price;

        $updateData['price'] = $originalPriceInput;
        $updateData['discount_price'] = $priceInput < $originalPriceInput ? $priceInput : 0;
      } elseif (isset($data['original_price'])) {
        $updateData['price'] = (int) $data['original_price'];
      }

      if (!empty($data['launcher_ids'][0])) {
        $updateData['product_launcher_category_id'] = (int) $data['launcher_ids'][0];
      }

      if (!empty($data['instruction_template_id'])) {
        $updateData['product_instruction_id'] = (int) $data['instruction_template_id'];
      }

      if (isset($data['steam_url'])) {
        $updateData['steam_url'] = $data['steam_url'];
      }

      if (!empty($data['status'])) {
        $updateData['status'] = $data['status'];
      }

      if (!empty($updateData)) {
        $product->update($updateData);
      }

      // Categories
      if (isset($data['category_ids']) && is_array($data['category_ids'])) {
        $product->genreCategories()->sync($data['category_ids']);
      }

      // Promotion section
      if (isset($data['promotion_section_id'])) {
        if (!empty($data['promotion_section_id'])) {
          $product->customSections()->sync([$data['promotion_section_id']]);
        } else {
          $product->customSections()->detach();
        }
      }

      // Game account
      if (isset($data['game_account'])) {
        if (!empty($data['game_account']['username']) || !empty($data['game_account']['password'])) {
          ProductGameAccount::updateOrCreate(
            ['product_id' => $product->id],
            [
              'username' => (string) ($data['game_account']['username'] ?? ''),
              'password' => (string) ($data['game_account']['password'] ?? ''),
            ]
          );
        }
      }

      // Specifications
      if (isset($data['specifications']) && is_array($data['specifications'])) {
        $this->syncSpecifications($product, $data['specifications']);
      }

      // Thumbnail file
      if ($thumbnail !== null) {
        $this->attachThumbnail($product, $thumbnail);
      }

      return $this->findProduct($product->id) ?? $product;
    });
  }

  /**
   * Bulk delete products by IDs.
   *
   * @param array<int> $ids
   * @return array{deleted_count: int, deleted_ids: array<int>}
   */
  public function deleteProducts(array $ids): array
  {
    return DB::transaction(function () use ($ids) {
      $products = Product::whereIn('id', $ids)->get();
      $deletedIds = [];

      foreach ($products as $prod) {
        $deletedIds[] = (int) $prod->id;
        $prod->delete();
      }

      return [
        'deleted_count' => count($deletedIds),
        'deleted_ids'   => $deletedIds,
      ];
    });
  }

  /**
   * Toggle or set archive status on a product.
   *
   * @param Product $product
   * @return Product
   */
  public function archiveProduct(Product $product): Product
  {
    $isCurrentlyArchived = $product->status === 'archive' || !empty($product->archived_at);

    if ($isCurrentlyArchived) {
      // Un-archive
      $product->update([
        'status'      => 'published',
        'archived_at' => null,
      ]);
    } else {
      // Archive
      $product->update([
        'archived_at' => now(),
      ]);
    }

    return $product->fresh() ?? $product;
  }

  /**
   * Sync product specification requirements.
   *
   * @param Product $product
   * @param array<string, mixed> $specifications
   */
  private function syncSpecifications(Product $product, array $specifications): void
  {
    if (empty($specifications)) {
      return;
    }

    ProductSpecificationRequirement::where('product_id', $product->id)->delete();

    if (!empty($specifications['minimum']) && is_array($specifications['minimum'])) {
      foreach ($specifications['minimum'] as $spec) {
        if (!empty($spec['type']) && !empty($spec['value'])) {
          ProductSpecificationRequirement::create([
            'product_id'  => $product->id,
            'label'       => (string) $spec['type'],
            'requirement' => (string) $spec['value'],
            'type'        => 'minimum',
          ]);
        }
      }
    }

    if (!empty($specifications['recommended']) && is_array($specifications['recommended'])) {
      foreach ($specifications['recommended'] as $spec) {
        if (!empty($spec['type']) && !empty($spec['value'])) {
          ProductSpecificationRequirement::create([
            'product_id'  => $product->id,
            'label'       => (string) $spec['type'],
            'requirement' => (string) $spec['value'],
            'type'        => 'recommended',
          ]);
        }
      }
    }
  }

  /**
   * Attach thumbnail to product files.
   *
   * @param Product $product
   * @param mixed $thumbnail
   */
  private function attachThumbnail(Product $product, mixed $thumbnail): void
  {
    if ($thumbnail instanceof UploadedFile) {
      $url = app(\App\Services\Storage\S3StorageService::class)->upload($thumbnail, 'products');

      $product->files()->delete();
      $product->files()->create([
        'file_name' => $thumbnail->getClientOriginalName(),
        'file_type' => $thumbnail->getClientMimeType() ?: 'image/jpeg',
        'file_path' => $url,
        'file_size' => $thumbnail->getSize(),
      ]);
    } elseif (is_string($thumbnail) && !empty($thumbnail)) {
      $product->files()->delete();
      $product->files()->create([
        'file_name' => basename($thumbnail),
        'file_type' => 'image/jpeg',
        'file_path' => $thumbnail,
        'file_size' => 1024,
      ]);
    }
  }

  /**
   * Ensure legacy PostgreSQL check constraint on status column is dropped.
   */
  private function dropLegacyPostgresStatusCheck(): void
  {
    if (DB::connection()->getDriverName() === 'pgsql') {
      try {
        DB::statement('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check');
      } catch (\Throwable $e) {
        // Silently ignore if insufficient permission or table doesn't exist
      }
    }
  }
}

