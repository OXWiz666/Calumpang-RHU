<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrescriptionMedicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'prescription_id',
        'medicine_id',
        'dosage',
        'frequency',
        'duration',
        'quantity',
        'instructions',
        'is_dispensed'
    ];

    protected $casts = [
        'is_dispensed' => 'boolean'
    ];

    // Relationships
    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    // Methods
    public function markAsDispensed()
    {
        $this->update(['is_dispensed' => true]);
        
        // Create stock movement
        StockMovement::create([
            'medicine_id' => $this->medicine_id,
            'user_id' => auth()->id(),
            'type' => 'out',
            'quantity' => $this->quantity,
            'reference_type' => 'prescription',
            'reference_id' => $this->prescription_id,
            'notes' => 'Dispensed for prescription #' . $this->prescription_id
        ]);
    }
} 