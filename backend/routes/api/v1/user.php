<?php

use App\Http\Controllers\Api\V1\User\Announcement\AnnouncementController;
use App\Http\Controllers\Api\V1\User\Blog\BlogController;
use App\Http\Controllers\Api\V1\User\CustomSection\CustomSectionController;
use App\Http\Controllers\Api\V1\User\Faq\FaqController;
use App\Http\Controllers\Api\V1\User\Leaderboard\LeaderboardController;
use App\Http\Controllers\Api\V1\User\Product\ProductController;
use App\Http\Controllers\Api\V1\User\Profile\ProfileController;
use App\Http\Controllers\Api\V1\User\Review\ReviewController;
use App\Http\Controllers\Api\V1\User\SubscriptionPlan\SubscriptionPlanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('user')
    ->name('user.')
    ->group(function () {
        Route::middleware(['guest'])
            ->group(function () {

                // Product guest endpoint
                Route::controller(ProductController::class)
                    ->prefix('/products')
                    ->name('products.')
                    ->group(function () {
                        Route::get('/', 'index')->name('index');
                        Route::get('/{product:slug}', 'show')->name('show');
                    });

                // Custom Sections guest endpoint
                Route::controller(CustomSectionController::class)
                    ->prefix('/custom-sections')
                    ->name('custom-sections.')
                    ->group(function () {
                        Route::get('/', 'index')->name('index');
                    });

                // Subscriptions guest endpoint
                Route::controller(SubscriptionPlanController::class)
                    ->prefix('/subscriptions')
                    ->name('subscriptions.')
                    ->group(function () {
                        Route::get('/', 'index')->name('index');
                    });

                // Blogs guest endpoint
                Route::controller(BlogController::class)
                    ->prefix('/blogs')
                    ->name('blogs.')
                    ->group(function () {
                        Route::get('/', 'index')->name('index');
                        Route::get('/{blog:slug}', 'show')->name('show');
                    });

                // Reviews guest endpoint
                Route::controller(ReviewController::class)
                    ->prefix('/reviews')
                    ->name('reviews.')
                    ->group(function () {
                        Route::get('/', 'index')->name('index');
                    });

                // Leaderboards guest endpoint
                Route::controller(LeaderboardController::class)
                    ->prefix('/leaderboards')
                    ->name('leaderboards.')
                    ->group(function () {
                        Route::get('/', 'index')->name('index');
                    });

                // FAQs guest endpoint
                Route::controller(FaqController::class)
                    ->prefix('/faqs')
                    ->name('faqs.')
                    ->group(function () {
                        Route::get('/', 'index')->name('index');
                    });

                // Announcements guest endpoint
                Route::controller(AnnouncementController::class)
                    ->prefix('/announcements')
                    ->name('announcements.')
                    ->group(function () {
                        Route::get('/', 'index')->name('index');
                    });
            });

        Route::middleware(['auth:api,sanctum'])
            ->group(function () {
                // Profile authenticated endpoints
                Route::controller(ProfileController::class)
                    ->prefix('/profile')
                    ->name('profile.')
                    ->group(function () {
                        Route::get('/', 'show')->name('show');
                        Route::match(['put', 'patch', 'post'], '/', 'update')->name('update');
                    });
            });
    });