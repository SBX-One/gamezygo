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
        Schema::table('game_requests', function (Blueprint $table) {
            if (! Schema::hasColumn('game_requests', 'is_pinned')) {
                $table->boolean('is_pinned')->default(false)->after('status');
            }
            if (! Schema::hasColumn('game_requests', 'product_id')) {
                $table->foreignId('product_id')->nullable()->after('is_pinned')->constrained('products')->nullOnDelete();
            }
            if (! Schema::hasColumn('game_requests', 'reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable()->after('product_id');
            }
            if (! Schema::hasColumn('game_requests', 'last_requested_at')) {
                $table->timestamp('last_requested_at')->nullable()->after('reviewed_at');
            }
        });

        if (DB::getDriverName() === 'pgsql') {
            try {
                DB::statement('ALTER TABLE game_requests DROP CONSTRAINT IF EXISTS game_requests_status_check');
            } catch (Throwable $e) {
                // Ignore if constraint doesn't exist
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_requests', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('game_requests', 'last_requested_at')) {
                $columnsToDrop[] = 'last_requested_at';
            }
            if (Schema::hasColumn('game_requests', 'reviewed_at')) {
                $columnsToDrop[] = 'reviewed_at';
            }
            if (Schema::hasColumn('game_requests', 'product_id')) {
                $table->dropForeign(['product_id']);
                $columnsToDrop[] = 'product_id';
            }
            if (Schema::hasColumn('game_requests', 'is_pinned')) {
                $columnsToDrop[] = 'is_pinned';
            }

            if (! empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
