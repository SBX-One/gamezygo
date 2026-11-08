<?php

use Database\Seeders\SubscriptionPlanSeeder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::table('subscription_plans', function (Blueprint $table) {
      if (!Schema::hasColumn('subscription_plans', 'duration_months')) {
        $table->integer('duration_months')->default(1)->after('duration_days');
      }
    });

    // Seed the 3 standard subscription plans
    $seeder = new SubscriptionPlanSeeder();
    $seeder->run();
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('subscription_plans', function (Blueprint $table) {
      if (Schema::hasColumn('subscription_plans', 'duration_months')) {
        $table->dropColumn('duration_months');
      }
    });
  }
};
