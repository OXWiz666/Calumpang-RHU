<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('Notifications/Index', [
            'notifications' => $user?->notifications()->latest()->get() ?? collect(),
            'unread_count' => $user?->unreadNotifications()->count() ?? 0,
        ]);
    }

    public function markAllRead(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->unreadNotifications->markAsRead();
        }

        return back()->with('flash', [
            'title' => 'Notifications',
            'message' => 'All notifications marked as read.',
            'icon' => 'success',
            'toast' => true,
        ]);
    }
}


