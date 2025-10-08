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
        Schema::table('prescriptions', function (Blueprint $table) {
            // Change patient_id from unsignedBigInteger to string to support Patient Records IDs
            $table->string('patient_id')->change();
            
            // Add patient_name field to store the patient's full name for easier reference
            $table->string('patient_name')->nullable()->after('patient_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prescriptions', function (Blueprint $table) {
            // Revert patient_id back to unsignedBigInteger
            $table->unsignedBigInteger('patient_id')->change();
            
            // Remove patient_name field
            $table->dropColumn('patient_name');
        });
    }
};