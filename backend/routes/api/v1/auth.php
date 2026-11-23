<?php

use App\Http\Controllers\Api\V1\Admin\Auth\AdminAuthController;
use App\Http\Controllers\Api\V1\User\Auth\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes (User & Admin)
|--------------------------------------------------------------------------
| Consolidated authentication endpoints for both users and administrators.
*/

// =========================================================================
// User / Customer Authentication
// =========================================================================
Route::prefix('auth')
    ->name('auth.')
    ->group(function () {
        // Public User Auth & Google OAuth endpoints
        Route::controller(AuthController::class)->group(function () {
            Route::post('/register', 'register')->name('register');
            Route::post('/login', 'login')->name('login');
            Route::post('/refresh', 'refresh')->name('refresh');

            // Google OAuth endpoints
            Route::get('/google/redirect', 'redirectToGoogle')->name('google.redirect');
            Route::get('/google/callback', 'handleGoogleCallback')->name('google.callback');
            Route::post('/google-login', 'googleLogin')->name('google-login');
        });

        // Protected User Auth endpoints
        Route::middleware(['auth:api,sanctum'])
            ->controller(AuthController::class)
            ->group(function () {
                Route::match(['post', 'delete'], '/logout', 'logout')->name('logout');
            });
    });

// =========================================================================
// Administrator Authentication
// =========================================================================
Route::prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Public Admin Login endpoint
        Route::controller(AdminAuthController::class)->group(function () {
            Route::post('/login', 'login')->name('login');
        });

        // Protected Admin Auth endpoints
        Route::middleware(['auth:admin', 'admin.only'])
            ->controller(AdminAuthController::class)
            ->group(function () {
                Route::post('/refresh', 'refresh')->name('refresh');
                Route::match(['post', 'delete'], '/logout', 'logout')->name('logout');
            });
    });
