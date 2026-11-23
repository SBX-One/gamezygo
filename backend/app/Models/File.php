<?php

namespace App\Models;

use Database\Factories\FileFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[Fillable([
    'file_name',
    'file_type',
    'file_path',
    'file_size',
])]
class File extends Model
{
    /** @use HasFactory<FileFactory> */
    use HasFactory;

    public function related(): MorphTo
    {
        return $this->morphTo();
    }
}
