<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class inventory extends Model
{
    //
    public $fillable = [
        "name","category_id","stock_id"
    ];
    protected $table = "inventory";
    public $timestamps = false;


    public function category(){
        return $this->belongsTo(icategory::class,"category_id");
    }

    public function stock(){
        return $this->hasMany(istocks::class,"inventory_id","id");
        //return $this->belongsTo(istocks::class,"stock_id");
    }

    public function stocks_movement(){
        return $this->hasMany(istock_movements::class,"inventory_id","id");
    }
}
