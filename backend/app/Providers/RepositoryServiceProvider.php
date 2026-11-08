<?php

namespace App\Providers;

use App\Repositories\Contracts\Api\V1\Admin\Auth\AdminAuthRepositoryInterface;
use App\Repositories\Api\V1\Admin\Auth\AdminAuthRepository;
use App\Repositories\Contracts\Api\V1\Admin\Catalog\AdminCatalogRepositoryInterface;
use App\Repositories\Api\V1\Admin\Catalog\AdminCatalogRepository;
use App\Repositories\Contracts\Api\V1\Admin\Revenue\AdminRevenueRepositoryInterface;
use App\Repositories\Api\V1\Admin\Revenue\AdminRevenueRepository;
use App\Repositories\Contracts\Api\V1\Admin\CustomSection\AdminCustomSectionRepositoryInterface;
use App\Repositories\Api\V1\Admin\CustomSection\AdminCustomSectionRepository;
use App\Repositories\Contracts\Api\V1\Admin\Subscription\AdminSubscriptionRepositoryInterface;
use App\Repositories\Api\V1\Admin\Subscription\AdminSubscriptionRepository;
use App\Repositories\Contracts\Api\V1\Admin\Dashboard\AdminDashboardRepositoryInterface;
use App\Repositories\Api\V1\Admin\Dashboard\AdminDashboardRepository;
use App\Repositories\Contracts\Api\V1\User\Announcement\AnnouncementRepositoryInterface;
use App\Repositories\Api\V1\User\Announcement\AnnouncementRepository;
use App\Repositories\Contracts\Api\V1\User\Auth\AuthRepositoryInterface;
use App\Repositories\Api\V1\User\Auth\AuthRepository;
use App\Repositories\Contracts\Api\V1\User\Blog\BlogRepositoryInterface;
use App\Repositories\Api\V1\User\Blog\BlogRepository;
use App\Repositories\Contracts\Api\V1\User\CustomSection\CustomSectionRepositoryInterface;
use App\Repositories\Api\V1\User\CustomSection\CustomSectionRepository;
use App\Repositories\Contracts\Api\V1\User\Faq\FaqRepositoryInterface;
use App\Repositories\Api\V1\User\Faq\FaqRepository;
use App\Repositories\Contracts\Api\V1\User\Leaderboard\LeaderboardRepositoryInterface;
use App\Repositories\Api\V1\User\Leaderboard\LeaderboardRepository;
use App\Repositories\Contracts\Api\V1\User\Order\OrderRepositoryInterface;
use App\Repositories\Api\V1\User\Order\OrderRepository;
use App\Repositories\Contracts\Api\V1\User\Product\ProductRepositoryInterface;
use App\Repositories\Api\V1\User\Product\ProductRepository;
use App\Repositories\Contracts\Api\V1\User\Profile\ProfileRepositoryInterface;
use App\Repositories\Api\V1\User\Profile\ProfileRepository;
use App\Repositories\Contracts\Api\V1\User\Review\ReviewRepositoryInterface;
use App\Repositories\Api\V1\User\Review\ReviewRepository;
use App\Repositories\Contracts\Api\V1\User\Cart\CartRepositoryInterface;
use App\Repositories\Api\V1\User\Cart\CartRepository;
use App\Repositories\Contracts\Api\V1\User\Payment\PaymentRepositoryInterface;
use App\Repositories\Api\V1\User\Payment\PaymentRepository;
use App\Repositories\Contracts\Api\V1\User\SubscriptionPlan\SubscriptionPlanRepositoryInterface;
use App\Repositories\Api\V1\User\SubscriptionPlan\SubscriptionPlanRepository;
use App\Repositories\Contracts\Api\V1\User\UserSubscription\UserSubscriptionRepositoryInterface;
use App\Repositories\Api\V1\User\UserSubscription\UserSubscriptionRepository;
use App\Repositories\Contracts\Api\V1\User\GameRequest\GameRequestRepositoryInterface;
use App\Repositories\Api\V1\User\GameRequest\GameRequestRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(ProfileRepositoryInterface::class, ProfileRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
        $this->app->bind(PaymentRepositoryInterface::class, PaymentRepository::class);
        $this->app->bind(CustomSectionRepositoryInterface::class, CustomSectionRepository::class);
        $this->app->bind(SubscriptionPlanRepositoryInterface::class, SubscriptionPlanRepository::class);
        $this->app->bind(BlogRepositoryInterface::class, BlogRepository::class);
        $this->app->bind(ReviewRepositoryInterface::class, ReviewRepository::class);
        $this->app->bind(LeaderboardRepositoryInterface::class, LeaderboardRepository::class);
        $this->app->bind(FaqRepositoryInterface::class, FaqRepository::class);
        $this->app->bind(AnnouncementRepositoryInterface::class, AnnouncementRepository::class);
        $this->app->bind(CartRepositoryInterface::class, CartRepository::class);
        $this->app->bind(UserSubscriptionRepositoryInterface::class, UserSubscriptionRepository::class);
        $this->app->bind(GameRequestRepositoryInterface::class, GameRequestRepository::class);
        $this->app->bind(AdminAuthRepositoryInterface::class, AdminAuthRepository::class);
        $this->app->bind(AdminDashboardRepositoryInterface::class, AdminDashboardRepository::class);
        $this->app->bind(AdminCatalogRepositoryInterface::class, AdminCatalogRepository::class);
        $this->app->bind(AdminRevenueRepositoryInterface::class, AdminRevenueRepository::class);
        $this->app->bind(AdminCustomSectionRepositoryInterface::class, AdminCustomSectionRepository::class);
        $this->app->bind(AdminSubscriptionRepositoryInterface::class, AdminSubscriptionRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
