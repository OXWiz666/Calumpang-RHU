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
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('generic_name')->nullable();
            $table->string('manufacturer')->nullable();
            $table->string('unit')->default('pcs'); // pieces, tablets, bottles, etc.
            $table->integer('quantity')->default(0);
            $table->decimal('price', 10, 2)->nullable();
            $table->date('expiry_date')->nullable();
            $table->text('description')->nullable();
            $table->text('side_effects')->nullable();
            $table->text('contraindications')->nullable();
            $table->string('dosage_form')->nullable(); // tablet, capsule, syrup, etc.
            $table->string('strength')->nullable(); // 500mg, 10ml, etc.
            $table->boolean('is_prescription_required')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};