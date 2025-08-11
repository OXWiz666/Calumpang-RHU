<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ProcessQueue extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-queue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
{
    $this->call('queue:work', [
        '--stop-when-empty' => true,
        '--max-time' => 55 // Run for maximum 55 seconds
    ]);
}
}
