<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Events\InventoryUpdated;
use App\Models\icategory;
use App\Models\inventory;
use App\Models\istock_movements;
use App\Models\istocks;
use App\Services\NotifSender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class PharmacistController extends Controller
{
    /**
     * Display the pharmacist dashboard
     */
    public function dashboard()
    {
        // Get inventory statistics
        $totalItems = inventory::count();
        $lowStockItems = inventory::whereHas('stock', function($query) {
            $query->where('stocks', '<=', 10);
        })->count();
        
        // Get items expiring in the next 30 days
        $expiringSoon = inventory::whereNotNull('expiry_date')
            ->where('expiry_date', '!=', 'N/A')
            ->where('expiry_date', '>', now())
            ->where('expiry_date', '<=', now()->addDays(30))
            ->count();
        
        // Get monthly dispensed items (last 30 days)
        $monthlyDispensed = istock_movements::where('type', 'Outgoing')
            ->sum('quantity');
        
        // Get category breakdown (exclude archived categories)
        $categoryBreakdown = icategory::where('status', 1) // Only active categories (status = 1)
            ->withCount(['inventory' => function($query) {
                $query->whereHas('stock', function($q) {
                    $q->where('stocks', '>', 0);
                });
            }])->get()->map(function($category) use ($totalItems) {
                return [
                    'name' => $category->name,
                    'count' => $category->inventory_count,
                    'value' => $totalItems > 0 ? round(($category->inventory_count / $totalItems) * 100) : 0,
                    'color' => $this->getCategoryColor($category->name)
                ];
            });
        
        
        // Get system alerts based on real data
        $systemAlerts = $this->generateSystemAlerts();
        
        // Get recent activities
        $recentActivities = istock_movements::with(['inventory', 'staff'])
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get()
            ->map(function($movement) {
                return [
                    'id' => $movement->id,
                    'type' => $movement->type,
                    'item' => $movement->inventory_name,
                    'quantity' => $movement->quantity,
                    'user' => $movement->staff ? $movement->staff->firstname . ' ' . $movement->staff->lastname : 'Unknown',
                    'timestamp' => 'Recently',
                    'icon' => $movement->type === 'Incoming' ? 'Package' : 'TrendingDown'
                ];
            });

        // Calculate trend changes for stats (simplified without inventory trends)
        $trendChanges = [
            'totalItemsChange' => 0,
            'lowStockChange' => 0,
            'expiringSoonChange' => 0,
            'monthlyDispensedChange' => 0
        ];
        
        return Inertia::render('Authenticated/Pharmacist/Dashboard', [
            'stats' => [
                'totalItems' => $totalItems,
                'lowStockItems' => $lowStockItems,
                'expiringSoon' => $expiringSoon,
                'monthlyDispensed' => $monthlyDispensed
            ],
            'trendChanges' => $trendChanges,
            'categoryBreakdown' => $categoryBreakdown,
            'systemAlerts' => $systemAlerts,
            'recentActivities' => $recentActivities
        ]);
    }
    
    
    
    
    
    
    /**
     * Generate system alerts based on real data
     */
    private function generateSystemAlerts()
    {
        $alerts = [];
        
        // Low stock alerts
        $lowStockItems = inventory::whereHas('stock', function($query) {
            $query->where('stocks', '<=', 10);
        })->with('stock')->get();
        
        foreach ($lowStockItems->take(3) as $item) {
            $alerts[] = [
                'id' => 'low_stock_' . $item->id,
                'type' => 'warning',
                'title' => 'Low Stock Alert',
                'message' => $item->name . ' is running low (' . $item->stock->stocks . ' units remaining)',
                'timestamp' => 'Just now',
                'priority' => 'high'
            ];
        }
        
        // Expiry alerts
        $expiringItems = istock_movements::where('expiry_date', '<=', now()->addDays(7))
            ->where('expiry_date', '>=', now())
            ->with('inventory')
            ->get();
            
        foreach ($expiringItems->take(2) as $movement) {
            $daysLeft = round(now()->diffInDays($movement->expiry_date));
            $alerts[] = [
                'id' => 'expiry_' . $movement->id,
                'type' => 'info',
                'title' => 'Expiry Notice',
                'message' => $movement->inventory_name . ' expires in ' . $daysLeft . ' days',
                'timestamp' => '1 hour ago',
                'priority' => 'medium'
            ];
        }
        
        return $alerts;
    }
    
    /**
     * Get color for category
     */
    private function getCategoryColor($categoryName)
    {
        // Normalize category name (trim whitespace and convert to title case)
        $normalizedName = trim($categoryName);
        
        $colors = [
            'Antibiotics' => '#2563eb', // blue-600
            'Pain Relief' => '#16a34a', // green-600
            'Vitamins' => '#eab308', // yellow-500
            'Cold & Flu' => '#9333ea', // purple-600
            'Chronic Care' => '#ec4899', // pink-500
            'Medicine' => '#14b8a6', // teal-500
            'Vaccine' => '#22c55e', // green-500
            'Equipment' => '#4f46e5', // indigo-600
            'Supply' => '#f97316', // orange-500
            'Emergency' => '#dc2626', // red-600
            'Safety' => '#1e40af', // blue-800
            'Other' => '#4b5563', // gray-600
            // Add more variations and common names
            'Medicines' => '#14b8a6', // teal-500
            'Supplies' => '#f97316', // orange-500
            'Medical Equipment' => '#4f46e5', // indigo-600
            'Vaccines' => '#22c55e', // green-5001
            'Pharmaceuticals' => '#14b8a6', // teal-500
            'Medical Supplies' => '#f97316' // orange-500
        ];
        
        // Try exact match first
        if (isset($colors[$normalizedName])) {
            return $colors[$normalizedName];
        }
        
        // Try case-insensitive match
        foreach ($colors as $key => $color) {
            if (strtolower($key) === strtolower($normalizedName)) {
                return $color;
            }
        }
        
        // Generate a consistent color based on category name hash
        $hash = crc32($normalizedName);
        $colorIndex = abs($hash) % 8;
        $fallbackColors = [
            '#2563eb', // blue-600
            '#16a34a', // green-600
            '#eab308', // yellow-500
            '#9333ea', // purple-600
            '#ec4899', // pink-500
            '#14b8a6', // teal-500
            '#f97316', // orange-500
            '#dc2626'  // red-600
        ];
        
        return $fallbackColors[$colorIndex];
    }

    /**
     * Display the inventory management page
     */
    public function inventory()
    {
        // Calculate expiring soon count (items expiring within 30 days)
        $expiringSoonCount = inventory::whereNotNull('expiry_date')
            ->where('expiry_date', '!=', 'N/A')
            ->where('expiry_date', '>', now())
            ->where('expiry_date', '<=', now()->addDays(30))
            ->count();
        
        return Inertia::render('Authenticated/Pharmacist/Inventory', [
            'categories' => icategory::where('status', 1)->get(),
            'allCategories' => icategory::get(), // Include archived categories for management
            'inventory' => inventory::with(['category','stock','stocks_movement'])->get(), // Get all items (active and archived)
            'movements_' => istock_movements::with(['inventory','staff','stocks'])
                ->select(['id', 'type', 'quantity', 'reason', 'batch_number', 'inventory_name', 'staff_id', 'stock_id'])
                ->orderBy('id', 'desc')
                ->get(),
            'items' => inventory::with(['category', 'stock', 'stocks_movement'])->get(), // Get all items
            'inventoryItems' => inventory::with(['category', 'stock', 'stocks_movement'])->get(), // Get all items
            'expiringSoonCount' => $expiringSoonCount, // Add this count for display
        ]);
    }


    /**
     * Display the reports page
     */
    public function reports()
    {
        // Get all inventory items with their batches
        $inventoryItems = inventory::with(['category', 'stock', 'stocks_movement'])->get();
        
        // Process inventory data to identify expired and expiring soon batches
        $expiredBatches = [];
        $expiringSoonBatches = [];
        
        foreach ($inventoryItems as $item) {
            if ($item->expiry_date && $item->expiry_date !== 'N/A') {
                try {
                    $expiryDate = new \DateTime($item->expiry_date);
                    $today = new \DateTime();
                    $daysUntilExpiry = $today->diff($expiryDate)->days;
                    
                    // Check if expired
                    if ($expiryDate < $today) {
                        $expiredBatches[] = [
                            'id' => $item->id,
                            'name' => $item->name,
                            'batch_number' => $item->batch_number ?? 'N/A',
                            'quantity' => $item->stock->stocks ?? 0,
                            'expiry_date' => $item->expiry_date,
                            'category' => $item->category->name ?? 'Uncategorized',
                            'manufacturer' => $item->manufacturer ?? 'N/A',
                            'unit' => $item->unit_type ?? 'pieces',
                            'storage_location' => $item->storage_location ?? 'N/A',
                            'days_expired' => $today->diff($expiryDate)->days,
                        ];
                    }
                    // Check if expiring soon (within 30 days)
                    elseif ($daysUntilExpiry <= 30) {
                        $expiringSoonBatches[] = [
                            'id' => $item->id,
                            'name' => $item->name,
                            'batch_number' => $item->batch_number ?? 'N/A',
                            'quantity' => $item->stock->stocks ?? 0,
                            'expiry_date' => $item->expiry_date,
                            'category' => $item->category->name ?? 'Uncategorized',
                            'manufacturer' => $item->manufacturer ?? 'N/A',
                            'unit' => $item->unit_type ?? 'pieces',
                            'storage_location' => $item->storage_location ?? 'N/A',
                            'days_until_expiry' => $daysUntilExpiry,
                        ];
                    }
                } catch (\Exception $e) {
                    // Skip invalid dates
                    continue;
                }
            }
        }
        
        // Sort expired batches by days expired (most expired first)
        usort($expiredBatches, function($a, $b) {
            return $b['days_expired'] - $a['days_expired'];
        });
        
        // Sort expiring soon batches by days until expiry (soonest first)
        usort($expiringSoonBatches, function($a, $b) {
            return $a['days_until_expiry'] - $b['days_until_expiry'];
        });
        
        // Get dispensing data
        $dispensingData = istock_movements::with(['inventory', 'staff', 'stocks'])
            ->where('type', 'Outgoing')
            ->orderBy('id', 'desc')
            ->get();

        // Process dispensing data for reports
        $dispensingSummary = [
            'totalDispensed' => $dispensingData->count(),
            'totalQuantity' => $dispensingData->sum('quantity'),
            'todayDispensed' => $dispensingData->where('created_at', '>=', now()->startOfDay())->count(),
            'thisWeekDispensed' => $dispensingData->where('created_at', '>=', now()->startOfWeek())->count(),
            'thisMonthDispensed' => $dispensingData->where('created_at', '>=', now()->startOfMonth())->count(),
        ];

        // Get top dispensed items
        $topDispensedItems = $dispensingData->groupBy('inventory_name')
            ->map(function ($items) {
                return [
                    'name' => $items->first()->inventory_name,
                    'totalQuantity' => $items->sum('quantity'),
                    'dispenseCount' => $items->count(),
                    'lastDispensed' => $items->max('created_at')
                ];
            })
            ->sortByDesc('totalQuantity')
            ->take(10)
            ->values();

        return Inertia::render('Authenticated/Pharmacist/Reports', [
            'expiredBatches' => $expiredBatches,
            'expiringSoonBatches' => $expiringSoonBatches,
            'expiredBatchesCount' => count($expiredBatches),
            'expiringSoonBatchesCount' => count($expiringSoonBatches),
            'inventoryItems' => $inventoryItems,
            'dispensingData' => $dispensingData,
            'dispensingSummary' => $dispensingSummary,
            'topDispensedItems' => $topDispensedItems,
        ]);
    }

    /**
     * Display the settings page
     */
    public function settings()
    {
        return Inertia::render('Authenticated/Pharmacist/Settings');
    }

    /**
     * Add a new category
     */
    public function add_category(Request $request)
    {
        $request->validate([
            'name' => 'required|min:3',
            'description' => 'nullable|string',
            'icon' => 'nullable|string'
        ]);

        $category = icategory::create([
            'name' => $request->name,
            'description' => $request->description,
            'icon' => $request->icon
        ]);

        event(new InventoryUpdated('category.add', ['id' => $category->id]));
        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Category added successfully!",
                'icon' => "success"
            ]
        ]);
    }

    /**
     * Delete a category
     */
    public function delete_category(icategory $category)
    {
        $id = $category->id;
        $category->delete();

        event(new InventoryUpdated('category.delete', ['id' => $id]));
        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Category deleted successfully!",
                'icon' => "success"
            ]
        ]);
    }

    /**
     * Update a category
     */
    public function update_category(Request $request, icategory $category)
    {
        $request->validate([
            'name' => 'required|min:3',
            'icon' => 'nullable|string'
        ]);

        $category->update([
            'name' => $request->name,
            'icon' => $request->icon
        ]);

        event(new InventoryUpdated('category.update', ['id' => $category->id]));
        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Category updated successfully!",
                'icon' => "success"
            ]
        ]);
    }

    /**
     * Archive a category
     */
    public function archive_category(icategory $category)
    {
        $category->update([
            'status' => 0
        ]);

        event(new InventoryUpdated('category.archive', ['id' => $category->id]));
        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Category archived successfully!",
                'icon' => "success"
            ]
        ]);
    }

    /**
     * Unarchive a category
     */
    public function unarchive_category(icategory $category)
    {
        $category->update([
            'status' => 1
        ]);

        event(new InventoryUpdated('category.unarchive', ['id' => $category->id]));
        return back()->with([
            'flash' => [
                'title' => 'Success!',
                'message' => "Category unarchived successfully!",
                'icon' => "success"
            ]
        ]);
    }

    /**
     * Add a new inventory item
     */
    public function add_item(Request $request)
    {
        $request->validate([
            'itemname' => "required",
            'categoryid' => "required|exists:icategory,id",
            'unit_type' => 'required|min:3',
            'quantity' => "required|min:0",
            'expiry_date' => "required|date|after_or_equal:today",
            'batch_number' => "required|string|min:3",
            'manufacturer' => "nullable|string",
            'description' => "nullable|string",
            'minimum_stock' => "nullable|integer|min:0",
            'maximum_stock' => "nullable|integer|min:0",
            'storage_location' => "nullable|string",
        ]);

        try {
            DB::beginTransaction();

            $inventory = inventory::create([
                'name' => $request->itemname,
                'manufacturer' => $request->manufacturer,
                'description' => $request->description,
                'unit_type' => $request->unit_type,
                'minimum_stock' => $request->minimum_stock ?? 10,
                'maximum_stock' => $request->maximum_stock ?? 100,
                'storage_location' => $request->storage_location,
                'batch_number' => $request->batch_number,
                'expiry_date' => $request->expiry_date,
                'category_id' => $request->categoryid,
            ]);

            $stock = istocks::create([
                'stocks' => $request->quantity,
                'stockname' => $request->unit_type,
                'inventory_id' => $inventory->id
            ]);

            // Update inventory with stock_id
            $inventory->update(['stock_id' => $stock->id]);

            $stock_movement = istock_movements::create([
                'inventory_id' => $inventory->id,
                'staff_id' => Auth::user()->id,
                'quantity' => $request->quantity,
                'expiry_date' => $request->expiry_date,
                'inventory_name' => $inventory->name,
                'stock_id' => $stock->id,
                'batch_number' => $request->batch_number,
                'type' => 'Incoming'
            ]);

            DB::commit();
            event(new InventoryUpdated('item.add', ['id' => $inventory->id]));
        } catch (\Exception $e) {
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

    /**
     * Update an inventory item
     */
public function update_item(Request $request, inventory $inventory)
    {
        $request->validate([
            'itemname' => "required",
            'categoryid' => "required|exists:icategory,id",
            'manufacturer' => "nullable|string",
            'description' => "nullable|string",
            'unit_type' => "nullable|string",
            'storage_location' => "nullable|string",
            'batch_number' => "nullable|string",
            'expiry_date' => "nullable|date",
            'is_new_batch' => "nullable|boolean",
        ]);

        try {
            DB::beginTransaction();

            // Debug: Log the request data
            \Log::info('Update item request:', [
                'is_new_batch' => $request->is_new_batch,
                'batch_number' => $request->batch_number,
                'itemname' => $request->itemname,
                'all_data' => $request->all()
            ]);

            // Check if this is adding a new batch
            if ($request->is_new_batch && $request->batch_number && $request->batch_number !== 'new_batch') {
                // Check if batch already exists for this item
                $existingBatch = inventory::where('name', $request->itemname)
                    ->where('batch_number', $request->batch_number)
                    ->where('id', '!=', $inventory->id)
                    ->first();

                if ($existingBatch) {
                    return back()->with([
                        'flash' => [
                            'title' => 'Error!',
                            'message' => "Batch number '{$request->batch_number}' already exists for this item!",
                            'icon' => "error"
                        ]
                    ]);
                }

                // Create a new inventory record for the new batch
                $newInventory = inventory::create([
                    'name' => $request->itemname,
                    'manufacturer' => $request->manufacturer,
                    'description' => $request->description,
                    'unit_type' => $request->unit_type,
                    'storage_location' => $request->storage_location,
                    'batch_number' => $request->batch_number,
                    'expiry_date' => $request->expiry_date,
                    'category_id' => $request->categoryid,
                    'status' => 1,
                ]);

                // Create stock record for the new batch
                $stock = istocks::create([
                    'inventory_id' => $newInventory->id,
                    'stocks' => 0, // Start with 0 stock
                    'stockname' => $request->unit_type ?? 'units',
                ]);

                $newInventory->update(['stock_id' => $stock->id]);

                // Create stock movement record for the new batch
                istock_movements::create([
                    'inventory_id' => $newInventory->id,
                    'staff_id' => Auth::user()->id,
                    'quantity' => 0, // No initial stock
                    'expiry_date' => $request->expiry_date,
                    'inventory_name' => $request->itemname,
                    'stock_id' => $stock->id,
                    'batch_number' => $request->batch_number,
                    'type' => 'Incoming',
                    'reason' => 'New batch added',
                ]);

                DB::commit();
                event(new InventoryUpdated('item.add', ['id' => $newInventory->id]));

                return back()->with([
                    'flash' => [
                        'title' => 'Success!',
                        'message' => "New batch '{$request->batch_number}' added successfully!",
                        'icon' => "success"
                    ]
                ]);
            } else {
                // Update existing inventory item
                $inventory->update([
                    'name' => $request->itemname,
                    'manufacturer' => $request->manufacturer,
                    'description' => $request->description,
                    'unit_type' => $request->unit_type,
                    'storage_location' => $request->storage_location,
                    'batch_number' => $request->batch_number,
                    'expiry_date' => $request->expiry_date,
                    'category_id' => $request->categoryid,
                ]);

                $inventory->stocks_movement()->update([
                    'inventory_name' => $request->itemname,
                ]);

                DB::commit();
                event(new InventoryUpdated('item.update', ['id' => $inventory->id]));

                return back()->with([
                    'flash' => [
                        'title' => 'Success!',
                        'message' => "Item updated successfully!",
                        'icon' => "success"
                    ]
                ]);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with([
                'flash' => [
                    'title' => 'Error!',
                    'message' => "Error: " . $e->getMessage(),
                    'icon' => "error"
                ]
            ]);
        }
    }

    /**
     * Add a new batch to an existing inventory item
     */
    public function add_batch(Request $request)
    {
        $request->validate([
            'itemname' => "required",
            'categoryid' => "required|exists:icategory,id",
            'manufacturer' => "nullable|string",
            'description' => "nullable|string",
            'unit_type' => "nullable|string",
            'storage_location' => "nullable|string",
            'batch_number' => "required|string",
            'expiry_date' => "required|date",
            'original_item_id' => "required|exists:inventory,id",
        ]);

        \Log::info('Add batch request data:', $request->all());

        try {
            DB::beginTransaction();

            // Check if batch already exists for this item
            $existingBatch = inventory::where('name', $request->itemname)
                ->where('batch_number', $request->batch_number)
                ->first();

            if ($existingBatch) {
                return back()->with([
                    'flash' => [
                        'title' => 'Error!',
                        'message' => "Batch number '{$request->batch_number}' already exists for this item!",
                        'icon' => "error"
                    ]
                ]);
            }

            // Create a new inventory record for the new batch
            $newInventory = inventory::create([
                'name' => $request->itemname,
                'manufacturer' => $request->manufacturer,
                'description' => $request->description,
                'unit_type' => $request->unit_type,
                'storage_location' => $request->storage_location,
                'batch_number' => $request->batch_number,
                'expiry_date' => $request->expiry_date,
                'category_id' => $request->categoryid,
                'status' => 1,
            ]);

            // Create stock record for the new batch
            $stock = istocks::create([
                'inventory_id' => $newInventory->id,
                'stocks' => 0, // Start with 0 stock
                'stockname' => $request->unit_type ?? 'units',
            ]);

            $newInventory->update(['stock_id' => $stock->id]);

            // Create stock movement record for the new batch
            istock_movements::create([
                'inventory_id' => $newInventory->id,
                'staff_id' => Auth::user()->id,
                'quantity' => 0, // No initial stock
                'expiry_date' => $request->expiry_date,
                'inventory_name' => $request->itemname,
                'stock_id' => $stock->id,
                'batch_number' => $request->batch_number,
                'type' => 'Incoming',
                'reason' => 'New batch added',
            ]);

            DB::commit();
            event(new InventoryUpdated('item.add', ['id' => $newInventory->id]));

            return response()->json([
                'success' => true,
                'message' => "New batch '{$request->batch_number}' added successfully!",
                'data' => $newInventory
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Add batch error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => "Error: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an inventory item
     */
    public function delete_item(inventory $inventory)
    {
        try {
            DB::beginTransaction();

            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            $inventory->stocks_movement()->update([
                'type' => "Outgoing",
                "staff_id" => Auth::user()->id
            ]);

            $inventory->stock()->delete();

            $inventory->delete();

            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            DB::commit();
            event(new InventoryUpdated('item.delete', ['id' => $inventory->id]));
        } catch (\Exception $e) {
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

    /**
     * Update stock movement
     */
    public function update_stock_movement(Request $request, istock_movements $movement)
    {
        $request->validate([
            'type' => "required|in:Incoming,Outgoing",
            'quantity' => [
                "required",
                "numeric",
                "min:1",
                Rule::when($request->type == "Outgoing", [
                    'max' => function () use ($movement) {
                        return $movement->stocks->stocks;
                    }
                ])
            ],
            'expiry' => 'required|date|after_or_equal:today',
            'batchNumber' => [
                Rule::when($request->type == "Incoming", ['required', 'string', 'min:3']),
            ]
        ]);

        try {
            DB::beginTransaction();

            $newMovement = $movement->replicate();
            $newMovement->save();

            $newQuantity = $request->type === "Incoming" 
                ? $movement->stocks->stocks + $request->quantity 
                : $movement->stocks->stocks - $request->quantity;

            $newMovement->update([
                'type' => $request->type,
                'quantity' => $request->quantity,
                'reason' => $request->reason,
                'staff_id' => Auth::user()->id,
                'expiry_date' => $request->expiry,
                'batch_number' => $request->type === "Incoming" ? $request->batchNumber : null,
            ]);

            $movement->stocks()->update([
                'stocks' => $newQuantity
            ]);

            DB::commit();
            event(new InventoryUpdated('stockmovement.update', ['id' => $movement->id]));
        } catch (\Exception $e) {
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

    /**
     * Archive an inventory item
     */
    public function archive_item(inventory $inventory)
    {
        $inventory->update([
            'status' => 0
        ]);

        event(new InventoryUpdated('item.archive', ['id' => $inventory->id]));
        return back();
    }

    /**
     * Unarchive an inventory item
     */
    public function unarchive_item(inventory $inventory)
    {
        $inventory->update([
            'status' => 1
        ]);

        event(new InventoryUpdated('item.unarchive', ['id' => $inventory->id]));
        return back();
    }

    public function dispense_item(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:inventory,id',
            'batch_number' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string',
            'patient_name' => 'nullable|string',
            'case_id' => 'nullable|string',
            'dispensed_by' => 'required|string',
            'doctor_id' => 'nullable|integer|exists:users,id',
            'notes' => 'nullable|string',
            'dispense_mode' => 'nullable|string|in:prescription,manual'
        ]);

        try {
            DB::beginTransaction();

            // Get the inventory item
            $inventory = inventory::findOrFail($request->item_id);
            $stock = $inventory->stock;

            // Check if there's enough stock
            if ($stock->stocks < $request->quantity) {
                return back()->withErrors(['quantity' => 'Insufficient stock. Available: ' . $stock->stocks]);
            }

            // Update stock quantity
            $stock->update([
                'stocks' => $stock->stocks - $request->quantity
            ]);

            // Create stock movement record
            istock_movements::create([
                'inventory_id' => $inventory->id,
                'staff_id' => Auth::user()->id,
                'stock_id' => $stock->id,
                'quantity' => $request->quantity,
                'type' => 'Outgoing',
                'reason' => $request->reason,
                'batch_number' => $request->batch_number,
                'inventory_name' => $inventory->name,
                'patient_name' => $request->patient_name ?? 'Manual Dispense',
                'prescription_number' => $request->case_id ?? null,
                'dispensed_by' => $request->dispensed_by,
                'notes' => $request->notes ?? ($request->dispense_mode === 'manual' ? 'Manual dispense' : null)
            ]);

            DB::commit();
            event(new InventoryUpdated('item.dispense', ['id' => $inventory->id]));

            return back()->with([
                'flash' => [
                    'title' => 'Success!',
                    'message' => "Stock dispensed successfully! {$request->quantity} units of {$inventory->name} dispensed to {$request->patient_name}.",
                    'icon' => "success"
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to dispense stock: ' . $e->getMessage()]);
        }
    }

    public function dispose_item(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:inventory,id',
            'batch_number' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'disposal_reason' => 'required|string',
            'disposal_method' => 'required|string',
            'disposal_date' => 'required|date',
            'disposed_by' => 'required|string',
            'notes' => 'nullable|string',
            'disposal_cost' => 'nullable|numeric|min:0'
        ]);

        try {
            DB::beginTransaction();

            // Get the inventory item
            $inventory = inventory::findOrFail($request->item_id);
            $stock = $inventory->stock;

            // Check if there's enough stock
            if ($stock->stocks < $request->quantity) {
                return back()->withErrors(['quantity' => 'Insufficient stock. Available: ' . $stock->stocks]);
            }

            // Update stock quantity (reduce by disposed amount)
            $stock->update([
                'stocks' => $stock->stocks - $request->quantity
            ]);

            // Create stock movement record for disposal
            istock_movements::create([
                'inventory_id' => $inventory->id,
                'staff_id' => Auth::user()->id,
                'stock_id' => $stock->id,
                'quantity' => $request->quantity,
                'type' => 'Disposal',
                'reason' => $request->disposal_reason,
                'batch_number' => $request->batch_number,
                'inventory_name' => $inventory->name,
                'patient_name' => null, // Not applicable for disposal
                'prescription_number' => null, // Not applicable for disposal
                'dispensed_by' => $request->disposed_by,
                'notes' => $request->notes . ' | Disposal Method: ' . $request->disposal_method . 
                          ($request->disposal_cost ? ' | Cost: $' . $request->disposal_cost : '')
            ]);

            DB::commit();
            event(new InventoryUpdated('item.dispose', ['id' => $inventory->id]));

            return back()->with([
                'flash' => [
                    'title' => 'Success!',
                    'message' => "Batch disposed successfully! {$request->quantity} units of {$inventory->name} (Batch: {$request->batch_number}) disposed via {$request->disposal_method}.",
                    'icon' => "success"
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to dispose batch: ' . $e->getMessage()]);
        }
    }

    /**
     * Dispose multiple batches in one request
     */
    public function bulk_dispose(Request $request)
    {
        \Log::info('Bulk dispose request received', [
            'request_data' => $request->all(),
            'batches_count' => count($request->batches ?? [])
        ]);
        
        $request->validate([
            'item_id' => 'required|exists:inventory,id',
            'batches' => 'required|array|min:1',
            'batches.*.batch_number' => 'required|string',
            'batches.*.quantity' => 'required|integer|min:1',
            'disposal_reason' => 'required|string',
            'disposal_method' => 'required|string',
            'disposal_date' => 'required|date',
            'disposed_by' => 'required|string',
            'notes' => 'nullable|string',
            'disposal_cost' => 'nullable|numeric|min:0'
        ]);

        try {
            DB::beginTransaction();

            // Get the main inventory item to get the name
            $mainInventory = inventory::findOrFail($request->item_id);
            
            // Process each batch disposal individually
            foreach ($request->batches as $batch) {
                // Find the specific inventory record for this batch
                $batchInventory = inventory::where('name', $mainInventory->name)
                    ->where('batch_number', $batch['batch_number'])
                    ->first();
                
                if (!$batchInventory) {
                    throw new \Exception("Batch {$batch['batch_number']} not found for item {$mainInventory->name}");
                }
                
                $stock = $batchInventory->stock;
                $available = $stock ? (int) $stock->stocks : 0;
                $quantityToDispose = (int) $batch['quantity'];

                if ($quantityToDispose > $available) {
                    throw new \Exception("Insufficient stock for batch {$batch['batch_number']}. Available: {$available}, Requested: {$quantityToDispose}");
                }

                // Reduce stock for this specific batch
                if ($stock) {
                    $newStock = $available - $quantityToDispose;
                    $stock->update(['stocks' => $newStock]);
                    \Log::info("Updated stock for batch {$batch['batch_number']}", [
                        'inventory_id' => $batchInventory->id,
                        'old_stock' => $available,
                        'disposed' => $quantityToDispose,
                        'new_stock' => $newStock
                    ]);
                }

                // Create a movement for this batch
                istock_movements::create([
                    'inventory_id' => $batchInventory->id,
                    'staff_id' => Auth::user()->id,
                    'stock_id' => optional($batchInventory->stock)->id,
                    'quantity' => $quantityToDispose,
                    'type' => 'Disposal',
                    'reason' => $request->disposal_reason,
                    'batch_number' => $batch['batch_number'],
                    'inventory_name' => $batchInventory->name,
                    'patient_name' => null,
                    'prescription_number' => null,
                    'dispensed_by' => $request->disposed_by,
                    'notes' => ($request->notes ?? '') . ' | Method: ' . $request->disposal_method .
                              ($request->disposal_cost ? (' | Cost: $' . $request->disposal_cost) : ''),
                ]);
            }

            DB::commit();
            event(new InventoryUpdated('item.dispose.bulk', ['id' => $mainInventory->id]));

            $totalDisposed = collect($request->batches)->sum('quantity');
            return back()->with([
                'flash' => [
                    'title' => 'Success!',
                    'message' => "Disposed {$totalDisposed} units across " . count($request->batches) . " batches for {$mainInventory->name}.",
                    'icon' => 'success'
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to bulk dispose: ' . $e->getMessage()]);
        }
    }

    /**
     * Update stocks (add or reduce) for an inventory item
     */
    public function update_stocks(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:inventory,id',
            'adjustment_type' => 'required|in:add,reduce',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string',
            'reference_number' => 'nullable|string',
            'supplier' => 'nullable|string',
            'batch_number' => 'nullable|string',
            'expiry_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'minimum_stock' => 'nullable|integer|min:0',
            'maximum_stock' => 'nullable|integer|min:0',
        ]);

        try {
            DB::beginTransaction();

            // Use lockForUpdate to prevent race conditions
            $inventory = inventory::lockForUpdate()->findOrFail($request->item_id);
            $stock = $inventory->stock;

            if (!$stock) {
                // Initialize stock record if missing
                $stock = istocks::create([
                    'stocks' => 0,
                    'stockname' => $inventory->unit_type ?? 'units',
                    'inventory_id' => $inventory->id,
                ]);
                // Ensure inventory has stock_id if applicable
                if (empty($inventory->stock_id)) {
                    $inventory->update(['stock_id' => $stock->id]);
                }
            }

            // Lock the stock record for update
            $stock = istocks::lockForUpdate()->findOrFail($stock->id);
            $currentStocks = (int) $stock->stocks;
            $quantity = (int) $request->quantity;

            if ($request->adjustment_type === 'reduce' && $quantity > $currentStocks) {
                DB::rollBack();
                return back()->withErrors(['quantity' => 'Insufficient stock. Available: ' . $currentStocks]);
            }

            $newQuantity = $request->adjustment_type === 'add'
                ? $currentStocks + $quantity
                : $currentStocks - $quantity;

            // Enforce maximum stock level if defined (either incoming payload or existing inventory)
            $effectiveMax = $request->has('maximum_stock') && $request->maximum_stock !== null
                ? (int) $request->maximum_stock
                : (int) ($inventory->maximum_stock ?? 0);
            if ($effectiveMax > 0 && $newQuantity > $effectiveMax) {
                return back()->withErrors([
                    'quantity' => 'Projected stock (' . $newQuantity . ') exceeds maximum stock level (' . $effectiveMax . ').'
                ]);
            }

            $stock->update([
                'stocks' => $newQuantity
            ]);

            // Optionally update inventory min/max stock levels and expiry/batch if provided
            $inventoryUpdates = [];
            if (!is_null($request->minimum_stock)) {
                $inventoryUpdates['minimum_stock'] = $request->minimum_stock;
            }
            if (!is_null($request->maximum_stock)) {
                $inventoryUpdates['maximum_stock'] = $request->maximum_stock;
            }
            if (!empty($request->expiry_date)) {
                $inventoryUpdates['expiry_date'] = $request->expiry_date;
            }
            if (!empty($request->batch_number)) {
                $inventoryUpdates['batch_number'] = $request->batch_number;
            }
            if (!empty($inventoryUpdates)) {
                if (isset($inventoryUpdates['minimum_stock']) && isset($inventoryUpdates['maximum_stock']) && $inventoryUpdates['minimum_stock'] > $inventoryUpdates['maximum_stock']) {
                    return back()->withErrors(['maximum_stock' => 'Maximum stock must be greater than or equal to minimum stock.']);
                }
                $inventory->update($inventoryUpdates);
            }

            // Record movement
            istock_movements::create([
                'inventory_id' => $inventory->id,
                'staff_id' => Auth::user()->id,
                'stock_id' => $stock->id,
                'quantity' => $quantity,
                'type' => $request->adjustment_type === 'add' ? 'Incoming' : 'Outgoing',
                'reason' => $request->reason,
                'batch_number' => $request->batch_number,
                'expiry_date' => $request->expiry_date,
                'inventory_name' => $inventory->name,
                'notes' => $this->composeNotes($request->notes, $request->reference_number, $request->supplier),
            ]);

            DB::commit();
            event(new InventoryUpdated('item.update-stocks', [
                'id' => $inventory->id,
                'adjustment_type' => $request->adjustment_type,
                'quantity' => $quantity,
                'new_stocks' => $newQuantity,
            ]));

            return back()->with([
                'flash' => [
                    'title' => 'Success!',
                    'message' => ($request->adjustment_type === 'add' ? 'Added ' : 'Reduced ') . $quantity . ' units for ' . $inventory->name . '.',
                    'icon' => 'success',
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update stocks: ' . $e->getMessage()]);
        }
    }

    private function composeNotes(?string $notes, ?string $reference, ?string $supplier): string
    {
        $parts = [];
        if ($notes) $parts[] = $notes;
        if ($reference) $parts[] = 'Ref: ' . $reference;
        if ($supplier) $parts[] = 'Supplier: ' . $supplier;
        return implode(' | ', $parts);
    }

    /**
     * Get pending prescriptions for automatic dispensing
     */
    public function get_pending_prescriptions(Request $request)
    {
        try {
            $medicineId = $request->get('medicine_id');
            
            $query = \App\Models\Prescription::with(['doctor', 'medicines'])
                ->where('status', 'pending');
            
            // Filter by specific medicine if medicine_id is provided
            if ($medicineId) {
                $query->whereHas('medicines', function($q) use ($medicineId) {
                    $q->where('medicine_id', $medicineId);
                });
            }
            
            $prescriptions = $query->orderBy('prescription_date', 'desc')
                ->get()
                ->map(function($prescription) {
                    $patientInfo = $prescription->getPatientInfo();
                    return [
                        'id' => $prescription->id,
                        'prescription_number' => 'RX-' . str_pad($prescription->id, 6, '0', STR_PAD_LEFT),
                        'patient_name' => $patientInfo['first_name'] . ' ' . $patientInfo['last_name'],
                        'patient_id' => $prescription->patient_id,
                        'doctor_name' => $prescription->doctor ? $prescription->doctor->firstname . ' ' . $prescription->doctor->lastname : 'Unknown Doctor',
                        'doctor_id' => $prescription->doctor_id,
                        'case_id' => $prescription->case_id,
                        'prescription_date' => $prescription->prescription_date->format('Y-m-d'),
                        'medicines' => $prescription->medicines->map(function($medicine) {
                            // Get medicine data from inventory table since medicine_id references inventory
                            $inventoryItem = \App\Models\inventory::find($medicine->medicine_id);
                            
                            return [
                                'id' => $medicine->id,
                                'medicine_name' => $inventoryItem ? $inventoryItem->name : 'Unknown Medicine',
                                'medicine_id' => $medicine->medicine_id,
                                'dosage' => $medicine->dosage,
                                'frequency' => $medicine->frequency,
                                'duration' => $medicine->duration,
                                'quantity' => $medicine->quantity,
                                'instructions' => $medicine->instructions,
                                'is_dispensed' => $medicine->is_dispensed
                            ];
                        }),
                        'notes' => $prescription->notes
                    ];
                });

            \Log::info('Pending prescriptions found:', [
                'count' => $prescriptions->count(),
                'prescriptions' => $prescriptions->toArray()
            ]);

            return response()->json($prescriptions);
        } catch (\Exception $e) {
            \Log::error('Error loading pending prescriptions:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([]);
        }
    }

    /**
     * Automatically dispense items from prescription
     */
    public function auto_dispense_prescription(Request $request)
    {
        $request->validate([
            'prescription_id' => 'required|exists:prescriptions,id',
            'dispensed_by' => 'required|string',
            'item_id' => 'nullable|exists:inventory,id',
            'batch_id' => 'nullable',
            'batch_number' => 'nullable|string'
        ]);

        try {
            // Debug the incoming request
            \Log::info('Auto dispense request received:', [
                'prescription_id' => $request->prescription_id,
                'item_id' => $request->item_id,
                'batch_id' => $request->batch_id,
                'batch_id_type' => gettype($request->batch_id),
                'batch_number' => $request->batch_number,
                'all_data' => $request->all()
            ]);

            DB::beginTransaction();

            $prescription = \App\Models\Prescription::with(['doctor', 'medicines.medicine'])->findOrFail($request->prescription_id);
            
            if ($prescription->status !== 'pending') {
                if ($request->expectsJson()) {
                    return response()->json(['error' => 'Prescription is not pending for dispensing'], 400);
                }
                return back()->withErrors(['error' => 'Prescription is not pending for dispensing']);
            }

            $dispensedItems = [];
            $errors = [];

            // If specific item_id is provided, only dispense that item
            if ($request->item_id) {
                $inventory = inventory::findOrFail($request->item_id);
                $prescriptionMedicine = $prescription->medicines()
                    ->where('medicine_id', $request->item_id)
                    ->where('is_dispensed', false)
                    ->first();

                if (!$prescriptionMedicine) {
                    return response()->json([
                        'error' => 'Medicine not found in prescription or already dispensed'
                    ], 400);
                }

                // Find the specific stock/batch
                $stock = $inventory->stock;
                if (!$stock) {
                    return response()->json([
                        'error' => "No stock record found for '{$inventory->name}'"
                    ], 400);
                }
                
                if ($stock->stocks < $prescriptionMedicine->quantity) {
                    return response()->json([
                        'error' => "Insufficient stock for '{$inventory->name}'. Required: {$prescriptionMedicine->quantity}, Available: {$stock->stocks}"
                    ], 400);
                }

                // Update stock quantity
                $stock->update([
                    'stocks' => $stock->stocks - $prescriptionMedicine->quantity
                ]);

                // Create stock movement record
                istock_movements::create([
                    'inventory_id' => $inventory->id,
                    'staff_id' => Auth::user()->id,
                    'stock_id' => $stock->id,
                    'quantity' => $prescriptionMedicine->quantity,
                    'type' => 'Outgoing',
                    'reason' => 'Prescription Dispensing',
                    'batch_number' => $request->batch_number ?? $stock->batch_number ?? 'AUTO-' . date('Ymd'),
                    'inventory_name' => $inventory->name,
                    'patient_name' => $prescription->getPatientInfo()['first_name'] . ' ' . $prescription->getPatientInfo()['last_name'],
                    'prescription_number' => 'RX-' . str_pad($prescription->id, 6, '0', STR_PAD_LEFT),
                    'dispensed_by' => $request->dispensed_by,
                    'notes' => "Auto-dispensed from prescription. Dosage: {$prescriptionMedicine->dosage}, Frequency: {$prescriptionMedicine->frequency}, Duration: {$prescriptionMedicine->duration}. Instructions: {$prescriptionMedicine->instructions}"
                ]);

                // Mark prescription medicine as dispensed
                $prescriptionMedicine->update(['is_dispensed' => true]);
                
                $dispensedItems[] = [
                    'medicine' => $inventory->name,
                    'quantity' => $prescriptionMedicine->quantity,
                    'dosage' => $prescriptionMedicine->dosage,
                    'instructions' => $prescriptionMedicine->instructions
                ];
            } else {
                // Original logic for dispensing all medicines
                foreach ($prescription->medicines as $prescriptionMedicine) {
                    if ($prescriptionMedicine->is_dispensed) {
                        continue; // Skip already dispensed medicines
                    }

                    // Find corresponding inventory item
                    $inventory = inventory::where('name', 'like', '%' . $prescriptionMedicine->medicine->name . '%')
                        ->orWhere('id', $prescriptionMedicine->medicine_id)
                        ->first();

                    if (!$inventory) {
                        $errors[] = "Medicine '{$prescriptionMedicine->medicine->name}' not found in inventory";
                        continue;
                    }

                    $stock = $inventory->stock;
                    if (!$stock || $stock->stocks < $prescriptionMedicine->quantity) {
                        $errors[] = "Insufficient stock for '{$inventory->name}'. Available: " . ($stock ? $stock->stocks : 0);
                        continue;
                    }

                    // Update stock quantity
                    $stock->update([
                        'stocks' => $stock->stocks - $prescriptionMedicine->quantity
                    ]);

                    // Create stock movement record
                    istock_movements::create([
                        'inventory_id' => $inventory->id,
                        'staff_id' => Auth::user()->id,
                        'stock_id' => $stock->id,
                        'quantity' => $prescriptionMedicine->quantity,
                        'type' => 'Outgoing',
                        'reason' => 'Prescription Dispensing',
                        'batch_number' => $stock->batch_number ?? 'AUTO-' . date('Ymd'),
                        'inventory_name' => $inventory->name,
                        'patient_name' => $prescription->getPatientInfo()['first_name'] . ' ' . $prescription->getPatientInfo()['last_name'],
                        'prescription_number' => 'RX-' . str_pad($prescription->id, 6, '0', STR_PAD_LEFT),
                        'dispensed_by' => $request->dispensed_by,
                        'notes' => "Auto-dispensed from prescription. Dosage: {$prescriptionMedicine->dosage}, Frequency: {$prescriptionMedicine->frequency}, Duration: {$prescriptionMedicine->duration}. Instructions: {$prescriptionMedicine->instructions}"
                    ]);

                    // Mark prescription medicine as dispensed
                    $prescriptionMedicine->update(['is_dispensed' => true]);
                    
                    $dispensedItems[] = [
                        'medicine' => $inventory->name,
                        'quantity' => $prescriptionMedicine->quantity,
                        'dosage' => $prescriptionMedicine->dosage,
                        'instructions' => $prescriptionMedicine->instructions
                    ];
                }
            }

            // Check if all medicines are dispensed
            $allDispensed = $prescription->medicines()->where('is_dispensed', false)->count() === 0;
            
            if ($allDispensed) {
                $prescription->markAsDispensed(Auth::user()->id);
            }

            DB::commit();

            // Fire inventory update event to refresh frontend
            event(new InventoryUpdated('item.dispense', ['prescription_id' => $prescription->id]));

            // Send notifications after successful dispense
            $this->sendDispenseNotifications($prescription, $dispensedItems);

            // Generate dispense summary/report
            $dispenseSummary = $this->generateDispenseSummary($prescription, $dispensedItems, $errors);

            $message = "Prescription dispensed successfully! ";
            if (!empty($dispensedItems)) {
                $patientInfo = $prescription->getPatientInfo();
                $message .= "Dispensed " . count($dispensedItems) . " medicines to {$patientInfo['first_name']} {$patientInfo['last_name']}.";
            }
            if (!empty($errors)) {
                $message .= " Errors: " . implode(', ', $errors);
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $message,
                    'dispensed_items' => $dispensedItems,
                    'errors' => $errors,
                    'prescription_id' => $prescription->id,
                    'dispense_summary' => $dispenseSummary
                ]);
            }

            return back()->with([
                'flash' => [
                    'title' => 'Success!',
                    'message' => $message,
                    'icon' => !empty($errors) ? 'warning' : 'success'
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Failed to dispense prescription: ' . $e->getMessage()], 500);
            }
            return back()->withErrors(['error' => 'Failed to dispense prescription: ' . $e->getMessage()]);
        }
    }

    /**
     * Get patients and doctors for dispensing
     */
    public function get_patients_and_doctors()
    {
        // Get admins from users table with Admin role
        $patients = \App\Models\User::whereHas('role', function($query) {
                $query->where('roletype', 'Admin');
            })
            ->select('id', 'firstname', 'lastname', 'middlename')
            ->get()
            ->map(function($patient) {
                $fullName = $patient->firstname . ' ' . 
                           ($patient->middlename ? substr($patient->middlename, 0, 1) . '. ' : '') . 
                           $patient->lastname;
                return [
                    'id' => $patient->id,
                    'name' => $fullName,
                    'first_name' => $patient->firstname,
                    'last_name' => $patient->lastname
                ];
            });

        // Get doctors from users table with Doctor role
        $doctors = \App\Models\User::whereHas('role', function($query) {
                $query->where('roletype', 'Doctor');
            })
            ->select('id', 'firstname', 'lastname')
            ->get()
            ->map(function($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->firstname . ' ' . $doctor->lastname,
                    'firstname' => $doctor->firstname,
                    'lastname' => $doctor->lastname
                ];
            });

        return response()->json([
            'patients' => $patients,
            'doctors' => $doctors
        ]);
    }

    /**
     * Return available batches for a given inventory item
     */
    public function get_item_batches(inventory $inventory)
    {
        $batches = [];
        
        // Get all stock movements for this inventory item and calculate net quantities per batch
        $stockMovements = istock_movements::where('inventory_id', $inventory->id)
            ->whereNotNull('batch_number')
            ->where('batch_number', '!=', '')
            ->select('batch_number', 'expiry_date', 'type', 'quantity', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        // Group by batch number and calculate net quantity
        $batchQuantities = [];
        foreach ($stockMovements as $movement) {
            $batchNumber = $movement->batch_number;
            
            if (!isset($batchQuantities[$batchNumber])) {
                $batchQuantities[$batchNumber] = [
                    'batch_number' => $batchNumber,
                    'expiry_date' => $movement->expiry_date,
                    'net_quantity' => 0,
                    'latest_movement' => $movement
                ];
            }
            
            // Add incoming quantities, subtract outgoing/disposal quantities
            if ($movement->type === 'Incoming') {
                $batchQuantities[$batchNumber]['net_quantity'] += $movement->quantity;
            } elseif (in_array($movement->type, ['Outgoing', 'Disposal'])) {
                $batchQuantities[$batchNumber]['net_quantity'] -= $movement->quantity;
            }
        }

        // Show all batches for all inventory items with the same name (excluding expired batches)
        $allItemsWithSameName = inventory::where('name', $inventory->name)->get();
        
        foreach ($allItemsWithSameName as $item) {
            if ($item->batch_number) {
                // Check if the batch is expired
                $isExpired = false;
                if ($item->expiry_date) {
                    $expiryDate = \Carbon\Carbon::parse($item->expiry_date);
                    $isExpired = $expiryDate->isPast();
                }
                
                // Only include non-expired batches
                if (!$isExpired) {
                    $batches[] = [
                        'batch_number' => $item->batch_number,
                        'expiry_date' => $item->expiry_date,
                        'available_quantity' => optional($item->stock)->stocks ?? 0,
                        'location' => $item->storage_location,
                    ];
                }
            }
        }
        
        // Remove duplicate batches (in case multiple items have the same batch number)
        $batches = array_unique($batches, SORT_REGULAR);
        
        // Debug: Log the results
        \Log::info('Batch filtering results for inventory ' . $inventory->id, [
            'inventory_name' => $inventory->name,
            'inventory_batch' => $inventory->batch_number,
            'all_items_with_same_name' => $allItemsWithSameName->pluck('batch_number')->toArray(),
            'filtered_batches' => $batches,
            'expired_batches_filtered' => $allItemsWithSameName->filter(function($item) {
                if ($item->expiry_date) {
                    return \Carbon\Carbon::parse($item->expiry_date)->isPast();
                }
                return false;
            })->pluck('batch_number')->toArray()
        ]);

        return response()->json($batches);
    }

    /**
     * Return batches for multiple items
     */
    public function get_items_batches(Request $request)
    {
        $request->validate([
            'item_ids' => 'required|array|min:1',
            'item_ids.*' => 'integer|exists:inventory,id'
        ]);

        $inventories = inventory::with('stock')->whereIn('id', $request->item_ids)->get();
        $result = [];
        foreach ($inventories as $inv) {
            $result[] = [
                'item_id' => $inv->id,
                'item_name' => $inv->name,
                'batch_number' => $inv->batch_number,
                'expiry_date' => $inv->expiry_date,
                'available_quantity' => optional($inv->stock)->stocks ?? 0,
                'location' => $inv->storage_location,
            ];
        }
        return response()->json($result);
    }

    /**
     * Get available Case IDs from prescriptions
     */
    public function get_available_case_ids()
    {
        try {
            // Get unique case IDs from prescriptions that are not null and not empty
            $caseIds = \App\Models\Prescription::whereNotNull('case_id')
                ->where('case_id', '!=', '')
                ->distinct()
                ->pluck('case_id')
                ->sort()
                ->values();

            // Try to get case IDs from medical records if the table exists
            $medicalRecordCaseIds = collect();
            try {
                if (\Schema::hasTable('medical_records')) {
                    $medicalRecordCaseIds = \App\Models\MedicalRecord::whereNotNull('id')
                        ->distinct()
                        ->pluck('id')
                        ->map(function($id) {
                            return 'MR-' . str_pad($id, 6, '0', STR_PAD_LEFT);
                        })
                        ->sort()
                        ->values();
                }
            } catch (\Exception $e) {
                // Medical records table doesn't exist or has issues, skip it
                \Log::info('Medical records table not available: ' . $e->getMessage());
            }

            // Combine and deduplicate
            $allCaseIds = $caseIds->concat($medicalRecordCaseIds)
                ->unique()
                ->sort()
                ->values();

            return response()->json([
                'case_ids' => $allCaseIds,
                'count' => $allCaseIds->count()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching case IDs: ' . $e->getMessage());
            return response()->json([
                'case_ids' => [],
                'count' => 0,
                'error' => 'Failed to fetch case IDs'
            ], 500);
        }
    }

    /**
     * Dispose multiple batches across multiple items
     */
    public function bulk_dispose_aggregate(Request $request)
    {
        $request->validate([
            'batches' => 'required|array|min:1',
            'batches.*.item_id' => 'required|integer|exists:inventory,id',
            'batches.*.batch_number' => 'required|string',
            'batches.*.quantity' => 'required|integer|min:1',
            'disposal_reason' => 'required|string',
            'disposal_method' => 'required|string',
            'disposal_date' => 'required|date',
            'disposed_by' => 'required|string',
            'notes' => 'nullable|string',
            'disposal_cost' => 'nullable|numeric|min:0'
        ]);

        try {
            DB::beginTransaction();

            // Group batches by item
            $grouped = [];
            foreach ($request->batches as $b) {
                $grouped[$b['item_id']][] = $b;
            }

            foreach ($grouped as $itemId => $batches) {
                $inventory = inventory::with('stock')->findOrFail($itemId);
                $stock = $inventory->stock;
                $available = $stock ? (int) $stock->stocks : 0;
                $toDispose = collect($batches)->sum('quantity');

                if ($toDispose > $available) {
                    return back()->withErrors(['quantity' => "Insufficient stock for {$inventory->name}. Available: {$available}"]);
                }

                if ($stock) {
                    $stock->update(['stocks' => $available - $toDispose]);
                }

                foreach ($batches as $batch) {
                    istock_movements::create([
                        'inventory_id' => $inventory->id,
                        'staff_id' => Auth::user()->id,
                        'stock_id' => optional($inventory->stock)->id,
                        'quantity' => (int) $batch['quantity'],
                        'type' => 'Disposal',
                        'reason' => $request->disposal_reason,
                        'batch_number' => $batch['batch_number'],
                        'inventory_name' => $inventory->name,
                        'patient_name' => null,
                        'prescription_number' => null,
                        'dispensed_by' => $request->disposed_by,
                        'notes' => ($request->notes ?? '') . ' | Method: ' . $request->disposal_method .
                                  ($request->disposal_cost ? (' | Cost: $' . $request->disposal_cost) : ''),
                    ]);
                }
            }

            DB::commit();
            event(new InventoryUpdated('item.dispose.bulk.aggregate', []));

            return back()->with([
                'flash' => [
                    'title' => 'Success!',
                    'message' => 'Disposed selected batches across selected items.',
                    'icon' => 'success'
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to bulk dispose: ' . $e->getMessage()]);
        }
    }

    /**
     * Send notifications after successful dispense
     */
    private function sendDispenseNotifications($prescription, $dispensedItems)
    {
        try {
            // Get prescription details
            $patientInfo = $prescription->getPatientInfo();
            $doctor = $prescription->doctor;
            $pharmacist = Auth::user();
            
            // Prepare medicine list for notification
            $medicineList = collect($dispensedItems)->map(function($item) {
                return "• {$item['medicine']} - {$item['quantity']} units";
            })->join("\n");

            // Notify the doctor who prescribed the medicine
            if ($doctor) {
                $doctorMessage = "Prescription RX-" . str_pad($prescription->id, 6, '0', STR_PAD_LEFT) . 
                    " has been dispensed to patient {$patientInfo['first_name']} {$patientInfo['last_name']}.\n\n" .
                    "Dispensed medicines:\n{$medicineList}\n\n" .
                    "Dispensed by: {$pharmacist->firstname} {$pharmacist->lastname} (Pharmacist)";
                
                NotifSender::SendNotif(
                    true, // is_id = true (send to specific user ID)
                    [$doctor->id], // recipient IDs
                    $doctorMessage,
                    'Prescription Dispensed',
                    'prescription_dispensed'
                );
            }

            // Notify the patient (commented out - no direct patient relationship)
            // if ($patient) {
            //     $patientMessage = "Your prescription RX-" . str_pad($prescription->id, 6, '0', STR_PAD_LEFT) . 
            //         " has been dispensed successfully!\n\n" .
            //         "Dispensed medicines:\n{$medicineList}\n\n" .
            //         "Please follow the dosage instructions provided by your doctor.";
            //     
            //     NotifSender::SendNotif(
            //         true, // is_id = true (send to specific user ID)
            //         [$patient->id], // recipient IDs
            //         $patientMessage,
            //         'Prescription Ready for Pickup',
            //         'prescription_ready'
            //     );
            // }

            // Notify admin/staff about the dispense activity
            $adminMessage = "Prescription RX-" . str_pad($prescription->id, 6, '0', STR_PAD_LEFT) . 
                " dispensed to {$patientInfo['first_name']} {$patientInfo['last_name']} by {$pharmacist->firstname} {$pharmacist->lastname}.\n\n" .
                "Dispensed medicines:\n{$medicineList}";
            
            NotifSender::SendNotif(
                false, // is_id = false (send to role IDs)
                [1, 2], // Admin and Staff role IDs (adjust based on your role system)
                $adminMessage,
                'Prescription Dispensed',
                'admin_dispense_activity'
            );

        } catch (\Exception $e) {
            // Log the error but don't fail the dispense process
            \Log::error('Failed to send dispense notifications: ' . $e->getMessage());
        }
    }

    /**
     * Generate dispense summary/report
     */
    private function generateDispenseSummary($prescription, $dispensedItems, $errors)
    {
        $patientInfo = $prescription->getPatientInfo();
        $doctor = $prescription->doctor;
        $pharmacist = Auth::user();
        
        $summary = [
            'transaction_id' => 'DISP-' . date('YmdHis') . '-' . $prescription->id,
            'timestamp' => now()->toDateTimeString(),
            'prescription' => [
                'id' => $prescription->id,
                'number' => 'RX-' . str_pad($prescription->id, 6, '0', STR_PAD_LEFT),
                'case_id' => $prescription->case_id,
                'status' => $prescription->status,
                'created_at' => $prescription->created_at->toDateTimeString(),
            ],
            'patient' => [
                'id' => $prescription->patient_id,
                'name' => $patientInfo['first_name'] . ' ' . $patientInfo['last_name'],
                'email' => 'N/A', // No email available from patient info
            ],
            'doctor' => [
                'id' => $doctor->id,
                'name' => $doctor->firstname . ' ' . $doctor->lastname,
                'email' => $doctor->email,
            ],
            'pharmacist' => [
                'id' => $pharmacist->id,
                'name' => $pharmacist->firstname . ' ' . $pharmacist->lastname,
                'email' => $pharmacist->email,
            ],
            'dispensed_items' => $dispensedItems,
            'summary' => [
                'total_items' => count($dispensedItems),
                'total_quantity' => collect($dispensedItems)->sum('quantity'),
                'has_errors' => !empty($errors),
                'errors' => $errors,
            ],
            'inventory_impact' => [
                'items_affected' => count($dispensedItems),
                'total_stock_reduced' => collect($dispensedItems)->sum('quantity'),
            ]
        ];

        // Log the dispense summary for audit trail
        \Log::info('Dispense Summary Generated', $summary);

        return $summary;
    }
}
