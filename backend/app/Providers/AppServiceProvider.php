<?php

namespace App\Providers;

use App\Models\Announcement;
use App\Models\Blog;
use App\Models\Community;
use App\Models\CustomSection;
use App\Models\Faq;
use App\Models\Product;
use App\Models\Review;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Observers\AnnouncementObserver;
use App\Observers\BlogObserver;
use App\Observers\CommunityObserver;
use App\Observers\CustomSectionObserver;
use App\Observers\FaqObserver;
use App\Observers\ProductObserver;
use App\Observers\ReviewObserver;
use App\Observers\SubscriptionPlanObserver;
use App\Observers\UserObserver;
use App\Services\Cache\RedisCacheService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(RedisCacheService::class, function () {
            return new RedisCacheService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Product::observe(ProductObserver::class);
        CustomSection::observe(CustomSectionObserver::class);
        SubscriptionPlan::observe(SubscriptionPlanObserver::class);
        Blog::observe(BlogObserver::class);
        Faq::observe(FaqObserver::class);
        Announcement::observe(AnnouncementObserver::class);
        Community::observe(CommunityObserver::class);
        Review::observe(ReviewObserver::class);
        User::observe(UserObserver::class);
    }
}
