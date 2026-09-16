<?php

namespace App\Providers;

use App\Repositories\Contracts\Api\V1\User\Blog\BlogRepositoryInterface;
use App\Repositories\Api\V1\User\Blog\BlogRepository;
use App\Repositories\Contracts\Api\V1\User\CustomSection\CustomSectionRepositoryInterface;
use App\Repositories\Api\V1\User\CustomSection\CustomSectionRepository;
use App\Repositories\Contracts\Api\V1\User\Product\ProductRepositoryInterface;
use App\Repositories\Api\V1\User\Product\ProductRepository;
use App\Repositories\Contracts\Api\V1\User\SubscriptionPlan\SubscriptionPlanRepositoryInterface;
use App\Repositories\Api\V1\User\SubscriptionPlan\SubscriptionPlanRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(CustomSectionRepositoryInterface::class, CustomSectionRepository::class);
        $this->app->bind(SubscriptionPlanRepositoryInterface::class, SubscriptionPlanRepository::class);
        $this->app->bind(BlogRepositoryInterface::class, BlogRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
