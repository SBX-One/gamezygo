<?php

namespace App\Observers;

use App\Models\Faq;
use App\Services\Cache\RedisCacheService;

class FaqObserver
{
  public function __construct(
    protected RedisCacheService $cacheService
  ) {}

  public function saved(Faq $faq): void
  {
    $this->cacheService->flushTags(RedisCacheService::TAG_FAQS);
  }

  public function deleted(Faq $faq): void
  {
    $this->cacheService->flushTags(RedisCacheService::TAG_FAQS);
  }
}
