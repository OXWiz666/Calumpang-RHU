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
        Schema::table('medical_records', function (Blueprint $table) {
            $table->text('treatment_plan')->nullable()->after('treatment');
            $table->text('assessment')->nullable()->after('treatment_plan');
            $table->enum('status', ['active', 'completed', 'follow_up', 'archived'])->default('active')->after('record_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medical_records', function (Blueprint $table) {
            $table->dropColumn(['treatment_plan', 'assessment', 'status']);
        });
    }
};
