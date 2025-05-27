<?php
namespace App\Services;

use App\Models\activity_logs;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

    class ActivityLogger
    {
        public static function log(
            string $description,
            ?Model $subject = null,
            array $properties = [],
            ?string $logName = null,
            ?Model $causer = null
        ): activity_logs {
            return activity_logs::create([
                'log_name' => $logName ?? config('activitylog.default_log_name', 'default'),
                'description' => $description,
                'subject_id' => $subject?->getKey(),
                'subject_type' => $subject?->getMorphClass(),
                'causer_id' => $causer?->getKey() ?? Auth::user()->id,
                'causer_type' => $causer?->getMorphClass() ?? 'App\Models\User',
                'properties' => $properties,
            ]);
        }
    }
?>