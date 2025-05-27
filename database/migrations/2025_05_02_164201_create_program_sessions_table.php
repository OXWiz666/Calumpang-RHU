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
        Schema::create('program_sessions', function (Blueprint $table) {
            $table->integer('id',true,true); // Equivalent to INT AUTO_INCREMENT PRIMARY KEY
            $table->foreignId('registration_id')->constrained('program_registrations');
            $table->date('session_date');
            $table->string('conducted_by', 100);
            $table->text('notes')->nullable();
            $table->unsignedInteger('session_number');
            $table->enum('status', ['Completed', 'Scheduled', 'Missed'])->default('Scheduled');
            $table->timestamps(); // Adds created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_sessions');
    }
};