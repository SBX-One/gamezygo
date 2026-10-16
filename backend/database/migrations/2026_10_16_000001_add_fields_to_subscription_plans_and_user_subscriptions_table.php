<?php

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
      if (!Schema::hasColumn('subscription_plans', 'max_concurrent_access')) {
        $table->integer('max_concurrent_access')->default(1)->after('duration_days');
      }
    });

    Schema::table('user_subscriptions', function (Blueprint $table) {
      if (!Schema::hasColumn('user_subscriptions', 'order_item_id')) {
        $table->foreignId('order_item_id')->nullable()->after('subscription_plan_id')->constrained('order_items')->nullOnDelete();
      }
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('subscription_plans', function (Blueprint $table) {
      if (Schema::hasColumn('subscription_plans', 'max_concurrent_access')) {
        $table->dropColumn('max_concurrent_access');
      }
    });

    Schema::table('user_subscriptions', function (Blueprint $table) {
      if (Schema::hasColumn('user_subscriptions', 'order_item_id')) {
        $table->dropForeign(['order_item_id']);
        $table->dropColumn('order_item_id');
      }
    });
  }
};
