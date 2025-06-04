<?php

namespace App\Http\Controllers;

use App\Models\messages;
use App\Services\NotifSender;
use Illuminate\Http\Request;

class PatientMessagesController extends Controller
{
    //

    public function sendmssg(Request $request){
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'subject' => "required|min:5",
            'message' => "required|min:10",
        ]);

        messages::insert([
            "user_id"=> $request->user()->id,
            "subject" => $request->subject,
            "message"=> $request->message,
        ]);

         NotifSender::SendNotif(false,[1,7],"{$request->user()->firstname} {$request->user()->lastname} (Patient) has sent a message!",
                'New Message Received!','patient_send_mssg');
        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Message sent successfully!",
                'icon' => 'success'
            ]
        ]);
    }
}
