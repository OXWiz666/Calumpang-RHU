<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vaccine_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('date');
            $table->string('time');
            $table->string('location');
            $table->string('age_group');
            $table->integer('available_slots');
            $table->integer('total_slots');
            $table->enum('status', ['upcoming', 'ongoing', 'completed']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vaccine_schedules');
    }
};