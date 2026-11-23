<?php

namespace App\Console\Commands;

use App\Services\Cache\RedisCacheService;
use Illuminate\Console\Command;

class ClearGamezygoCacheCommand extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'gamezygo:cache-clear {tag? : Specific cache tag to flush (products, communities, blogs, faqs, announcements, custom_sections, subscription_plans, leaderboard, reviews)}';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Clear Gamezygo Redis cache for guest and user side data';

  /**
   * Execute the console command.
   */
  public function handle(RedisCacheService $cacheService): int
  {
    $tag = $this->argument('tag');

    if ($tag) {
      $this->info("Flushing cache for tag: [{$tag}]...");
      $cacheService->flushTags([$tag]);
      $this->info("Cache tag [{$tag}] flushed successfully!");
      return Command::SUCCESS;
    }

    $this->info('Flushing all Gamezygo application cache tags...');
    $cacheService->flushTags([
      RedisCacheService::TAG_PRODUCTS,
      RedisCacheService::TAG_CUSTOM_SECTIONS,
      RedisCacheService::TAG_SUBSCRIPTIONS,
      RedisCacheService::TAG_BLOGS,
      RedisCacheService::TAG_FAQS,
      RedisCacheService::TAG_ANNOUNCEMENTS,
      RedisCacheService::TAG_COMMUNITIES,
      RedisCacheService::TAG_LEADERBOARD,
      RedisCacheService::TAG_REVIEWS,
    ]);

    $this->info('All Gamezygo guest and user cache cleared successfully!');
    return Command::SUCCESS;
  }
}
