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
        Schema::create('program_participants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('program_schedule_id');
            $table->unsignedBigInteger('user_id');
            $table->string('status')->default('Registered');
            $table->timestamps();
            
            $table->foreign('program_schedule_id')->references('id')->on('program_schedules')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Ensure a user can only register once for a specific program schedule
            $table->unique(['program_schedule_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_participants');
    }
};
