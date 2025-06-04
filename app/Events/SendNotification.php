<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

use App\Models\User;

class SendNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */


    //public $message;
    //public $user_id;

  public function __construct(public $user_id)
  {
      //$this->message = $message;
      //$this->user_id = $user_id;
  }

  public function broadcastOn()
  {
      return [
        new PrivateChannel('notification.' . $this->user_id)
      ];
  }

  public function broadcastAs()
  {
      return 'notification-event';
  }

    // public function broadcastWith(){

    //     //$user = User::find($this->user_id);

    //     return [
    //         'wew' => 'wew'
    //     ];
    //     // return [
    //     //     'notifications' => $user?->unreadNotifications ?? [],
    //     //         'notifications_count' => $user?->unreadNotifications->count() ?? 0,
    //     //         'all_notifications' => $user?->notifications ?? [],
    //     // ];
    // }

    public function broadcastWith()
    {
        $user = User::where('id',$this->user_id)->first();

            return [
                'wew' => 'wew',
                // 'notifications' => $user->unreadNotifications->map(function ($notification) {
                //     return [
                //         'id' => $notification->id,
                //         'data' => $notification->data,
                //         'created_at' => $notification->created_at
                //     ];
                // }),
                // 'notifcations' => $user->unreadNotifications->toArray() ?? null,
                'count' => $user->unreadNotifications->count() ?? 0
            ];
    }
}
