<?php

use App\Http\Controllers\Api\V1\User\Announcement\AnnouncementController;
use App\Http\Controllers\Api\V1\User\Blog\BlogController;
use App\Http\Controllers\Api\V1\User\Cart\CartController;
use App\Http\Controllers\Api\V1\User\CustomSection\CustomSectionController;
use App\Http\Controllers\Api\V1\User\Faq\FaqController;
use App\Http\Controllers\Api\V1\User\GameRequest\GameRequestController;
use App\Http\Controllers\Api\V1\User\Leaderboard\LeaderboardController;
use App\Http\Controllers\Api\V1\User\Order\OrderController;
use App\Http\Controllers\Api\V1\User\Payment\PaymentController;
use App\Http\Controllers\Api\V1\User\Product\ProductController;
use App\Http\Controllers\Api\V1\User\Profile\ProfileController;
use App\Http\Controllers\Api\V1\User\Review\ReviewController;
use App\Http\Controllers\Api\V1\User\SubscriptionPlan\SubscriptionPlanController;
use App\Http\Controllers\Api\V1\User\UserSubscription\UserSubscriptionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public / Guest Routes (Accessible without 'user' prefix or auth)
|--------------------------------------------------------------------------
| These endpoints are publicly accessible by guests. They do NOT carry
| the 'user' prefix because they are public storefront/catalog resources.
*/
Route::group([], function () {
  // Products catalog
  Route::controller(ProductController::class)
    ->prefix('products')
    ->name('products.')
    ->group(function () {
      Route::get('/', 'index')->name('index');
      Route::get('/filters', 'filters')->name('filters');
      Route::get('/{product:slug}', 'show')->name('show');
    });

  // Custom sections
  Route::get('custom-sections', [CustomSectionController::class, 'index'])->name('custom-sections.index');

  // Subscription plans
  Route::get('subscriptions', [SubscriptionPlanController::class, 'index'])->name('subscriptions.index');

  // Blogs
  Route::controller(BlogController::class)
    ->prefix('blogs')
    ->name('blogs.')
    ->group(function () {
      Route::get('/', 'index')->name('index');
      Route::get('/{blog:slug}', 'show')->name('show');
    });

  // Reviews (Public approved reviews & ?scope=mine for authenticated user)
  Route::get('reviews', [ReviewController::class, 'index'])->name('reviews.index');

  // Leaderboards
  Route::get('leaderboards', [LeaderboardController::class, 'index'])->name('leaderboards.index');

  // FAQs
  Route::get('faqs', [FaqController::class, 'index'])->name('faqs.index');

  // Announcements
  Route::get('announcements', [AnnouncementController::class, 'index'])->name('announcements.index');

  // Game requests (Public listing, ?scope=mine, ?scope=added)
  Route::get('game-requests', [GameRequestController::class, 'index'])->name('game-requests.index');
});

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Requires auth:api,sanctum under 'user' prefix)
|--------------------------------------------------------------------------
| All customer/user account actions are grouped strictly under '/user'
| and protected by authentication. Each action has exactly 1 URL.
*/
Route::prefix('user')
  ->name('user.')
  ->middleware(['auth:api,sanctum'])
  ->group(function () {

    // Profile
    Route::controller(ProfileController::class)
      ->prefix('profile')
      ->name('profile.')
      ->group(function () {
        Route::get('/', 'show')->name('show');
        Route::get('/leaderboard', 'leaderboard')->name('leaderboard');
        Route::match(['put', 'post'], '/', 'update')->name('update');
        Route::match(['put', 'patch', 'post'], '/change-password', 'changePassword')->name('change-password');
        Route::get('/products', 'products')->name('products');
      });

    // User subscriptions
    Route::controller(UserSubscriptionController::class)
      ->prefix('subscriptions')
      ->name('subscriptions.')
      ->group(function () {
        Route::get('/', 'show')->name('index');
        Route::get('/products', 'products')->name('products');
      });

    // Product credentials delivery
    Route::controller(ProductController::class)
      ->prefix('products')
      ->name('products.')
      ->group(function () {
        Route::get('/{slug}/credentials', 'credentials')->name('credentials');
      });

    // Shopping cart
    Route::controller(CartController::class)
      ->prefix('cart')
      ->name('cart.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::delete('/clear', 'clear')->name('clear');
        Route::delete('/{productId?}', 'destroy')->name('destroy');
      });

    // Orders & vouchers
    Route::controller(OrderController::class)
      ->prefix('orders')
      ->name('orders.')
      ->group(function () {
        Route::post('/', 'store')->name('store');
        Route::get('/{orderId}', 'show')->name('show');
        Route::post('/{orderId}/voucher', 'applyVoucher')->name('apply-voucher');
        Route::delete('/{orderId}/voucher', 'removeVoucher')->name('remove-voucher');
      });

    // Payments
    Route::controller(PaymentController::class)
      ->group(function () {
        Route::post('orders/{orderId}/payments', 'pay')->name('orders.pay');
        Route::get('payments/{reference}/status', 'status')->name('payments.status');
      });

    // Game requests
    Route::controller(GameRequestController::class)
      ->prefix('game-requests')
      ->name('game-requests.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('', 'store')->name('store');
        Route::delete('/{id}', 'destroy')->name('destroy');
      });

    // Reviews
    Route::controller(ReviewController::class)
      ->prefix('reviews')
      ->name('reviews.')
      ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('', 'store')->name('store');
        Route::match(['put', 'patch', 'post'], '/{id}', 'update')->name('update');
        Route::delete('/{id}', 'destroy')->name('destroy');
      });
  });