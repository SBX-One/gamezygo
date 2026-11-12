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

        Route::controller(\App\Http\Controllers\Api\V1\Admin\Faq\AdminFaqController::class)
            ->prefix('faqs')
            ->group(function () {
                Route::get('/', 'index');
                Route::get('/pages', 'pages');
                Route::post('/sort', 'sort');
                Route::post('/', 'store');
                Route::delete('/', 'destroy');
                Route::get('/{faqId}', 'show')->whereNumber('faqId');
                Route::match(['put', 'patch', 'post'], '/{faqId}', 'update')->whereNumber('faqId');
                Route::match(['put', 'patch', 'post'], '/{faqId}/status', 'status')->whereNumber('faqId');
                Route::delete('/{faqId}', 'destroy')->whereNumber('faqId');
            });

        Route::controller(\App\Http\Controllers\Api\V1\Admin\Announcement\AdminAnnouncementController::class)
            ->prefix('announcements')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/sort', 'sort');
                Route::post('/', 'store');
                Route::get('/{announcementId}', 'show')->whereNumber('announcementId');
                Route::match(['put', 'patch', 'post'], '/{announcementId}', 'update')->whereNumber('announcementId');
                Route::match(['put', 'patch', 'post'], '/{announcementId}/publish', 'publish')->whereNumber('announcementId');
                Route::delete('/{announcementId}', 'destroy')->whereNumber('announcementId');
            });

        Route::controller(\App\Http\Controllers\Api\V1\Admin\Community\AdminCommunityController::class)
            ->prefix('communities')
            ->group(function () {
                Route::get('/', 'index');
                Route::get('/tags', 'tags');
                Route::post('/sort', 'sort');
                Route::post('/', 'store');
                Route::get('/{communityId}', 'show')->whereNumber('communityId');
                Route::match(['put', 'patch', 'post'], '/{communityId}', 'update')->whereNumber('communityId');
                Route::match(['put', 'patch', 'post'], '/{communityId}/status', 'status')->whereNumber('communityId');
                Route::delete('/{communityId}', 'destroy')->whereNumber('communityId');
            });

        // Product Categories & Sub-Categories
        Route::controller(\App\Http\Controllers\Api\V1\Admin\Category\AdminProductCategoryController::class)
            ->prefix('product-categories')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/', 'store');
                Route::get('/{id}', 'show')->whereNumber('id');
                Route::match(['put', 'patch', 'post'], '/{id}', 'update')->whereNumber('id');
                Route::delete('/{id}', 'destroy')->whereNumber('id');
                Route::get('/{categoryId}/sub-categories', 'subCategories')->whereNumber('categoryId');
                Route::post('/{categoryId}/sub-categories', 'storeSubCategory')->whereNumber('categoryId');
            });

        Route::controller(\App\Http\Controllers\Api\V1\Admin\Category\AdminProductSubCategoryController::class)
            ->prefix('product-sub-categories')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/', 'store');
                Route::get('/{id}', 'show')->whereNumber('id');
                Route::match(['put', 'patch', 'post'], '/{id}', 'update')->whereNumber('id');
                Route::delete('/{id}', 'destroy')->whereNumber('id');
            });

        Route::controller(\App\Http\Controllers\Api\V1\Admin\Category\AdminProductSubCategoryController::class)
            ->prefix('product-tags')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/', 'store');
                Route::get('/{id}', 'show')->whereNumber('id');
                Route::match(['put', 'patch', 'post'], '/{id}', 'update')->whereNumber('id');
                Route::delete('/{id}', 'destroy')->whereNumber('id');
            });

        // Blog Categories & Sub-Categories
        Route::controller(\App\Http\Controllers\Api\V1\Admin\Category\AdminBlogCategoryController::class)
            ->prefix('blog-categories')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/', 'store');
                Route::get('/{id}', 'show')->whereNumber('id');
                Route::match(['put', 'patch', 'post'], '/{id}', 'update')->whereNumber('id');
                Route::delete('/{id}', 'destroy')->whereNumber('id');
                Route::get('/{categoryId}/sub-categories', 'subCategories')->whereNumber('categoryId');
                Route::post('/{categoryId}/sub-categories', 'storeSubCategory')->whereNumber('categoryId');
            });

        Route::controller(\App\Http\Controllers\Api\V1\Admin\Category\AdminBlogSubCategoryController::class)
            ->prefix('blog-sub-categories')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/', 'store');
                Route::get('/{id}', 'show')->whereNumber('id');
                Route::match(['put', 'patch', 'post'], '/{id}', 'update')->whereNumber('id');
                Route::delete('/{id}', 'destroy')->whereNumber('id');
            });

        Route::controller(\App\Http\Controllers\Api\V1\Admin\Category\AdminBlogSubCategoryController::class)
            ->prefix('blog-tags')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/', 'store');
                Route::get('/{id}', 'show')->whereNumber('id');
                Route::match(['put', 'patch', 'post'], '/{id}', 'update')->whereNumber('id');
                Route::delete('/{id}', 'destroy')->whereNumber('id');
            });

        Route::controller(\App\Http\Controllers\Api\V1\Admin\Review\AdminReviewController::class)
            ->prefix('reviews')
            ->group(function () {
                Route::get('/', 'index');
                Route::delete('/', 'bulkDestroy');
                Route::get('/{id}', 'show')->whereNumber('id');
                Route::match(['put', 'patch', 'post'], '/{id}/status', 'updateStatus')->whereNumber('id');
                Route::post('/{id}/reply', 'reply')->whereNumber('id');
                Route::delete('/{id}', 'destroy')->whereNumber('id');
            });
    });
