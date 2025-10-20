<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class inventory extends Model
{
    //
    public $fillable = [
        "name",
        "manufacturer",
        "description",
        "unit_type",
        "storage_location",
        "batch_number",
        "expiry_date",
        "category_id",
        "stock_id",
        "status",
        "created_at",
        "updated_at"
    ];
    protected $table = "inventory";
    public $timestamps = true;
    
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'expiry_date' => 'date',
    ];


    public function category(){
        return $this->belongsTo(icategory::class,"category_id");
    }

    public function icategory(){
        return $this->belongsTo(icategory::class,"category_id");
    }

    public function stock(){
        return $this->hasOne(istocks::class,"inventory_id");
    }

    public function istocks(){
        return $this->hasMany(istocks::class,"inventory_id");
    }

    public function stocks_movement(){
        return $this->hasMany(istock_movements::class,"inventory_id","id");
    }
}
