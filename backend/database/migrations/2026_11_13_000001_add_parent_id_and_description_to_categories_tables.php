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
        Schema::table('genre_categories', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->after('id')->constrained('genre_categories')->cascadeOnDelete();
            $table->text('description')->nullable()->after('slug');
        });

        Schema::table('blog_categories', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->after('id')->constrained('blog_categories')->cascadeOnDelete();
            $table->text('description')->nullable()->after('slug');
        });

        Schema::table('blogs', function (Blueprint $table) {
            $table->foreignId('blog_sub_category_id')->nullable()->after('blog_category_id')->constrained('blog_categories')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropForeign(['blog_sub_category_id']);
            $table->dropColumn('blog_sub_category_id');
        });

        Schema::table('blog_categories', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'description']);
        });

        Schema::table('genre_categories', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'description']);
        });
    }
};
