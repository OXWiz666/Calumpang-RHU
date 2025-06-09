<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\icategory;
use App\Models\inventory;
use App\Models\istock_movements;
use App\Models\istocks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
class InventoryController extends Controller
{
    //
    // public function index(){
    //     return Inertia::render('Authenticated/Admin/Inventory',[]);
    // }

    public function index(){
        return Inertia::render('Authenticated/Admin/Inventory/InventoryDashboard',[
            'categories' => icategory::get(),
            'inventory' => inventory::with(['category','stock','stocks_movement'])->get(),
            'movements_' => istock_movements::with(['inventory','staff','stocks'])->get(),
        ]);
    }

    public function add_category(Request $request){
        $request->validate([
            'categoryname' => 'required|min:3'
        ]);

        icategory::insert([
            'name' => $request->categoryname
        ]);


        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Category added successfully!",
                'icon' => "success"
            ]
        ]);
    }

    public function delete_category(icategory $category){
        $category->delete();

       return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Category deleted successfully!",
                'icon' => "success"
            ]
        ]);
    }

    public function update_category(Request $request,icategory $category){
        $request->validate([
            'categoryname' => 'required|min:3'
        ]);

        $category->update([
            'name' => $request->categoryname
        ]);



       return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Category updated successfully!",
                'icon' => "success"
            ]
        ]);
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
                'stocks' => $request->quantity,
                'stockname' => $request->unit_type,

            ]);
            $inventory = inventory::create([
                'name' => $request->itemname,
                'category_id' => $request->categoryid,
                'stock_id' => $stock->id,
            ]);

            $stock_movement = istock_movements::create([
                'inventory_id' => $inventory->id,
                'staff_id' => Auth::user()->id,
                'quantity' => $request->quantity,
                'expiry_date' => $request->expirydate,
                'inventory_name' => $inventory->name,
                'stock_id' => $stock->id
            ]);

            DB::commit();
        }
        catch(\Exception $e){
            DB::rollBack();
            return back()->with([
                'flash' => [
                    'title' => 'Error!',
                    'message' => 'Error: ' . $e->getMessage(),
                    'icon' => "error"
                ]
            ]);
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