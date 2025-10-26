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
        // Check if the foreign key exists and drop it
        $foreignKeys = DB::select("
            SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'istock_movements' 
            AND COLUMN_NAME = 'staff_id'
            AND REFERENCED_TABLE_NAME IS NOT NULL
        ");
        
        foreach ($foreignKeys as $fk) {
            DB::statement("ALTER TABLE istock_movements DROP FOREIGN KEY {$fk->CONSTRAINT_NAME}");
        }
        
        // Make staff_id nullable if it isn't already
        if (Schema::hasColumn('istock_movements', 'staff_id')) {
            Schema::table('istock_movements', function (Blueprint $table) {
                $table->unsignedBigInteger('staff_id')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate the foreign key constraint
        if (Schema::hasColumn('istock_movements', 'staff_id')) {
            DB::statement("
                ALTER TABLE istock_movements 
                ADD CONSTRAINT istock_movements_staff_id_foreign 
                FOREIGN KEY (staff_id) 
                REFERENCES users(id) 
                ON DELETE SET NULL
            ");
        }
    }
};
