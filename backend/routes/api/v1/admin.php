<?php

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
    // Admin management and CMS routes will be defined here
  });
