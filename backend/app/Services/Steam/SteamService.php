<?php

namespace App\Services\Steam;

use Illuminate\Support\Facades\Http;
use Throwable;

class SteamService
{
  /**
   * Validate if the provided string is a valid Steam store URL.
   *
   * @param string $url
   * @return bool
   */
  public function isValidSteamUrl(string $url): bool
  {
    return (bool) preg_match('~^https?://store\.steampowered\.com/app/(\d+)~i', trim($url));
  }

  /**
   * Extract the numeric App ID from a Steam store URL.
   *
   * @param string $url
   * @return string|null
   */
  public function extractAppId(string $url): ?string
  {
    if (preg_match('~store\.steampowered\.com/app/(\d+)~i', trim($url), $matches)) {
      return $matches[1];
    }

    return null;
  }

  /**
   * Normalize the Steam URL to standard format: https://store.steampowered.com/app/{appId}/
   *
   * @param string $url
   * @return string
   */
  public function normalizeSteamUrl(string $url): string
  {
    $appId = $this->extractAppId($url);
    if ($appId) {
      if (preg_match('~store\.steampowered\.com/app/\d+/([^/?#]+)~i', trim($url), $slugMatches)) {
        return "https://store.steampowered.com/app/{$appId}/{$slugMatches[1]}/";
      }

      return "https://store.steampowered.com/app/{$appId}/";
    }

    return trim($url);
  }

  /**
   * Fetch game details from official Steam public store API.
   *
   * @param string $url
   * @return array{app_id: string, name: string, steam_url: string}|null
   */
  public function fetchGameDetails(string $url): ?array
  {
    $appId = $this->extractAppId($url);
    if (!$appId) {
      return null;
    }

    $gameName = null;

    try {
      $response = Http::timeout(5)->get('https://store.steampowered.com/api/appdetails', [
        'appids' => $appId,
        'l'      => 'english',
      ]);

      if ($response->successful()) {
        $json = $response->json();
        if (isset($json[$appId]['success']) && $json[$appId]['success'] === true) {
          $gameName = $json[$appId]['data']['name'] ?? null;
          if ($gameName) {
            $gameName = html_entity_decode($gameName, ENT_QUOTES | ENT_HTML5, 'UTF-8');
          }
        }
      }
    } catch (Throwable) {
      // Network or timeout exception
    }

    // Fallback: extract title from URL slug if API fails or during test environments without internet
    if (!$gameName && preg_match('~store\.steampowered\.com/app/\d+/([^/?#]+)~i', trim($url), $slugMatches)) {
      $slugClean = trim(urldecode($slugMatches[1]));
      if (!empty($slugClean)) {
        $gameName = ucwords(str_replace(['_', '-'], ' ', $slugClean));
      }
    }

    if (!$gameName) {
      return null;
    }

    return [
      'app_id'    => $appId,
      'name'      => $gameName,
      'steam_url' => $this->normalizeSteamUrl($url),
    ];
  }
}
