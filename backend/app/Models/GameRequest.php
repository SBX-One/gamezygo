<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'name',
    'steam_url',
    'request_count',
    'note',
    'status',
    'admin_note',
])]
class GameRequest extends Model
{
    /** @use HasFactory<\Database\Factories\GameRequestFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'request_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
