<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the type column to include 'Disposal'
        DB::statement("ALTER TABLE istock_movements MODIFY COLUMN `type` ENUM('Incoming', 'Outgoing', 'Disposal') NOT NULL DEFAULT 'Incoming'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum values
        DB::statement("ALTER TABLE istock_movements MODIFY COLUMN `type` ENUM('Incoming', 'Outgoing') NOT NULL DEFAULT 'Incoming'");
    }
};