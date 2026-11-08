<?php

use App\Http\Controllers\Api\V1\Admin\Catalog\AdminCatalogController;
use App\Http\Controllers\Api\V1\Admin\Dashboard\AdminDashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Management Routes
|--------------------------------------------------------------------------
| Routes for admin dashboard, catalog CMS, stock imports, and reports.
| Authentication routes are consolidated in routes/api/v1/auth.php.
*/

Route::prefix('admin')
  ->name('admin.')
  ->middleware(['auth:admin', 'admin.only'])
  ->group(function () {

    // Dashboard & Analytics
    Route::controller(AdminDashboardController::class)
      ->prefix('dashboard')
      ->group(function () {
        Route::get('/', 'index')->name('dashboard');
        Route::get('/recent-transactions', 'recentTransactions')->name('dashboard.recent-transactions');
      });

    // Catalog & Game Management
    Route::controller(AdminCatalogController::class)
      ->prefix('catalog')
      ->name('catalog.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/archive', 'archiveIndex')->name('archive.index');
        Route::match(['get', 'post'], '/steam-data', 'fetchSteamData')->name('steam-data');
        Route::post('/', 'store')->name('store');
        Route::get('/{id}', 'show')->name('show');
        Route::match(['put', 'post'], '/{id}', 'update')->name('update');
        Route::delete('/', 'destroy')->name('destroy');
        Route::match(['post', 'put', 'patch'], '/archive/{productId}', 'archiveStatus')->name('archive.status');
      });
  });
