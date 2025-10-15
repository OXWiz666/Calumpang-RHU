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
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('reference_number')->nullable()->after('id');
        });
        
        // Generate reference numbers for existing appointments
        $appointments = \App\Models\appointments::whereNull('reference_number')->get();
        foreach ($appointments as $appointment) {
            $appointment->reference_number = 'APT-' . str_pad($appointment->id, 6, '0', STR_PAD_LEFT);
            $appointment->save();
        }
        
        // Now make it unique
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('reference_number')->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('reference_number');
        });
    }
};