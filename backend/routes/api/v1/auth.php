<?php

use App\Http\Controllers\Api\V1\User\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')
  ->name('auth.')
  ->group(function () {
    // Public Auth & Google OAuth endpoints
    Route::controller(AuthController::class)->group(function () {
      // JWT Email/Password authentication
      Route::post('/register', 'register')->name('register');
      Route::post('/login', 'login')->name('login');
      Route::post('/refresh', 'refresh')->name('refresh');

      // Google OAuth redirect & callback endpoints
      Route::get('/google/redirect', 'redirectToGoogle')->name('google.redirect');
      Route::get('/google/callback', 'handleGoogleCallback')->name('google.callback');

      // Google Token login endpoint
      Route::post('/google-login', 'googleLogin')->name('google-login');
    });

    // Protected endpoints (supports both JWT api guard and Sanctum)
    Route::middleware(['auth:api,sanctum'])
      ->controller(AuthController::class)
      ->group(function () {
        Route::get('/me', 'me')->name('me');
        Route::match(['post', 'delete'], '/logout', 'logout')->name('logout');
      });
  });
