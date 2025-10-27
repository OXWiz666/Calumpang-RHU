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
        Schema::create('month_day_configurations', function (Blueprint $table) {
            $table->id();
            $table->integer('service_id'); // Match the servicetypes table structure
            $table->integer('year');
            $table->integer('month'); // 1-12
            $table->json('day_configurations'); // Store which days are configured for this month
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('service_id')->references('id')->on('servicetypes')->onDelete('cascade');
            
            // Unique constraint to prevent duplicate month configurations
            $table->unique(['service_id', 'year', 'month'], 'unique_month_config');
            
            // Index for faster queries
            $table->index(['service_id', 'year', 'month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('month_day_configurations');
    }
};
