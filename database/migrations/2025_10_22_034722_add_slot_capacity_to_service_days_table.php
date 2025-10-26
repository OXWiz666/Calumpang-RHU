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
        Schema::table('service_days', function (Blueprint $table) {
            $table->integer('slot_capacity')->default(20)->after('day');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_days', function (Blueprint $table) {
            $table->dropColumn('slot_capacity');
        });
    }
};