<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1/')
    ->name('v1.')
    ->group(function() {
        require __DIR__ . "/v1/v1.php";
    });

// Direct alias without v1 prefix for /api/admin/game-requests
Route::middleware(['auth:admin', 'admin.only'])
    ->prefix('admin')
    ->group(function () {
        Route::controller(\App\Http\Controllers\Api\V1\Admin\GameRequest\AdminGameRequestController::class)
            ->prefix('game-requests')
            ->group(function () {
                Route::get('/', 'index');
                Route::match(['post', 'put', 'patch'], '/status', 'updateStatus');
                Route::get('/{gameRequestId}', 'show')->whereNumber('gameRequestId');
                Route::match(['post', 'put', 'patch'], '/{gameRequestId}/pin', 'togglePin')->whereNumber('gameRequestId');
            });
    });
