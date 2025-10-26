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
        Schema::create('day_slot_schedules', function (Blueprint $table) {
            $table->id();
            $table->integer('subservice_id'); // Match the subservices table structure
            $table->string('day'); // Day of week (Monday, Tuesday, etc.)
            $table->json('time_slots'); // Array of time slots with capacities
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('subservice_id')->references('id')->on('subservices')->onDelete('cascade');
            
            // Unique constraint to prevent duplicate schedules for same day
            $table->unique(['subservice_id', 'day'], 'unique_day_schedule');
            
            // Index for faster queries
            $table->index(['subservice_id', 'day']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('day_slot_schedules');
    }
};