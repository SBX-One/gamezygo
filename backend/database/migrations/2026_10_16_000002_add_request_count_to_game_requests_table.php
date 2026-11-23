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
        Schema::table('game_requests', function (Blueprint $table) {
            if (! Schema::hasColumn('game_requests', 'request_count')) {
                $table->unsignedInteger('request_count')->default(1)->after('steam_url');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_requests', function (Blueprint $table) {
            if (Schema::hasColumn('game_requests', 'request_count')) {
                $table->dropColumn('request_count');
            }
        });
    }
};
