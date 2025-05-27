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
        Schema::create('doctor_details', function (Blueprint $table) {
            $table->integer('id',true);
            $table->integer('user_id',false,true);
            $table->integer('specialty_id');
            $table->json('time_slots');
            $table->integer('department_id');
            $table->double('fee');
            $table->integer('expyears')->comment('Years of experience');
            $table->string('licenseno');
            $table->double('avrating')->comment('average rating');
            $table->integer('status')->default(1)->comment('1=Available,2=Inactive,3=On Leave,4=In Consultation')->change();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctordetails');
    }
};
