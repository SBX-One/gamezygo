<?php

namespace App\Models;

use Database\Factories\UserPointHistoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'type',
    'points',
    'balance_before',
    'balance_after',
    'description',
])]
class UserPointHistory extends Model
{
    /** @use HasFactory<UserPointHistoryFactory> */
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
