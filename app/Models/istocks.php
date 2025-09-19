<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class istocks extends Model
{
    //

    public $fillable = [
        "inventory_id",
        "stocks",
        "stockname",
    ];
    protected $table = "istocks";
    public $timestamps = false;

    /**
     * Get the inventory item for this stock
     */
    public function inventory()
    {
        return $this->belongsTo(inventory::class, 'inventory_id');
    }
}