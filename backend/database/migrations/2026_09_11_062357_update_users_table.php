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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->after('email')->nullable();
            $table->enum('status', ['active', 'suspend', 'banned'])
                ->default('active')
                ->after('email')
                ->nullable();
            $table->integer('total_points')->default(0)->after('status');
            $table->integer('total_transaction')->default(0)->after('total_points');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'status',
                'total_points',
                'total_transaction',
            ]);
        });
    }
};
