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
        if (!Schema::hasTable('program_schedules')) {
            Schema::create('program_schedules', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('program_type_id');
                $table->date('date');
                $table->time('start_time');
                $table->time('end_time');
                $table->string('location');
                $table->integer('total_slots');
                $table->integer('available_slots');
                $table->unsignedBigInteger('coordinator_id')->nullable();
                $table->string('status');
                $table->timestamps();
                
                $table->foreign('program_type_id')->references('id')->on('program_types')->onDelete('cascade');
                $table->foreign('coordinator_id')->references('id')->on('users')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_schedules');
    }
};
