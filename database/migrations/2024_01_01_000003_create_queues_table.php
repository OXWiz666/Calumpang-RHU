<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQueuesTable extends Migration
{
    public function up()
    {
        // Schema::create('queues', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('patient_id')->constrained()->onDelete('cascade');
        //     $table->integer('queue_number');
        //     $table->enum('status', ['waiting', 'called', 'serving', 'completed', 'skipped'])->default('waiting');
        //     $table->string('service_type');
        //     $table->text('notes')->nullable();
        //     $table->timestamp('called_at')->nullable();
        //     $table->timestamp('completed_at')->nullable();
        //     $table->timestamps();
        //     $table->softDeletes();

        //     // Add index for performance
        //     $table->index(['status', 'created_at']);
        //     $table->index('queue_number');
        // });
    }

    public function down()
    {
        //Schema::dropIfExists('queues');
    }
}
