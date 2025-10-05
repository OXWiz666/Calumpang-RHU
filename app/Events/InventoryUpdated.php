<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class InventoryUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The payload for the update event.
     *
     * @var array
     */
    public array $data;

    /**
     * Create a new event instance.
     */
    public function __construct(string $action, array $payload = [])
    {
        $this->data = [
            'action' => $action,
            'payload' => $payload,
            'timestamp' => now()->toISOString(),
        ];
    }

    public function broadcastOn(): Channel
    {
        return new Channel('inventory');
    }

    public function broadcastAs(): string
    {
        return 'InventoryUpdated';
    }
}


