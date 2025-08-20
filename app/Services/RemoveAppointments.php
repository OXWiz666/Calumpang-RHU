<?php
namespace App\Services;

use App\Notifications\SystemNotification;
use App\Events\SendNotification;
use App\Models\appointments;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
    class RemoveAppointments
    {
        public static function RemoveAppointments() {
            appointments::where("status", 4)->delete();
            logger("Declined Appointments Removed");
        }
    }
?>
