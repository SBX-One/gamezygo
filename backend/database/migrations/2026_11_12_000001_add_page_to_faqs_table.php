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
    Schema::table('faqs', function (Blueprint $table) {
      if (!Schema::hasColumn('faqs', 'page')) {
        $table->string('page')->default('general')->after('answer')->index();
      }
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('faqs', function (Blueprint $table) {
      if (Schema::hasColumn('faqs', 'page')) {
        $table->dropColumn('page');
      }
    });
  }
};

