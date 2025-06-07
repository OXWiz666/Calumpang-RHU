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
}
