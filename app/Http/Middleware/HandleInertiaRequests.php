<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'role' => optional($request->user())->role ?? null,
                'notifications' => optional($request->user())->unreadNotifications ?? [],
                'notifications_count' => optional($request->user())->unreadNotifications ? optional($request->user())->unreadNotifications->count() : 0,
                'all_notifications' => optional($request->user())->notifications ?? [],
                'userPrograms' => optional($request->user())->userprograms ?? [],
            ],
            'flash' => Session::get('flash'),
            'registration_id' => Session::get('registration_id'),
            'participant_data' => Session::get('participant_data'),
            'appointment_priority_number' => Session::get('appointment_priority_number'),
            'appointment_reference_number' => Session::get('appointment_reference_number'),
            'appointment_id' => Session::get('appointment_id')
        ];
    }
}
