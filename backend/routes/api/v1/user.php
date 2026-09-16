<?php

use App\Http\Controllers\Api\V1\User\Blog\BlogController;
use App\Http\Controllers\Api\V1\User\CustomSection\CustomSectionController;
use App\Http\Controllers\Api\V1\User\Product\ProductController;
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
            });
    });