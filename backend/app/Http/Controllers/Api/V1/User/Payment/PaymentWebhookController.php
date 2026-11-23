<?php

namespace App\Http\Controllers\Api\V1\User\Payment;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Repositories\Contracts\Api\V1\User\Payment\PaymentRepositoryInterface;
use App\Services\Credential\CredentialAllocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentWebhookController extends Controller
{
    public function __construct(
        protected PaymentRepositoryInterface $paymentRepository
    ) {}

    /**
     * Handle Midtrans payment notification webhook.
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        $orderId = (string) $request->input('order_id');
        $statusCode = (string) $request->input('status_code');
        $grossAmount = (string) $request->input('gross_amount');
        $signatureKey = (string) $request->input('signature_key');
        $serverKey = (string) config('services.midtrans.server_key');

        // Signature validation pattern: order_id + status_code + gross_amount + ServerKey
        $calculatedHash = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

        if (! empty($serverKey) && $calculatedHash !== $signatureKey) {
            return response()->json([
                'error' => 'Invalid signature verification',
            ], 403);
        }

        $payment = Payment::where('gateway_reference', $orderId)->first();

        if (! $payment) {
            $payment = Payment::whereHas('order', function ($query) use ($orderId) {
                $query->where('order_code', $orderId);
            })->first();
        }

        if (! $payment) {
            return response()->json([
                'error' => 'Payment record not found',
            ], 404);
        }

        $transactionStatus = (string) $request->input('transaction_status');
        $fraudStatus = (string) $request->input('fraud_status');

        if ($transactionStatus === 'settlement' || ($transactionStatus === 'capture' && $fraudStatus === 'accept')) {
            $this->paymentRepository->fulfillOrder($payment);
        } elseif (in_array($transactionStatus, ['expire', 'cancel', 'deny'], true)) {
            $status = ($transactionStatus === 'expire') ? 'expired' : 'failed';
            $payment->update(['status' => $status]);
            $payment->order->update(['status' => $status]);
            app(CredentialAllocationService::class)->releaseReservation($payment->order);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification handled successfully',
        ], 200);
    }
}
