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
}
