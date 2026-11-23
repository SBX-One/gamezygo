<?php

require __DIR__.'/auth.php';
require __DIR__.'/user.php';
require __DIR__.'/admin.php';

use App\Http\Controllers\Api\V1\User\Payment\PaymentWebhookController;
use Illuminate\Support\Facades\Route;

// Public Midtrans Webhook Notification
Route::post('payments/webhook', [PaymentWebhookController::class, 'handleWebhook'])->name('payments.webhook');
