<?php
require __DIR__ . "/auth.php";
require __DIR__ . "/user.php";
require __DIR__ . "/admin.php";

use App\Http\Controllers\Api\V1\User\Order\OrderController;
use App\Http\Controllers\Api\V1\User\Payment\PaymentController;
use App\Http\Controllers\Api\V1\User\Payment\PaymentWebhookController;
use Illuminate\Support\Facades\Route;

// Public Midtrans Webhook Notification
Route::post('payments/webhook', [PaymentWebhookController::class, 'handleWebhook'])->name('payments.webhook');
Route::post('payments/notification', [PaymentWebhookController::class, 'handleWebhook']);
Route::post('webhook/midtrans', [PaymentWebhookController::class, 'handleWebhook']);