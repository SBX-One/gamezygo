<?php

namespace App\Services\Api\V1\Admin\Catalog;

use App\Models\GenreCategory;
use App\Models\ProductLauncherCategory;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class SteamService
{
  /**
   * Extract Steam App ID from various Steam URL formats.
   *
   * @param string $steamUrl
   * @return int|null
   */
  public function extractAppId(string $steamUrl): ?int
  {
    $trimmed = trim($steamUrl);

    if (preg_match('/app\/(\d+)/i', $trimmed, $matches)) {
      return (int) $matches[1];
    }

    if (is_numeric($trimmed)) {
      return (int) $trimmed;
    }

    return null;
  }

  /**
   * Fetch game details from Steam Store Web API.
   *
   * @param string $steamUrl
   * @return array<string, mixed>|null
   */
  public function fetchGameData(string $steamUrl): ?array
  {
    $appId = $this->extractAppId($steamUrl);

    if (!$appId) {
      return null;
    }

    try {
      $response = Http::timeout(10)->get('https://store.steampowered.com/api/appdetails', [
        'appids' => $appId,
        'cc'     => 'id',
        'l'      => 'english',
      ]);

      if (!$response->successful() || !$response->json("{$appId}.success")) {
        // Fallback retry without country code
        $response = Http::timeout(10)->get('https://store.steampowered.com/api/appdetails', [
          'appids' => $appId,
          'l'      => 'english',
        ]);

        if (!$response->successful() || !$response->json("{$appId}.success")) {
          return null;
        }
      }

      $data = $response->json("{$appId}.data");

      return $this->formatSteamData($appId, $data);
    } catch (Throwable $e) {
      return null;
    }
  }

  /**
   * Format raw Steam store data into standardized catalog fields.
   *
   * @param int $appId
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function formatSteamData(int $appId, array $data): array
  {
    $name = (string) ($data['name'] ?? '');
    $description = strip_tags((string) ($data['detailed_description'] ?? $data['short_description'] ?? $data['about_the_game'] ?? ''));
    $imageUrl = (string) ($data['header_image'] ?? $data['capsule_image'] ?? "https://cdn.akamai.steamstatic.com/steam/apps/{$appId}/header.jpg");
    $canonicalUrl = "https://store.steampowered.com/app/{$appId}/";

    // Pricing
    $price = 0;
    $originalPrice = 0;
    if (!empty($data['price_overview']) && is_array($data['price_overview'])) {
      $initial = (int) ($data['price_overview']['initial'] ?? 0);
      $final = (int) ($data['price_overview']['final'] ?? 0);

      // In Steam API for IDR, prices are stored in subunits (cents, e.g. Rp 401.000 is 40100000)
      if ($initial > 100000) {
        $originalPrice = (int) ($initial / 100);
      } else {
        $originalPrice = $initial;
      }

      if ($final > 100000) {
        $price = (int) ($final / 100);
      } else {
        $price = $final;
      }
    }

    // Categories (Matching GenreCategory models)
    $categories = [];
    $categoryIds = [];
    if (!empty($data['genres']) && is_array($data['genres'])) {
      foreach ($data['genres'] as $genre) {
        $genreName = trim((string) ($genre['description'] ?? ''));
        if (!empty($genreName)) {
          $cat = GenreCategory::whereRaw('LOWER(name) = ?', [strtolower($genreName)])->first();
          if ($cat) {
            $categories[] = [
              'id'   => $cat->id,
              'name' => $cat->name,
            ];
            $categoryIds[] = $cat->id;
          }
        }
      }
    }

    // Launcher (Match Steam launcher category)
    $launchers = [];
    $launcherIds = [];
    $steamLauncher = ProductLauncherCategory::whereRaw('LOWER(name) = ?', ['steam'])->first();
    if ($steamLauncher) {
      $launchers[] = [
        'id'   => $steamLauncher->id,
        'name' => $steamLauncher->name,
      ];
      $launcherIds[] = $steamLauncher->id;
    }

    // Specifications
    $minimumSpecs = [];
    $recommendedSpecs = [];
    if (!empty($data['pc_requirements'])) {
      $req = $data['pc_requirements'];
      if (!empty($req['minimum']) && is_string($req['minimum'])) {
        $minimumSpecs = $this->parseRequirementsHtml($req['minimum']);
      }
      if (!empty($req['recommended']) && is_string($req['recommended'])) {
        $recommendedSpecs = $this->parseRequirementsHtml($req['recommended']);
      }
    }

    return [
      'steam_app_id'    => $appId,
      'steam_url'       => $canonicalUrl,
      'name'            => $name,
      'description'     => $description,
      'image_url'       => $imageUrl,
      'price'           => $price,
      'original_price'  => $originalPrice,
      'categories'      => $categories,
      'category_ids'    => $categoryIds,
      'launchers'       => $launchers,
      'launcher_ids'    => $launcherIds,
      'specifications'  => [
        'minimum'     => $minimumSpecs,
        'recommended' => $recommendedSpecs,
      ],
    ];
  }

  /**
   * Parse HTML specification requirement strings into key-value pairs.
   *
   * @param string $html
   * @return array<int, array{type: string, value: string}>
   */
  public function parseRequirementsHtml(string $html): array
  {
    $specs = [];

    // Decode HTML entities (e.g. &reg;, &trade;, &nbsp;, &#39;)
    $cleanHtml = html_entity_decode($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // Pattern 1: <strong>Label:</strong> Value
    if (preg_match_all('/<strong>([^<:]+):?<\/strong>\s*([^<]+)/i', $cleanHtml, $matches, PREG_SET_ORDER)) {
      foreach ($matches as $match) {
        $type = trim(strip_tags($match[1]));
        $value = trim(strip_tags($match[2]));

        // Filter out non-spec header lines
        if (in_array(strtolower($type), ['minimum', 'recommended', 'additional notes', 'vr support'])) {
          continue;
        }

        if (!empty($type) && !empty($value)) {
          $specs[] = [
            'type'  => $type,
            'value' => $value,
          ];
        }
      }
    }

    // Pattern 2 fallback: <li>Label: Value</li>
    if (empty($specs) && preg_match_all('/<li>(.*?)<\/li>/is', $cleanHtml, $liMatches)) {
      foreach ($liMatches[1] as $li) {
        $plain = trim(strip_tags($li));
        if (str_contains($plain, ':')) {
          [$type, $value] = explode(':', $plain, 2);
          $type = trim($type);
          $value = trim($value);

          if (!in_array(strtolower($type), ['minimum', 'recommended', 'additional notes']) && !empty($type) && !empty($value)) {
            $specs[] = [
              'type'  => $type,
              'value' => $value,
            ];
          }
        }
      }
    }

    return $specs;
  }
}

