<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_sessions', function (Blueprint $table) {
            $table->id(); // Changed from integer to bigIncrements to match Laravel's default
            $table->foreignId('registration_id')->constrained('program_registrations');
            $table->date('session_date');
            $table->string('conducted_by', 100);
            $table->text('notes')->nullable();
            $table->unsignedInteger('session_number');
            $table->enum('status', ['Completed', 'Scheduled', 'Missed'])->default('Scheduled');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_sessions');
    }
};