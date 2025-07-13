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
        Schema::create('screens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');

            $table->string('title');
            $table->enum('type', ['web', 'mobile', 'other'])->default('web');
            $table->string('image_url')->nullable();

            $table->text('purpose')->nullable();
            $table->json('actions')->nullable();
            $table->json('inputs')->nullable();
            $table->json('static_content')->nullable();
            $table->json('navigations')->nullable();
            $table->json('states')->nullable();
            $table->json('data')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screens');
    }
};
