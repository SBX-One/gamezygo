<?php

use App\Http\Controllers\Api\V1\Admin\Dashboard\AdminDashboardController;
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
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/recent-transactions', [AdminDashboardController::class, 'recentTransactions'])->name('dashboard.recent-transactions');
  });
