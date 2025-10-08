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
            // Personal Information
            $table->string('civil_status')->nullable()->after('gender');
            $table->string('nationality')->nullable()->after('civil_status');
            $table->string('religion')->nullable()->after('nationality');
            $table->string('country')->nullable()->after('religion');
            
            // Address Information
            $table->string('region')->nullable()->after('country');
            $table->string('province')->nullable()->after('region');
            $table->string('city')->nullable()->after('province');
            $table->string('barangay')->nullable()->after('city');
            $table->string('street')->nullable()->after('barangay');
            $table->string('zip_code')->nullable()->after('street');
            
            // Profile Picture
            $table->string('profile_picture')->nullable()->after('zip_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'civil_status',
                'nationality', 
                'religion',
                'country',
                'region',
                'province',
                'city',
                'barangay',
                'street',
                'zip_code',
                'profile_picture'
            ]);
        });
    }
};
