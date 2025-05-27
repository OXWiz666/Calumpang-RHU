<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'generic_name',
        'category',
        'description',
        'unit',
        'quantity',
        'reorder_level',
        'expiry_date',
        'manufacturer',
        'supplier',
        'notes'
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'quantity' => 'integer',
        'reorder_level' => 'integer'
    ];

    // Relationships
    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('quantity', '>', 0);
    }

    public function scopeLowStock($query)
    {
        return $query->where('quantity', '<=', DB::raw('reorder_level'));
    }

    public function scopeExpiringSoon($query, $days = 30)
    {
        return $query->where('expiry_date', '<=', now()->addDays($days));
    }

    // Accessors
    public function getIsLowStockAttribute()
    {
        return $this->quantity <= $this->reorder_level;
    }

    public function getIsExpiredAttribute()
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    public function getIsExpiringSoonAttribute()
    {
        return $this->expiry_date && $this->expiry_date->diffInDays(now()) <= 30;
    }

    // Methods
    public function decreaseStock($quantity)
    {
        if ($this->quantity >= $quantity) {
            $this->decrement('quantity', $quantity);
            return true;
        }
        return false;
    }

    public function increaseStock($quantity)
    {
        $this->increment('quantity', $quantity);
        return true;
    }
} 