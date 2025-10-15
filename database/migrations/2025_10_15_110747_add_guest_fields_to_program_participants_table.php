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
        Schema::table('program_participants', function (Blueprint $table) {
            // Add guest information fields
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('suffix')->nullable();
            $table->enum('sex', ['Male', 'Female', 'Other'])->nullable();
            $table->date('birthdate')->nullable();
            $table->integer('age')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('program_participants', function (Blueprint $table) {
            // Remove guest information fields
            $table->dropColumn([
                'first_name',
                'middle_name', 
                'last_name',
                'suffix',
                'sex',
                'birthdate',
                'age',
                'contact_number',
                'email'
            ]);
        });
    }
};
