<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

#[Fillable([
    'name',
    'email',
    'google_id',
    'avatar_url',
    'password',
    'phone',
    'status',
    'total_points',
    'total_transaction',
    'email_verified_at',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function ownedGames(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'user_owned_games');
    }

    public function vouchers(): BelongsToMany
    {
        return $this->belongsToMany(Voucher::class, 'voucher_users');
    }

    public function cartItems(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'user_cart_items')
            ->withPivot('id', 'created_at', 'updated_at')
            ->withTimestamps();
    }

    public function wishlists(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'user_wishlists');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(UserSubscription::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(UserSubscription::class)
            ->where('status', 'active')
            ->where('expired_at', '>', now())
            ->orderByDesc('expired_at');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function reviewReplies(): HasMany
    {
        return $this->hasMany(ReviewReply::class);
    }

    public function blogs(): HasMany
    {
        return $this->hasMany(Blog::class, 'author_id');
    }

    public function gameRequests(): HasMany
    {
        return $this->hasMany(GameRequest::class);
    }

    public function avatar(): MorphOne
    {
        return $this->morphOne(File::class, 'related');
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'related');
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims(): array
    {
        return [
            'email'  => $this->email,
            'status' => $this->status,
        ];
    }
}
