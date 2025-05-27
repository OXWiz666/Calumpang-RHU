<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\Patient;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class QueueController extends Controller
{
    public function index()
    {
        $patients = Queue::with(['patient'])
            ->whereDate('created_at', Carbon::today())
            ->orderBy('queue_number')
            ->get()
            ->map(function ($queue) {
                $waitingTime = Carbon::parse($queue->created_at)->diffForHumans(null, true);
                
                return [
                    'id' => $queue->id,
                    'name' => $queue->patient->full_name,
                    'waitingTime' => $waitingTime,
                    'status' => $this->formatStatus($queue->status),
                    'avatarUrl' => "https://api.dicebear.com/7.x/avataaars/svg?seed=" . urlencode($queue->patient->full_name),
                    'queueNumber' => $queue->queue_number
                ];
            });

        return view('admin.queue.index', compact('patients'));
    }

    public function getActiveQueue()
    {
        $patients = Queue::with(['patient'])
            ->whereDate('created_at', Carbon::today())
            ->whereIn('status', ['waiting', 'called', 'serving'])
            ->orderBy('queue_number')
            ->get()
            ->map(function ($queue) {
                $waitingTime = Carbon::parse($queue->created_at)->diffForHumans(null, true);
                
                return [
                    'id' => $queue->id,
                    'name' => $queue->patient->full_name,
                    'waitingTime' => $waitingTime,
                    'status' => $this->formatStatus($queue->status),
                    'avatarUrl' => "https://api.dicebear.com/7.x/avataaars/svg?seed=" . urlencode($queue->patient->full_name),
                    'queueNumber' => $queue->queue_number
                ];
            });

        return response()->json(['patients' => $patients]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:waiting,called,serving,completed,skipped'
        ]);

        $queue = Queue::findOrFail($id);
        $queue->update([
            'status' => $request->status,
            'called_at' => in_array($request->status, ['called', 'serving']) ? now() : $queue->called_at,
            'completed_at' => in_array($request->status, ['completed', 'skipped']) ? now() : null
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Queue status updated successfully'
        ]);
    }

    public function addToQueue(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'service_type' => 'required|string'
        ]);

        // Get the last queue number for today
        $lastQueue = Queue::whereDate('created_at', Carbon::today())
            ->orderBy('queue_number', 'desc')
            ->first();

        $queueNumber = $lastQueue ? $lastQueue->queue_number + 1 : 1;

        $queue = Queue::create([
            'patient_id' => $request->patient_id,
            'queue_number' => $queueNumber,
            'service_type' => $request->service_type,
            'status' => 'waiting'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Patient added to queue successfully',
            'queue_number' => $queueNumber
        ]);
    }

    public function removeFromQueue($id)
    {
        $queue = Queue::findOrFail($id);
        $queue->update(['status' => 'skipped']);

        return response()->json([
            'success' => true,
            'message' => 'Patient removed from queue'
        ]);
    }

    public function getQueueStats()
    {
        $stats = [
            'waiting' => Queue::whereDate('created_at', Carbon::today())
                ->where('status', 'waiting')
                ->count(),
            'in_consultation' => Queue::whereDate('created_at', Carbon::today())
                ->whereIn('status', ['called', 'serving'])
                ->count(),
            'completed' => Queue::whereDate('created_at', Carbon::today())
                ->where('status', 'completed')
                ->count(),
            'average_wait_time' => Queue::whereDate('created_at', Carbon::today())
                ->whereNotNull('completed_at')
                ->avg(DB::raw('TIMESTAMPDIFF(MINUTE, created_at, completed_at)'))
        ];

        return response()->json($stats);
    }

    private function formatStatus($status)
    {
        return match($status) {
            'waiting' => 'waiting',
            'called', 'serving' => 'in-consultation',
            'completed' => 'completed',
            'skipped' => 'skipped',
            default => 'waiting'
        };
    }
} 