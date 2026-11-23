<?php

namespace App\Observers;

use App\Models\Product;
use App\Services\Cache\RedisCacheService;

class ProductObserver
{
  public function __construct(
    protected RedisCacheService $cacheService
  ) {}

  public function saved(Product $product): void
  {
    $this->cacheService->flushTags([
      RedisCacheService::TAG_PRODUCTS,
      RedisCacheService::TAG_CUSTOM_SECTIONS,
    ]);
  }

  public function deleted(Product $product): void
  {
    $this->cacheService->flushTags([
      RedisCacheService::TAG_PRODUCTS,
      RedisCacheService::TAG_CUSTOM_SECTIONS,
    ]);
  }

  public function restored(Product $product): void
  {
    $this->cacheService->flushTags([
      RedisCacheService::TAG_PRODUCTS,
      RedisCacheService::TAG_CUSTOM_SECTIONS,
    ]);
  }
}
