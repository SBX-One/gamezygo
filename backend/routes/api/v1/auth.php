<?php

use App\Http\Controllers\Api\V1\User\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')
    ->name('auth.')
    ->group(function () {
        // Public Google OAuth endpoints
        Route::controller(AuthController::class)->group(function () {
            Route::get('/google/redirect', 'redirectToGoogle')->name('google.redirect');
            Route::get('/google/callback', 'handleGoogleCallback')->name('google.callback');
            Route::get('/google-login/callback', 'handleGoogleCallback')->name('google-login.callback');

            // Token login endpoints
            Route::post('/google-login', 'googleLogin')->name('google-login');
            Route::post('/google', 'googleLogin')->name('google');
        });

        // Protected endpoints
        Route::middleware(['auth:sanctum'])
            ->controller(AuthController::class)
            ->group(function () {
                Route::get('/me', 'me')->name('me');
                Route::post('/logout', 'logout')->name('logout');
            });
    });
