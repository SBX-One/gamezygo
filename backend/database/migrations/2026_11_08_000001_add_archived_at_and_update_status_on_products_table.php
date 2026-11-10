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
    Schema::table('products', function (Blueprint $table) {
      if (!Schema::hasColumn('products', 'archived_at')) {
        $table->timestamp('archived_at')->nullable()->after('status');
      }
      $table->string('status')->default('listing')->change();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('products', function (Blueprint $table) {
      if (Schema::hasColumn('products', 'archived_at')) {
        $table->dropColumn('archived_at');
      }
    });
  }
};

