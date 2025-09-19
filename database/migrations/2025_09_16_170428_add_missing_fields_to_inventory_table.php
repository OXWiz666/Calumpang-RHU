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
        Schema::table('inventory', function (Blueprint $table) {
            $table->string('manufacturer')->nullable()->after('name');
            $table->text('description')->nullable()->after('manufacturer');
            $table->string('unit_type')->default('pieces')->after('description');
            $table->integer('minimum_stock')->default(10)->after('unit_type');
            $table->integer('maximum_stock')->default(100)->after('minimum_stock');
            $table->string('storage_location')->nullable()->after('maximum_stock');
            $table->string('batch_number')->nullable()->after('storage_location');
            $table->date('expiry_date')->nullable()->after('batch_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory', function (Blueprint $table) {
            $table->dropColumn([
                'manufacturer',
                'description', 
                'unit_type',
                'minimum_stock',
                'maximum_stock',
                'storage_location',
                'batch_number',
                'expiry_date'
            ]);
        });
    }
};
