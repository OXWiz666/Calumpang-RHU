<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {

       DB::statement("ALTER TABLE istock_movements MODIFY COLUMN `type` ENUM('Incoming', 'Outgoing') NOT NULL DEFAULT 'Incoming'");

        Schema::table('istock_movements', function (Blueprint $table) {
            $table->string('batch_number')->nullable()->after('quantity');
        });
    }

    public function down(): void
    {
        Schema::table('istock_movements', function (Blueprint $table) {
            $table->dropColumn('batch_number');
        });
    }
};
