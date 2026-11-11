<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::table('vouchers', function (Blueprint $table) {
      if (!Schema::hasColumn('vouchers', 'status')) {
        $table->string('status')->default('active')->after('is_active');
      }
      if (!Schema::hasColumn('vouchers', 'discount_value')) {
        $table->integer('discount_value')->nullable()->after('discount_amount');
      } 
    });

    if (DB::getDriverName() === 'pgsql') {
      try {
        DB::statement('ALTER TABLE vouchers DROP CONSTRAINT IF EXISTS vouchers_discount_type_check');
      } catch (\Throwable $e) {
        // Ignore if constraint doesn't exist
      }
    }
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('vouchers', function (Blueprint $table) {
      $dropCols = [];
      if (Schema::hasColumn('vouchers', 'status')) {
        $dropCols[] = 'status';
      }
      if (Schema::hasColumn('vouchers', 'discount_value')) {
        $dropCols[] = 'discount_value';
      }
      if (!empty($dropCols)) {
        $table->dropColumn($dropCols);
      }
    });
  }
};

