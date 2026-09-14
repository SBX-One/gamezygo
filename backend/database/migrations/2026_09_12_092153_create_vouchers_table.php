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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code');
            $table->enum('discount_type', ['fixed', 'percentage']);
            $table->integer('discount_amount');
            $table->integer('max_discount')->nullable(0)->default(0);
            $table->integer('min_purchase')->nullable(0)->default(0);
            $table->enum('applies_to', ['all', 'one_time', 'subscription'])->default('all');
            $table->enum('target_type', ['all_users', 'specific_users'])->default('all_users');
            $table->enum('product_scope', ['all_products', 'specific_products'])->default('all_products');
            $table->integer('slot')->nullable()->default(0);
            $table->integer('usage_limit_per_user')->nullable()->default(0);
            $table->integer('total_usage')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->boolean('is_active')->default(false);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
