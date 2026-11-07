<?php

use App\Http\Controllers\Api\V1\Admin\Auth\AdminAuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
| Dedicated routes for administrator access, separated from user routes.
| Base URL: /api/v1/admin/
*/

Route::prefix('admin')
  ->name('admin.')
  ->group(function () {

    // Public Admin Auth endpoint (Single URL: POST /api/v1/admin/login)
    Route::controller(AdminAuthController::class)->group(function () {
      Route::post('login', 'login')->name('login');
    });

    // Protected Admin Auth endpoints (auth:admin + admin.only)
    Route::middleware(['auth:admin', 'admin.only'])
      ->controller(AdminAuthController::class)
      ->group(function () {
        Route::get('me', 'me')->name('me');
        Route::post('refresh', 'refresh')->name('refresh');
        Route::delete('logout', 'logout')->name('logout');
      });
  });
