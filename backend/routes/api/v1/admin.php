<?php

use App\Http\Controllers\Api\V1\Admin\Blog\AdminBlogController;
use App\Http\Controllers\Api\V1\Admin\Catalog\AdminCatalogController;
use App\Http\Controllers\Api\V1\Admin\CustomSection\AdminCustomSectionController;
use App\Http\Controllers\Api\V1\Admin\Dashboard\AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\GameRequest\AdminGameRequestController;
use App\Http\Controllers\Api\V1\Admin\Revenue\AdminRevenueController;
use App\Http\Controllers\Api\V1\Admin\Subscription\AdminSubscriptionController;
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

    // Revenue Analytics
    Route::controller(AdminRevenueController::class)
      ->prefix('revenue')
      ->name('revenue.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/product/{id}', 'productRevenue')->name('product');
      });

    // Custom Section Management
    Route::controller(AdminCustomSectionController::class)
      ->prefix('custom-sections')
      ->name('custom-sections.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::post('/sort', 'sortSections')->name('sort');
        Route::get('/all-products', 'allProducts')->name('all-products');
        Route::match(['put', 'patch'], '/{sectionId}', 'update')->name('update')->whereNumber('sectionId');
        Route::delete('/{sectionId}', 'destroy')->name('destroy')->whereNumber('sectionId');
        Route::post('/{sectionId}/products', 'addProducts')->name('products.store')->whereNumber('sectionId');
        Route::delete('/{sectionId}/products/{productId}', 'removeProduct')->name('products.destroy')->whereNumber('sectionId')->whereNumber('productId');
        Route::delete('/{sectionId}/products', 'clearProducts')->name('products.clear')->whereNumber('sectionId');
        Route::post('/{sectionId}/products/sort', 'sortProducts')->name('products.sort')->whereNumber('sectionId');
      });

    // Subscription Management
    Route::controller(AdminSubscriptionController::class)
      ->prefix('subscriptions')
      ->name('subscriptions.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/active-subs', 'activeSubs')->name('active-subs');
        Route::get('/products', 'products')->name('products.index');
        Route::post('/products', 'addProducts')->name('products.store');
        Route::delete('/products/{productId?}', 'removeProduct')->name('products.destroy');
        Route::match(['put', 'patch'], '/{subscriptionId}', 'update')->name('update')->whereNumber('subscriptionId');
        Route::get('/{subscriptionId}/features', 'features')->name('features.index')->whereNumber('subscriptionId');
        Route::match(['put', 'patch', 'post'], '/{subscriptionId}/features/{featureId?}', 'syncFeatures')->name('features.sync')->whereNumber('subscriptionId');
        Route::delete('/{subscriptionId}/features/{featureId}', 'deleteFeature')->name('features.destroy')->whereNumber('subscriptionId')->whereNumber('featureId');
      });

    // Blog Management
    Route::controller(AdminBlogController::class)
      ->prefix('blogs')
      ->name('blogs.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::match(['post', 'put', 'patch'], '/publish', 'publish')->name('publish.bulk');
        Route::delete('/', 'destroy')->name('destroy.bulk');
        Route::get('/{blogId}', 'show')->name('show')->whereNumber('blogId');
        Route::match(['put', 'patch', 'post'], '/{blogId}', 'update')->name('update')->whereNumber('blogId');
        Route::delete('/{blogId}', 'destroy')->name('destroy')->whereNumber('blogId');
        Route::match(['post', 'put', 'patch'], '/{blogId}/publish', 'publish')->name('publish')->whereNumber('blogId');
      });

    // Game Requests Management
    Route::controller(AdminGameRequestController::class)
      ->prefix('game-requests')
      ->name('game-requests.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::match(['post', 'put', 'patch'], '/status', 'updateStatus')->name('status');
        Route::get('/{gameRequestId}', 'show')->name('show')->whereNumber('gameRequestId');
        Route::match(['post', 'put', 'patch'], '/{gameRequestId}/pin', 'togglePin')->name('pin')->whereNumber('gameRequestId');
      });
  });
