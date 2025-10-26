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
            $table->string('supplier')->nullable()->after('manufacturer');
            $table->integer('minimum_stock')->default(10)->after('supplier');
            $table->integer('maximum_stock')->default(100)->after('minimum_stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory', function (Blueprint $table) {
            $table->dropColumn(['supplier', 'minimum_stock', 'maximum_stock']);
        });
    }
};
