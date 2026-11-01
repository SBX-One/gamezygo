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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('slug');
            $table->text('description');
            $table->integer('price');
            $table->integer('discount_price')->nullable()->default(0);
            $table->foreignId('product_launcher_category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_instruction_id')->constrained()->cascadeOnDelete();
            $table->text('steam_url'); 
            $table->enum('status', ['listing', 'pre-order', 'archive'])->default('listing');
            $table->boolean('is_subscription_supported')->default(false);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
