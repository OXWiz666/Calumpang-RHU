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
        Schema::table('istock_movements', function (Blueprint $table) {
            $table->string('patient_name')->nullable()->after('reason');
            $table->string('prescription_number')->nullable()->after('patient_name');
            $table->string('dispensed_by')->nullable()->after('prescription_number');
            $table->text('notes')->nullable()->after('dispensed_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('istock_movements', function (Blueprint $table) {
            $table->dropColumn(['patient_name', 'prescription_number', 'dispensed_by', 'notes']);
        });
    }
};
