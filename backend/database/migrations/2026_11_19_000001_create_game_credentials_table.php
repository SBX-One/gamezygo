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
    Schema::create('game_credentials', function (Blueprint $table) {
      $table->id();
      $table->foreignId('product_id')->constrained()->cascadeOnDelete();
      $table->text('username');
      $table->text('password');
      $table->text('access_token')->nullable();
      $table->string('status', 50)->default('available');
      $table->foreignId('assigned_to_order_item_id')->nullable()->constrained('order_items')->nullOnDelete();
      $table->foreignId('assigned_to_user_id')->nullable()->constrained('users')->nullOnDelete();
      $table->timestamp('reserved_until')->nullable();
      $table->timestamps();

      $table->index(['product_id', 'status']);
      $table->index(['assigned_to_user_id']);
      $table->index(['status', 'reserved_until']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('game_credentials');
  }
};
