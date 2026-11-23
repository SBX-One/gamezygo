<?php

namespace App\Services\Library;

use App\Models\GameCredential;
use App\Models\Product;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Crypt;
use Throwable;

class LibraryService
{
    /**
     * Data Isolation Shield: Constrain credential queries strictly to the authenticated user ID
     * and decrypt credentials on-the-fly.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getLibrary(User $user): array
    {
        $userId = $user->id;

        // Strict row-level isolation query
        $credentials = GameCredential::where('assigned_to_user_id', $userId)
            ->where('status', GameCredential::STATUS_SOLD)
            ->with(['product.files'])
            ->orderByDesc('updated_at')
            ->get();

        return $credentials->map(function (GameCredential $item) {
            $product = $item->product;

            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'game_title' => $product?->name ?? 'Unknown Game',
                'slug' => $product?->slug,
                'cover_image_url' => $product?->thumbnail,
                'credentials' => [
                    'username' => $this->safeDecrypt($item->username),
                    'password' => $this->safeDecrypt($item->password),
                    'access_token' => $item->access_token ? $this->safeDecrypt($item->access_token) : null,
                ],
                'purchase_date' => $item->updated_at?->toISOString() ?? now()->toISOString(),
            ];
        })->values()->all();
    }

    /**
     * Data Isolation Shield: Retrieve credentials for a specific game owned by the user.
     * Enforces row-level isolation and throws AuthorizationException if unauthorized.
     *
     * @param  string|int  $productIdentifier  Slug or ID of the product
     * @return array<string, mixed>
     *
     * @throws ModelNotFoundException
     * @throws AuthorizationException
     */
    public function getProductCredentials(User $user, string|int $productIdentifier): array
    {
        $product = is_numeric($productIdentifier)
          ? Product::find((int) $productIdentifier)
          : Product::where('slug', $productIdentifier)->first();

        if (! $product) {
            throw new ModelNotFoundException('Product not found.');
        }

        // Strict Row-Level Security: Only fetch credentials assigned to authenticated user ID
        $credential = GameCredential::where('product_id', $product->id)
            ->where('assigned_to_user_id', $user->id)
            ->where('status', GameCredential::STATUS_SOLD)
            ->first();

        if (! $credential) {
            // Check if user owns the game in user_owned_games
            $ownsGame = $user->ownedGames()->where('products.id', $product->id)->exists();

            if (! $ownsGame) {
                throw new AuthorizationException('You do not own this game in your library.');
            }

            // Legacy fallback: Check product game account
            $legacyAccount = $product->gameAccount;
            if ($legacyAccount) {
                return [
                    'id' => $legacyAccount->id,
                    'product_id' => $product->id,
                    'game_title' => $product->name,
                    'slug' => $product->slug,
                    'cover_image_url' => $product->thumbnail,
                    'credentials' => [
                        'username' => $this->safeDecrypt($legacyAccount->username),
                        'password' => $this->safeDecrypt($legacyAccount->password),
                        'access_token' => null,
                    ],
                    'purchase_date' => $legacyAccount->updated_at?->toISOString() ?? now()->toISOString(),
                ];
            }

            throw new ModelNotFoundException('Credentials not available for this game.');
        }

        return [
            'id' => $credential->id,
            'product_id' => $product->id,
            'game_title' => $product->name,
            'slug' => $product->slug,
            'cover_image_url' => $product->thumbnail,
            'credentials' => [
                'username' => $this->safeDecrypt($credential->username),
                'password' => $this->safeDecrypt($credential->password),
                'access_token' => $credential->access_token ? $this->safeDecrypt($credential->access_token) : null,
            ],
            'purchase_date' => $credential->updated_at?->toISOString() ?? now()->toISOString(),
        ];
    }

    /**
     * Decrypt sensitive credentials safely.
     */
    protected function safeDecrypt(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            return Crypt::decryptString($value);
        } catch (Throwable) {
            // Return as-is if already decrypted by model cast or stored plaintext
            return $value;
        }
    }
}
