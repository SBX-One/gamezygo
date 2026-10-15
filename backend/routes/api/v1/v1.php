<?php
require __DIR__ . "/auth.php";
require __DIR__ . "/user.php";
require __DIR__ . "/admin.php";

use App\Http\Controllers\Api\V1\User\Order\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api,sanctum'])
    ->controller(OrderController::class)
    ->prefix('orders')
    ->name('orders.')
    ->group(function () {
        Route::post('/', 'store')->name('store');
        Route::get('/{orderId}', 'show')->name('show');
    });