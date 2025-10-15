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
            $table->integer('priority_number')->nullable()->after('reference_number');
        });
        
        // Generate priority numbers for existing appointments
        $appointments = \App\Models\appointments::whereNull('priority_number')
            ->orderBy('date')
            ->orderBy('servicetype_id')
            ->orderBy('created_at')
            ->get();
        
        $currentDate = null;
        $currentService = null;
        $priorityCounter = 1;
        
        foreach ($appointments as $appointment) {
            // Reset counter for new date or service
            if ($currentDate !== $appointment->date || $currentService !== $appointment->servicetype_id) {
                $priorityCounter = 1;
                $currentDate = $appointment->date;
                $currentService = $appointment->servicetype_id;
            }
            
            $appointment->priority_number = $priorityCounter;
            $appointment->save();
            $priorityCounter++;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('priority_number');
        });
    }
};