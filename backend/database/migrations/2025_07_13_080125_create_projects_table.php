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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo_url')->nullable();
            $table->text('description')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->string('status')->default('draft'); // e.g. draft, in_progress, completed

            // 🔗 New link fields
            $table->string('figma_url')->nullable(); // link to Figma project
            $table->string('docs_url')->nullable();  // link to documentation
            $table->string('live_url')->nullable();  // link to deployed product
            $table->string('other_url')->nullable();  // link to deployed product

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
