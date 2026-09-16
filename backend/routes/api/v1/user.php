<?php

use App\Http\Controllers\Api\V1\User\CustomSection\CustomSectionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\User\Product\ProductController;

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

                Route::controller(CustomSectionController::class)
                    ->prefix('/custom-sections')
                    ->name('custom-sections.')
                    ->group(function () {
                        Route::get('/', 'index')->name('index');
                    });
            });
    });