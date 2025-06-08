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

    public function inventory(){
        return $this->belongsTo(inventory::class,"inventory_id");
    }

    public function staff(){
        return $this->belongsTo(User::class,"staff_id");
    }

    public function stocks(){
        return $this->belongsTo(istocks::class,"stock_id");
    }


}
