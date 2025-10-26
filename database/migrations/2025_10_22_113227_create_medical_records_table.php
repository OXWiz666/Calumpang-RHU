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
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id')->nullable();
            $table->unsignedBigInteger('appointment_id')->nullable();
            $table->unsignedBigInteger('doctor_id');
            $table->text('diagnosis');
            $table->text('symptoms')->nullable();
            $table->text('treatment')->nullable();
            $table->text('notes')->nullable();
            $table->json('vital_signs')->nullable();
            $table->json('lab_results')->nullable();
            $table->date('follow_up_date')->nullable();
            $table->enum('record_type', ['consultation', 'checkup', 'emergency'])->default('consultation');
            $table->json('attachments')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign key constraints (commented out for now to avoid constraint issues)
            // $table->foreign('patient_id')->references('id')->on('users')->onDelete('cascade');
            // $table->foreign('appointment_id')->references('id')->on('appointments')->onDelete('cascade');
            // $table->foreign('doctor_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};