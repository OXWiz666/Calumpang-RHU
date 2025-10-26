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
        Schema::table('subservice_time', function (Blueprint $table) {
            $table->integer('max_slots')->default(5)->after('time');
            $table->integer('available_slots')->default(5)->after('max_slots');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subservice_time', function (Blueprint $table) {
            $table->dropColumn(['max_slots', 'available_slots']);
        });
    }
};