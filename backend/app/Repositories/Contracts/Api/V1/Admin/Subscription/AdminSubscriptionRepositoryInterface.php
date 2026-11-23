<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Subscription;

use App\Models\SubscriptionPlan;

interface AdminSubscriptionRepositoryInterface
{
    /**
     * Get subscription dashboard overview (plans with benefits and games summary).
     *
     * @return array<string, mixed>
     */
    public function getDashboard(): array;

    /**
     * Get paginated active subscribers list.
     *
     * @return array<string, mixed>
     */
    public function getActiveSubscribers(int $page = 1, int $perPage = 10): array;

    /**
     * Update subscription plan details.
     *
     * @param  array<string, mixed>  $data
     */
    public function updatePlan(int $planId, array $data): SubscriptionPlan;

    /**
     * Get features / benefits of a subscription plan.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getPlanFeatures(int $planId): array;

    /**
     * Synchronize / update benefits of a subscription plan.
     *
     * @param  array<int, array<string, mixed>>  $benefits
     * @return array<string, mixed>
     */
    public function syncPlanFeatures(int $planId, array $benefits): array;

    /**
     * Delete a single benefit from a subscription plan.
     *
     * @return array<string, mixed>
     */
    public function deletePlanFeature(int $planId, int $featureId): array;

    /**
     * Get filtered subscription games.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getSubscriptionProducts(array $filters): array;

    /**
     * Add products to subscription catalog.
     *
     * @param  array<int>  $productIds
     * @return array<string, mixed>
     */
    public function addSubscriptionProducts(array $productIds): array;

    /**
     * Remove product(s) from subscription catalog.
     *
     * @param  array<int>  $productIds
     * @return array<string, mixed>
     */
    public function removeSubscriptionProduct(?int $productId, array $productIds = []): array;
}
