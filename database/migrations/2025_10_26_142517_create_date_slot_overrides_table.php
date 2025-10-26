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
        Schema::create('date_slot_overrides', function (Blueprint $table) {
            $table->id();
            $table->integer('subservice_id'); // Match the subservices table structure
            $table->date('date');
            $table->string('time'); // Time slot (e.g., "09:00 AM")
            $table->integer('capacity')->default(5); // Override capacity for this date/time
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('subservice_id')->references('id')->on('subservices')->onDelete('cascade');
            
            // Unique constraint to prevent duplicate overrides for same date/time
            $table->unique(['subservice_id', 'date', 'time'], 'unique_date_time_override');
            
            // Index for faster queries
            $table->index(['subservice_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('date_slot_overrides');
    }
};