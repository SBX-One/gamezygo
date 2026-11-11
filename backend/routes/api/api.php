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

        Route::controller(\App\Http\Controllers\Api\V1\Admin\Voucher\AdminVoucherController::class)
            ->prefix('vouchers')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/', 'store');
                Route::delete('/', 'destroy');
                Route::get('/export', 'export');
                Route::get('/eligible-products', 'eligibleProducts');
                Route::get('/eligible-users', 'eligibleUsers');
                Route::get('/{voucherId}', 'show')->whereNumber('voucherId');
                Route::match(['put', 'patch', 'post'], '/{voucherId}', 'update')->whereNumber('voucherId');
                Route::match(['put', 'patch', 'post'], '/{voucherId}/status', 'status')->whereNumber('voucherId');
                Route::get('/{voucherId}/analytics', 'analytics')->whereNumber('voucherId');
                Route::get('/{voucherId}/usages', 'usages')->whereNumber('voucherId');
                Route::get('/{voucherId}/usages/export', 'exportUsages')->whereNumber('voucherId');
                Route::post('/{voucherId}/products', 'addProducts')->whereNumber('voucherId');
                Route::delete('/{voucherId}/products', 'removeProducts')->whereNumber('voucherId');
                Route::post('/{voucherId}/users', 'addUsers')->whereNumber('voucherId');
                Route::delete('/{voucherId}/users', 'removeUsers')->whereNumber('voucherId');
            });

        Route::controller(\App\Http\Controllers\Api\V1\Admin\Instruction\AdminInstructionController::class)
            ->prefix('instructions')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/', 'store');
                Route::get('/{instructionId}', 'show')->whereNumber('instructionId');
                Route::match(['put', 'patch', 'post'], '/{instructionId}', 'update')->whereNumber('instructionId');
                Route::delete('/{instructionId}', 'destroy')->whereNumber('instructionId');
            });
    });
