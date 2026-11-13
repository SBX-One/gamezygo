<?php

use App\Http\Controllers\Api\V1\Admin\Announcement\AdminAnnouncementController;
use App\Http\Controllers\Api\V1\Admin\Blog\AdminBlogController;
use App\Http\Controllers\Api\V1\Admin\Catalog\AdminCatalogController;
use App\Http\Controllers\Api\V1\Admin\Category\AdminBlogCategoryController;
use App\Http\Controllers\Api\V1\Admin\Category\AdminBlogSubCategoryController;
use App\Http\Controllers\Api\V1\Admin\Category\AdminProductCategoryController;
use App\Http\Controllers\Api\V1\Admin\Category\AdminProductSubCategoryController;
use App\Http\Controllers\Api\V1\Admin\Community\AdminCommunityController;
use App\Http\Controllers\Api\V1\Admin\CustomSection\AdminCustomSectionController;
use App\Http\Controllers\Api\V1\Admin\Dashboard\AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\Faq\AdminFaqController;
use App\Http\Controllers\Api\V1\Admin\GameRequest\AdminGameRequestController;
use App\Http\Controllers\Api\V1\Admin\Instruction\AdminInstructionController;
use App\Http\Controllers\Api\V1\Admin\Revenue\AdminRevenueController;
use App\Http\Controllers\Api\V1\Admin\Review\AdminReviewController;
use App\Http\Controllers\Api\V1\Admin\Subscription\AdminSubscriptionController;
use App\Http\Controllers\Api\V1\Admin\User\AdminUserController;
use App\Http\Controllers\Api\V1\Admin\Voucher\AdminVoucherController;
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

    // Voucher Management
    Route::controller(AdminVoucherController::class)
      ->prefix('vouchers')
      ->name('vouchers.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::delete('/', 'destroy')->name('destroy.bulk');
        Route::get('/export', 'export')->name('export');
        Route::get('/eligible-products', 'eligibleProducts')->name('eligible-products');
        Route::get('/eligible-users', 'eligibleUsers')->name('eligible-users');
        Route::get('/{voucherId}', 'show')->name('show')->whereNumber('voucherId');
        Route::match(['put', 'patch', 'post'], '/{voucherId}', 'update')->name('update')->whereNumber('voucherId');
        Route::match(['put', 'patch', 'post'], '/{voucherId}/status', 'status')->name('status')->whereNumber('voucherId');
        Route::get('/{voucherId}/analytics', 'analytics')->name('analytics')->whereNumber('voucherId');
        Route::get('/{voucherId}/usages', 'usages')->name('usages')->whereNumber('voucherId');
        Route::get('/{voucherId}/usages/export', 'exportUsages')->name('usages.export')->whereNumber('voucherId');
        Route::post('/{voucherId}/products', 'addProducts')->name('products.store')->whereNumber('voucherId');
        Route::delete('/{voucherId}/products', 'removeProducts')->name('products.destroy')->whereNumber('voucherId');
        Route::post('/{voucherId}/users', 'addUsers')->name('users.store')->whereNumber('voucherId');
        Route::delete('/{voucherId}/users', 'removeUsers')->name('users.destroy')->whereNumber('voucherId');
      });

    // Instruction Template Management
    Route::controller(AdminInstructionController::class)
      ->prefix('instructions')
      ->name('instructions.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::get('/{instructionId}', 'show')->name('show')->whereNumber('instructionId');
        Route::match(['put', 'patch', 'post'], '/{instructionId}', 'update')->name('update')->whereNumber('instructionId');
        Route::delete('/{instructionId}', 'destroy')->name('destroy')->whereNumber('instructionId');
      });

    // FAQ Management
    Route::controller(AdminFaqController::class)
      ->prefix('faqs')
      ->name('faqs.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/pages', 'pages')->name('pages');
        Route::post('/sort', 'sort')->name('sort');
        Route::post('/', 'store')->name('store');
        Route::delete('/', 'destroy')->name('destroy.bulk');
        Route::get('/{faqId}', 'show')->name('show')->whereNumber('faqId');
        Route::match(['put', 'patch', 'post'], '/{faqId}', 'update')->name('update')->whereNumber('faqId');
        Route::match(['put', 'patch', 'post'], '/{faqId}/status', 'status')->name('status')->whereNumber('faqId');
        Route::delete('/{faqId}', 'destroy')->name('destroy')->whereNumber('faqId');
      });

    // Announcement Management
    Route::controller(AdminAnnouncementController::class)
      ->prefix('announcements')
      ->name('announcements.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/sort', 'sort')->name('sort');
        Route::post('/', 'store')->name('store');
        Route::get('/{announcementId}', 'show')->name('show')->whereNumber('announcementId');
        Route::match(['put', 'patch', 'post'], '/{announcementId}', 'update')->name('update')->whereNumber('announcementId');
        Route::match(['put', 'patch', 'post'], '/{announcementId}/publish', 'publish')->name('publish')->whereNumber('announcementId');
        Route::delete('/{announcementId}', 'destroy')->name('destroy')->whereNumber('announcementId');
      });

    // Community Management
    Route::controller(AdminCommunityController::class)
      ->prefix('communities')
      ->name('communities.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/tags', 'tags')->name('tags');
        Route::post('/sort', 'sort')->name('sort');
        Route::post('/', 'store')->name('store');
        Route::get('/{communityId}', 'show')->name('show')->whereNumber('communityId');
        Route::match(['put', 'patch', 'post'], '/{communityId}', 'update')->name('update')->whereNumber('communityId');
        Route::match(['put', 'patch', 'post'], '/{communityId}/status', 'status')->name('status')->whereNumber('communityId');
        Route::delete('/{communityId}', 'destroy')->name('destroy')->whereNumber('communityId');
      });

    // Product Category & Sub-Category Management
    Route::controller(AdminProductCategoryController::class)
      ->prefix('product-categories')
      ->name('product-categories.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::get('/{id}', 'show')->name('show')->whereNumber('id');
        Route::match(['put', 'patch', 'post'], '/{id}', 'update')->name('update')->whereNumber('id');
        Route::delete('/{id}', 'destroy')->name('destroy')->whereNumber('id');
        Route::get('/{categoryId}/sub-categories', 'subCategories')->name('sub-categories.index')->whereNumber('categoryId');
        Route::post('/{categoryId}/sub-categories', 'storeSubCategory')->name('sub-categories.store')->whereNumber('categoryId');
      });

    Route::controller(AdminProductSubCategoryController::class)
      ->prefix('product-sub-categories')
      ->name('product-sub-categories.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::get('/{id}', 'show')->name('show')->whereNumber('id');
        Route::match(['put', 'patch', 'post'], '/{id}', 'update')->name('update')->whereNumber('id');
        Route::delete('/{id}', 'destroy')->name('destroy')->whereNumber('id');
      });

    // Product Tags Alias
    Route::controller(AdminProductSubCategoryController::class)
      ->prefix('product-tags')
      ->name('product-tags.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::get('/{id}', 'show')->name('show')->whereNumber('id');
        Route::match(['put', 'patch', 'post'], '/{id}', 'update')->name('update')->whereNumber('id');
        Route::delete('/{id}', 'destroy')->name('destroy')->whereNumber('id');
      });

    // Blog Category & Sub-Category Management
    Route::controller(AdminBlogCategoryController::class)
      ->prefix('blog-categories')
      ->name('blog-categories.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::get('/{id}', 'show')->name('show')->whereNumber('id');
        Route::match(['put', 'patch', 'post'], '/{id}', 'update')->name('update')->whereNumber('id');
        Route::delete('/{id}', 'destroy')->name('destroy')->whereNumber('id');
        Route::get('/{categoryId}/sub-categories', 'subCategories')->name('sub-categories.index')->whereNumber('categoryId');
        Route::post('/{categoryId}/sub-categories', 'storeSubCategory')->name('sub-categories.store')->whereNumber('categoryId');
      });

    Route::controller(AdminBlogSubCategoryController::class)
      ->prefix('blog-sub-categories')
      ->name('blog-sub-categories.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::get('/{id}', 'show')->name('show')->whereNumber('id');
        Route::match(['put', 'patch', 'post'], '/{id}', 'update')->name('update')->whereNumber('id');
        Route::delete('/{id}', 'destroy')->name('destroy')->whereNumber('id');
      });

    // Blog Tags Alias
    Route::controller(AdminBlogSubCategoryController::class)
      ->prefix('blog-tags')
      ->name('blog-tags.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::get('/{id}', 'show')->name('show')->whereNumber('id');
        Route::match(['put', 'patch', 'post'], '/{id}', 'update')->name('update')->whereNumber('id');
        Route::delete('/{id}', 'destroy')->name('destroy')->whereNumber('id');
      });

    // Review Management
    Route::controller(AdminReviewController::class)
      ->prefix('reviews')
      ->name('reviews.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::delete('/', 'bulkDestroy')->name('destroy.bulk');
        Route::get('/{id}', 'show')->name('show')->whereNumber('id');
        Route::match(['put', 'patch', 'post'], '/{id}/status', 'updateStatus')->name('status')->whereNumber('id');
        Route::post('/{id}/reply', 'reply')->name('reply')->whereNumber('id');
        Route::delete('/{id}', 'destroy')->name('destroy')->whereNumber('id');
      });

    // User Management
    Route::controller(AdminUserController::class)
      ->prefix('users')
      ->name('users.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{userId}', 'show')->name('show')->whereNumber('userId');
        Route::match(['put', 'patch', 'post'], '/{userId}', 'update')->name('update')->whereNumber('userId');
        Route::match(['put', 'patch', 'post'], '/{userId}/status', 'status')->name('status')->whereNumber('userId');
        Route::post('/{userId}/suspend', 'suspend')->name('suspend')->whereNumber('userId');
        Route::post('/{userId}/unsuspend', 'unsuspend')->name('unsuspend')->whereNumber('userId');
        Route::delete('/{userId}', 'destroy')->name('destroy')->whereNumber('userId');
        Route::get('/{userId}/devices', 'devices')->name('devices')->whereNumber('userId');
        Route::get('/{userId}/products', 'products')->name('products')->whereNumber('userId');
        Route::get('/{userId}/transactions', 'transactions')->name('transactions')->whereNumber('userId');
        Route::get('/{userId}/points/history', 'pointsHistory')->name('points.history')->whereNumber('userId');
      });
  });
