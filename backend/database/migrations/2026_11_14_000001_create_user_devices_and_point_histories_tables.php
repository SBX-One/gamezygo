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
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check');
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->after('name');
            $table->string('customer_id')->nullable()->unique()->after('id');
            $table->integer('points')->default(0)->after('status');
            $table->text('suspend_reason')->nullable()->after('points');
            $table->timestamp('suspended_at')->nullable()->after('suspend_reason');
            $table->timestamp('suspended_until')->nullable()->after('suspended_at');
        });

        Schema::create('user_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->string('device')->nullable();
            $table->string('browser')->nullable();
            $table->timestamp('login_at')->nullable();
            $table->timestamps();
        });

        Schema::create('user_point_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('type')->default('adjustment');
            $table->integer('points')->default(0);
            $table->integer('balance_before')->default(0);
            $table->integer('balance_after')->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_point_histories');
        Schema::dropIfExists('user_devices');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'customer_id',
                'points',
                'suspend_reason',
                'suspended_at',
                'suspended_until',
            ]);
        });
    }
};
