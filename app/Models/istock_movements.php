<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class istock_movements extends Model
{
    //
    public $fillable = [
        'inventory_id',
        'staff_id',
        'quantity',
        'expiry_date',
        'type',
        'inventory_name',
        'stock_id'
    ];
    protected $table = "istock_movements";
    public $timestamps = false;
}
