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
        // Check if the foreign key exists before dropping it
        $foreignKeys = DB::select("
            SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'program_types' 
            AND CONSTRAINT_NAME = 'FK_progtype_serviceid'
        ");
        
        if (!empty($foreignKeys)) {
            // Drop the foreign key constraint
            DB::statement('ALTER TABLE program_types DROP FOREIGN KEY FK_progtype_serviceid');
        }
        
        // Make service_id nullable
        DB::statement('ALTER TABLE program_types MODIFY service_id BIGINT UNSIGNED NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert service_id to not nullable
        DB::statement('ALTER TABLE program_types MODIFY service_id BIGINT UNSIGNED NOT NULL');
        
        // Recreate the foreign key constraint
        DB::statement('ALTER TABLE program_types ADD CONSTRAINT FK_progtype_serviceid FOREIGN KEY (service_id) REFERENCES servicetypes(id) ON DELETE CASCADE');
    }
};
