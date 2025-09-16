<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class icategory extends Model
{
    //
    public $fillable = [
        "name",
        "description",
        "icon",
        "status"
    ];
    protected $table = "icategory";

    public $timestamps = false;

    /**
     * Get the inventory items for this category
     */
    public function inventory()
    {
        return $this->hasMany(inventory::class, 'category_id');
    }
}