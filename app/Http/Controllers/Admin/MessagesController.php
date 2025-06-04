<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\messages;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessagesController extends Controller
{
    //


    public function index(){

        $messages = messages::with(['user'])->latest()->paginate(10);
        return Inertia::render("Authenticated/Admin/Mail",[
            'messages' => $messages
        ]);
    }
}
