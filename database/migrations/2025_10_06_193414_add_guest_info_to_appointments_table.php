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
            $table->string('firstname')->nullable()->after('user_id');
            $table->string('lastname')->nullable()->after('firstname');
            $table->string('middlename')->nullable()->after('lastname');
            $table->string('email')->nullable()->after('middlename');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['firstname', 'lastname', 'middlename', 'email']);
        });
    }
};
