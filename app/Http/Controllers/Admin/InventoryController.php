<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\inventory;
use App\Models\istocks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
class InventoryController extends Controller
{
    //
    // public function index(){
    //     return Inertia::render('Authenticated/Admin/Inventory',[]);
    // }

    public function index(){
        return Inertia::render('Authenticated/Admin/Inventory/InventoryDashboard',[]);
    }

    public function add_item(Request $request){
        $request->validate([
            'itemname' => "required",
            'categoryid' => "required|exists:icategory,id",
            'unit_type' => 'required|min:3',
            'quantity' => "required|min:0",
            'expirydate' => "required|date|after_or_equal:today",
        ]);
        try{
            DB::beginTransaction();
            $stock = istocks::create([
                ''
            ]);
            $inventory = inventory::create([
                'name' => $request->itemname,
                'category_id' => $request->categoryid,
                'stock_id' => $request->categoryid,
            ]);

            DB::commit();
        }
        catch(\Exception $e){
            DB::rollBack();
            //return redirect()->back()->with('error', $e->getMessage());
        }


        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Item added successfully!",
                'icon' => "success"
            ]
        ]);
    }
}