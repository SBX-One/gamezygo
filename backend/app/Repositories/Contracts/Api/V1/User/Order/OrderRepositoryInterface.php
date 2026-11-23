<?php

namespace App\Repositories\Contracts\Api\V1\User\Order;

use App\Models\Order;
use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\Voucher;

interface OrderRepositoryInterface
{
    /**
     * Create a new pending order for a product.
     */
    public function createOrderForProduct(User $user, Product $product): Order;

    /**
     * Create a new pending order from all items in user's cart.
     */
    public function createOrderFromCart(User $user): Order;

    /**
     * Create a new pending order for a subscription plan.
     */
    public function createOrderForSubscription(User $user, SubscriptionPlan $plan): Order;

    /**
     * Find an order belonging to a user by ID or order code.
     */
    public function findUserOrder(User $user, int|string $orderIdentifier): ?Order;

    /**
     * Find an active voucher by its code.
     */
    public function findVoucherByCode(string $code): ?Voucher;

    /**
     * Apply a voucher to an order and update calculated totals.
     */
    public function applyVoucher(Order $order, Voucher $voucher, int $discountAmount): Order;

    /**
     * Remove voucher from an order and reset discount and total.
     */
    public function removeVoucher(Order $order): Order;
}
