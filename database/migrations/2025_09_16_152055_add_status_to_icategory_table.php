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
        Schema::table('icategory', function (Blueprint $table) {
            $table->tinyInteger('status')->default(1)->after('name')->comment('1=Active, 0=Archived');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('icategory', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};