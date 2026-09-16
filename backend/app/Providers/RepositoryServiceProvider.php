<?php

namespace App\Providers;

use App\Repositories\Contracts\Api\V1\User\Product\ProductRepositoryInterface;
use App\Repositories\Api\V1\User\Product\ProductRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
