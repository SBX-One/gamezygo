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
    Schema::table('blogs', function (Blueprint $table) {
      if (!Schema::hasColumn('blogs', 'total_views')) {
        $table->integer('total_views')->default(0)->after('published_at');
      }
    });

    // Drop foreign key on author_id if it exists to allow Admin/User polymorphic author
    try {
      if (DB::getDriverName() === 'pgsql') {
        DB::statement('ALTER TABLE blogs DROP CONSTRAINT IF EXISTS blogs_author_id_foreign');
      }
    } catch (\Throwable $e) {
      // Ignore if not present
    }
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('blogs', function (Blueprint $table) {
      if (Schema::hasColumn('blogs', 'total_views')) {
        $table->dropColumn('total_views');
      }
    });
  }
};

