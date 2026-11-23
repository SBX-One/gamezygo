<?php

namespace App\Services\Cache;

use Closure;
use DateTimeInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

class RedisCacheService
{
  // Cache TTLs in seconds
  public const TTL_SHORT = 300;       // 5 minutes
  public const TTL_MEDIUM = 1800;     // 30 minutes
  public const TTL_LONG = 3600;       // 1 hour
  public const TTL_EXTENDED = 7200;   // 2 hours
  public const TTL_DAY = 86400;       // 24 hours

  // Cache Tags for Redis tagging & targeted invalidation
  public const TAG_PRODUCTS = 'products';
  public const TAG_CUSTOM_SECTIONS = 'custom_sections';
  public const TAG_SUBSCRIPTIONS = 'subscription_plans';
  public const TAG_BLOGS = 'blogs';
  public const TAG_FAQS = 'faqs';
  public const TAG_ANNOUNCEMENTS = 'announcements';
  public const TAG_COMMUNITIES = 'communities';
  public const TAG_LEADERBOARD = 'leaderboard';
  public const TAG_REVIEWS = 'reviews';

  /**
   * Determine user specific cache tag.
   *
   * @param int $userId
   * @return string
   */
  public static function userTag(int $userId): string
  {
    return "user:{$userId}";
  }

  /**
   * Retrieve an item from the cache, or execute the given Closure and store the result.
   * Includes fallback to executing callback directly if Redis is unreachable.
   *
   * @param string $key
   * @param DateTimeInterface|\DateInterval|int $ttl
   * @param Closure $callback
   * @param array<string> $tags
   * @return mixed
   */
  public function remember(string $key, DateTimeInterface|\DateInterval|int $ttl, Closure $callback, array $tags = []): mixed
  {
    try {
      if (!empty($tags) && Cache::supportsTags()) {
        return Cache::tags($tags)->remember($key, $ttl, $callback);
      }

      return Cache::remember($key, $ttl, $callback);
    } catch (Throwable $e) {
      Log::warning("RedisCacheService::remember failed for key [{$key}]: " . $e->getMessage());

      return $callback();
    }
  }

  /**
   * Retrieve an item from the cache.
   *
   * @param string $key
   * @param mixed $default
   * @param array<string> $tags
   * @return mixed
   */
  public function get(string $key, mixed $default = null, array $tags = []): mixed
  {
    try {
      if (!empty($tags) && Cache::supportsTags()) {
        return Cache::tags($tags)->get($key, $default);
      }

      return Cache::get($key, $default);
    } catch (Throwable $e) {
      Log::warning("RedisCacheService::get failed for key [{$key}]: " . $e->getMessage());

      return value($default);
    }
  }

  /**
   * Store an item in the cache.
   *
   * @param string $key
   * @param mixed $value
   * @param DateTimeInterface|\DateInterval|int $ttl
   * @param array<string> $tags
   * @return bool
   */
  public function put(string $key, mixed $value, DateTimeInterface|\DateInterval|int $ttl, array $tags = []): bool
  {
    try {
      if (!empty($tags) && Cache::supportsTags()) {
        return Cache::tags($tags)->put($key, $value, $ttl);
      }

      return Cache::put($key, $value, $ttl);
    } catch (Throwable $e) {
      Log::warning("RedisCacheService::put failed for key [{$key}]: " . $e->getMessage());

      return false;
    }
  }

  /**
   * Remove an item from the cache.
   *
   * @param string $key
   * @param array<string> $tags
   * @return bool
   */
  public function forget(string $key, array $tags = []): bool
  {
    try {
      if (!empty($tags) && Cache::supportsTags()) {
        return Cache::tags($tags)->forget($key);
      }

      return Cache::forget($key);
    } catch (Throwable $e) {
      Log::warning("RedisCacheService::forget failed for key [{$key}]: " . $e->getMessage());

      return false;
    }
  }

  /**
   * Flush all items in the given tags.
   *
   * @param array<string>|string $tags
   * @return bool
   */
  public function flushTags(array|string $tags): bool
  {
    $tags = (array) $tags;

    try {
      if (Cache::supportsTags()) {
        return Cache::tags($tags)->flush();
      }

      return true;
    } catch (Throwable $e) {
      Log::warning('RedisCacheService::flushTags failed: ' . $e->getMessage());

      return false;
    }
  }

  /**
   * Flush user specific cache tag.
   *
   * @param int $userId
   * @return bool
   */
  public function flushUser(int $userId): bool
  {
    return $this->flushTags([self::userTag($userId)]);
  }

  /**
   * Flush entire application cache.
   *
   * @return bool
   */
  public function flushAll(): bool
  {
    try {
      return Cache::flush();
    } catch (Throwable $e) {
      Log::warning('RedisCacheService::flushAll failed: ' . $e->getMessage());

      return false;
    }
  }
}
