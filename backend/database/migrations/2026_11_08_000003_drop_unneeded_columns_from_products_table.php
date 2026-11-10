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
      $columnsToDrop = [];
      foreach (['is_preorder', 'is_active', 'is_listed', 'is_draft'] as $col) {
        if (Schema::hasColumn('products', $col)) {
          $columnsToDrop[] = $col;
        }
      }

      if (!empty($columnsToDrop)) {
        $table->dropColumn($columnsToDrop);
      }
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('products', function (Blueprint $table) {
      if (!Schema::hasColumn('products', 'is_preorder')) {
        $table->boolean('is_preorder')->default(false)->nullable();
      }
      if (!Schema::hasColumn('products', 'is_active')) {
        $table->boolean('is_active')->default(true)->nullable();
      }
      if (!Schema::hasColumn('products', 'is_listed')) {
        $table->boolean('is_listed')->default(true)->nullable();
      }
      if (!Schema::hasColumn('products', 'is_draft')) {
        $table->boolean('is_draft')->default(false)->nullable();
      }
    });
  }
};
