<?php
namespace App\Services;

use App\Notifications\SystemNotification;
use App\Events\SendNotification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
    class NotifSender
    {
        public static function SendNotif(
            $is_id = false,
            array $recipients = [],
            string $message = '',
            string $title = '',
            string $type = ''
        ) {
            if($is_id){
                $recipients = User::where('id',$recipients[0])->get();
            }else{
                $recipients = User::whereIn('roleID', $recipients)->get();
            }
            foreach ($recipients as $recipient) {
                $recipient->notify(new SystemNotification(
                    $message,
                    $title,
                    $type
                ));
                event(new SendNotification($recipient->id));
            }
        }
    }
?>