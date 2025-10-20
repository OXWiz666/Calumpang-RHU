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
            // Add missing columns that are referenced in the model
            if (!Schema::hasColumn('appointments', 'firstname')) {
                $table->string('firstname')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('appointments', 'lastname')) {
                $table->string('lastname')->nullable()->after('firstname');
            }
            if (!Schema::hasColumn('appointments', 'middlename')) {
                $table->string('middlename')->nullable()->after('lastname');
            }
            if (!Schema::hasColumn('appointments', 'email')) {
                $table->string('email')->nullable()->after('middlename');
            }
            if (!Schema::hasColumn('appointments', 'status')) {
                $table->string('status')->default('pending')->after('notes');
            }
            if (!Schema::hasColumn('appointments', 'priority_number')) {
                $table->integer('priority_number')->nullable()->after('status');
            }
            if (!Schema::hasColumn('appointments', 'subservice_id')) {
                $table->integer('subservice_id')->nullable()->after('servicetype_id');
            }
            if (!Schema::hasColumn('appointments', 'doctor_id')) {
                $table->integer('doctor_id')->nullable()->after('subservice_id');
            }
            
            // Patient profile fields
            if (!Schema::hasColumn('appointments', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable()->after('doctor_id');
            }
            if (!Schema::hasColumn('appointments', 'gender')) {
                $table->string('gender')->nullable()->after('date_of_birth');
            }
            if (!Schema::hasColumn('appointments', 'civil_status')) {
                $table->string('civil_status')->nullable()->after('gender');
            }
            if (!Schema::hasColumn('appointments', 'nationality')) {
                $table->string('nationality')->nullable()->after('civil_status');
            }
            if (!Schema::hasColumn('appointments', 'religion')) {
                $table->string('religion')->nullable()->after('nationality');
            }
            if (!Schema::hasColumn('appointments', 'country')) {
                $table->string('country')->nullable()->after('religion');
            }
            if (!Schema::hasColumn('appointments', 'region')) {
                $table->string('region')->nullable()->after('country');
            }
            if (!Schema::hasColumn('appointments', 'province')) {
                $table->string('province')->nullable()->after('region');
            }
            if (!Schema::hasColumn('appointments', 'city')) {
                $table->string('city')->nullable()->after('province');
            }
            if (!Schema::hasColumn('appointments', 'barangay')) {
                $table->string('barangay')->nullable()->after('city');
            }
            if (!Schema::hasColumn('appointments', 'street')) {
                $table->string('street')->nullable()->after('barangay');
            }
            if (!Schema::hasColumn('appointments', 'zip_code')) {
                $table->string('zip_code')->nullable()->after('street');
            }
            if (!Schema::hasColumn('appointments', 'profile_picture')) {
                $table->string('profile_picture')->nullable()->after('zip_code');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'reference_number',
                'firstname',
                'lastname',
                'middlename',
                'email',
                'status',
                'priority_number',
                'subservice_id',
                'doctor_id',
                'date_of_birth',
                'gender',
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