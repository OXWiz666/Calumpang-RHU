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
        Schema::table('appointments', function (Blueprint $table) {
            // Add address ID fields for yajra/laravel-address integration
            $table->unsignedBigInteger('region_id')->nullable()->after('country');
            $table->unsignedBigInteger('province_id')->nullable()->after('region_id');
            $table->unsignedBigInteger('city_id')->nullable()->after('province_id');
            $table->unsignedBigInteger('barangay_id')->nullable()->after('city_id');
            
            // Add foreign key constraints (without foreign keys for now to avoid issues)
            // $table->foreign('region_id')->references('id')->on('ph_regions')->onDelete('set null');
            // $table->foreign('province_id')->references('id')->on('ph_provinces')->onDelete('set null');
            // $table->foreign('city_id')->references('id')->on('ph_cities')->onDelete('set null');
            // $table->foreign('barangay_id')->references('id')->on('ph_barangays')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Drop the columns
            $table->dropColumn([
                'region_id',
                'province_id',
                'city_id',
                'barangay_id'
            ]);
        });
    }
};