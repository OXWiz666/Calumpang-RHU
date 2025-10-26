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
        // For MySQL, we need to modify the enum column to add the new value
        DB::statement("ALTER TABLE medical_records MODIFY COLUMN record_type ENUM('consultation', 'checkup', 'emergency', 'admin_entry') DEFAULT 'consultation'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove admin_entry from enum and set any existing admin_entry records to consultation
        DB::statement("UPDATE medical_records SET record_type = 'consultation' WHERE record_type = 'admin_entry'");
        DB::statement("ALTER TABLE medical_records MODIFY COLUMN record_type ENUM('consultation', 'checkup', 'emergency') DEFAULT 'consultation'");
    }
};