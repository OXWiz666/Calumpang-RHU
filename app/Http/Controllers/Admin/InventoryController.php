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
use Illuminate\Validation\Rule;
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



    public function update_stock_movement(Request $request,istock_movements $movement){

        $request->validate([
            'type' => "required|in:Incoming,Outgoing",
            'quantity' => ["required",
            "numeric",
            Rule::when($request->type == "Incoming", ['min:0']),
            Rule::when($request->type == "Outgoing", ['max:0'])], // I want like min 0 if type == "Incoming"   else max 0

            'expiry' => 'required|date|after_or_equal:today',
            //'reason' => "",
        ]);

        //dd($request);
        try{

            DB::beginTransaction();

            $newMovement = $movement->replicate();
            $newMovement->save();

            $newQuantity = $request->type === "Incoming" ? $movement->stocks->stocks + $request->quantity : $movement->stocks->stocks + $request->quantity;

            $newMovement->update([
                'type' => $request->type,
                'quantity'=>  $request->quantity,
                'reason' => $request->reason,
                'staff_id' => Auth::user()->id,
                'expiry_date' => $request->expiry
            ]);

            $movement->stocks()->update([
                'stocks' => $newQuantity
            ]);


            DB::commit();
        }
        catch(\Exception $e){
            DB::rollBack();
            return back()->with([
                'flash' => [
                    'title' => 'Error!',
                    'message' => "Error: " . $e->getMessage(),
                    'icon' => "error"
                ]
            ]);
        }

        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Update successful!",
                'icon' => "success"
            ]
        ]);
    }


    public function delete_item(inventory $inventory){

        try{
            DB::beginTransaction();

            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            $inventory->stocks_movement()->update([
                'type' => "Outgoing",
                // "quantity" => 0,
                "staff_id" => Auth::user()->id
            ]);

            //$inventory->stocks_movement()->delete(); // If one-to-many
            // Delete related records first if needed
            $inventory->stock()->delete(); // If one-to-one


            // Then delete the main inventory record
            $inventory->delete();

            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            DB::commit();
        }
        catch(\Exception $e){
            DB::rollBack();
            return back()->with([
                'flash' => [
                    'title' => 'Error!',
                    'message' => "Error: " . $e->getMessage(),
                    'icon' => "error"
                ]
            ]);
        }


       return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Item deleted successfully!",
                'icon' => "success"
            ]
        ]);
    }
    public function update_item (Request $request,inventory $inventory){
        $request->validate([
            'itemname' => "required",
            'categoryid' => "required|exists:icategory,id",
        ]);

        try{
            DB::beginTransaction();

            $inventory->update([
                'name' => $request->itemname,
                'category_id' => $request->categoryid,
            ]);

            $inventory->stocks_movement()->update([
                'inventory_name'=> $request->itemname,
            ]);

            DB::commit();
        }
        catch(\Exception $e){
            DB::rollBack();
            return back()->with([
                'flash' => [
                    'title' => 'Error!',
                    'message' => "Error: " . $e->getMessage(),
                    'icon' => "error"
                ]
            ]);
        }


        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Item updated successfully!",
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

            $inventory = inventory::create([
                'name' => $request->itemname,
                'category_id' => $request->categoryid,
                //'stock_id' => $stock->id,
            ]);

            $stock = istocks::create([
                'stocks' => $request->quantity,
                'stockname' => $request->unit_type,
                'inventory_id' => $inventory->id
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