<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            UserSeeder::class,
            GenreCategorySeeder::class,
            ProductLauncherCategorySeeder::class,
            ProductInstructionSeeder::class,
            ProductSeeder::class,
            ProductGenreCategorySeeder::class,
            ProductSpecificationRequirementSeeder::class,
            ProductGameAccountSeeder::class,
            UserOwnedGameSeeder::class,
            UserWishlistSeeder::class,
            UserCartItemSeeder::class,
            VoucherSeeder::class,
            VoucherUserSeeder::class,
            VoucherProductSeeder::class,
            SubscriptionPlanSeeder::class,
            SubscriptionPlanFeatureSeeder::class,
            UserSubscriptionSeeder::class,
            OrderSeeder::class,
            OrderItemSeeder::class,
            PaymentSeeder::class,
            ReviewSeeder::class,
            ReviewReplySeeder::class,
            FaqSeeder::class,
            AnnouncementSeeder::class,
            CommunityTagSeeder::class,
            CommunitySeeder::class,
            BlogCategorySeeder::class,
            BlogSeeder::class,
            CustomSectionSeeder::class,
            GameRequestSeeder::class,
        ]);
    }
}
