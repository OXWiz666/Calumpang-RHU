<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add the Archived status to the doctor_status table
        DB::table('doctor_status')->insert([
            'id' => 5,
            'statusname' => 'Archived',
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the Archived status from the doctor_status table
        DB::table('doctor_status')->where('id', 5)->delete();
    }
};
