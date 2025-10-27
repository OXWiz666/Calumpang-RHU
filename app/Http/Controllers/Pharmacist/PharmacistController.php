<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Events\InventoryUpdated;
use App\Models\icategory;
use App\Models\inventory;
use App\Models\istock_movements;
use App\Models\istocks;
use App\Models\Prescription;
use App\Models\PrescriptionMedicine;
use App\Services\NotifSender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
        
        // Get recent activities including dispense activities
        $recentActivities = istock_movements::with(['inventory', 'staff'])
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get()
            ->map(function($movement) {
                // Determine if this is a dispense activity
                $isDispense = $movement->type === 'Outgoing' && 
                    (str_contains($movement->reason, 'Dispense') || 
                     str_contains($movement->reason, 'Prescription') ||
                     !empty($movement->patient_name) ||
                     !empty($movement->prescription_number));
                
                return [
                    'id' => $movement->id,
                    'type' => $isDispense ? 'Dispense' : $movement->type,
                    'item' => $movement->inventory_name,
                    'quantity' => $movement->quantity,
                    'user' => $movement->staff ? $movement->staff->firstname . ' ' . $movement->staff->lastname : 'Unknown',
                    'timestamp' => 'Recently',
                    'icon' => $isDispense ? 'CheckCircle' : ($movement->type === 'Incoming' ? 'Package' : 'TrendingDown'),
                    'patient_name' => $movement->patient_name ?? null,
                    'prescription_number' => $movement->prescription_number ?? null,
                    'reason' => $movement->reason ?? null
                ];
            });

        // Calculate trend changes for stats (simplified without inventory trends)
        $trendChanges = [
            'totalItemsChange' => 0,
            'lowStockChange' => 0,
            'expiringSoonChange' => 0,
            'monthlyDispensedChange' => 0
        ];
        
        // Get inventory items for stock monitoring
        $inventoryItems = inventory::with(['category', 'stock'])
            ->whereHas('stock')
            ->get()
            ->map(function($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'stock' => $item->stock,
                    'minimum_stock' => $item->minimum_stock ?? 0,
                    'maximum_stock' => $item->maximum_stock ?? 0,
                    'category' => $item->category,
                    'expiry_date' => $item->expiry_date,
                    'batch_number' => $item->batch_number
                ];
            });

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
            'recentActivities' => $recentActivities,
            'inventoryItems' => $inventoryItems
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
     * Update pharmacist profile information
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . Auth::id(),
            'contactno' => 'required|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();
        $updateData = [
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'contactno' => $request->contactno,
        ];

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar && \Storage::disk('public')->exists($user->avatar)) {
                \Storage::disk('public')->delete($user->avatar);
            }
            
            // Store new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $updateData['avatar'] = $avatarPath;
        }

        $user->update($updateData);
        
        // Refresh user to get updated avatar_url
        $user->refresh();

        \Log::info('Pharmacist profile updated', [
            'user_id' => $user->id,
            'avatar_path' => $user->avatar,
            'avatar_url' => $user->avatar_url,
            'update_data' => $updateData
        ]);

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    /**
     * Update pharmacist password
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();
        $user->update([
            'password' => bcrypt($request->password),
        ]);

        return redirect()->back()->with('success', 'Password updated successfully!');
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
            'unit_type' => 'required|min:1',
            'quantity' => "required|min:0",
            'expiry_date' => "required|date|after_or_equal:today",
            'batch_number' => "required|string|min:1",
            'manufacturer' => "nullable|string",
            'description' => "nullable|string",
            'minimum_stock' => "nullable|integer|min:0",
            'maximum_stock' => "nullable|integer|min:0",
            'storage_location' => "nullable|string",
        ]);

        try {
            DB::beginTransaction();

            // Check if item with same name already exists
            $existingItem = inventory::where('name', $request->itemname)->first();
            
            if ($existingItem) {
                DB::rollBack();
                return back()->withErrors([
                    'itemname' => 'An item with this name already exists in the inventory.'
                ])->withInput();
            }

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

                // Get the quantity from request, default to 0 if not provided
                $quantity = $request->quantity ?? 0;

                // Create stock record for the new batch
                $stock = istocks::create([
                    'inventory_id' => $newInventory->id,
                    'stocks' => $quantity,
                    'stockname' => $request->unit_type ?? 'units',
                ]);

                $newInventory->update(['stock_id' => $stock->id]);

                // Create stock movement record for the new batch
                istock_movements::create([
                    'inventory_id' => $newInventory->id,
                    'staff_id' => Auth::user()->id,
                    'quantity' => $quantity,
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
            'expiry_date' => "required|date|after:today",
            'original_item_id' => "required|exists:inventory,id",
            'quantity' => "required|numeric|min:0.01",
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

            // Get the quantity from request, default to 0 if not provided
            $quantity = $request->quantity ?? 0;

            // Create stock record for the new batch
            $stock = istocks::create([
                'inventory_id' => $newInventory->id,
                'stocks' => $quantity,
                'stockname' => $request->unit_type ?? 'units',
            ]);

            $newInventory->update(['stock_id' => $stock->id]);

            // Create stock movement record for the new batch
            istock_movements::create([
                'inventory_id' => $newInventory->id,
                'staff_id' => Auth::user()->id,
                'quantity' => $quantity,
                'expiry_date' => $request->expiry_date,
                'inventory_name' => $request->itemname,
                'stock_id' => $stock->id,
                'batch_number' => $request->batch_number,
                'type' => 'Incoming',
                'reason' => 'New batch added',
            ]);

            DB::commit();
            event(new InventoryUpdated('item.add', ['id' => $newInventory->id]));

            // Check if it's an Inertia request (AJAX with Inertia header)
            if ($request->header('X-Inertia') || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => "New batch '{$request->batch_number}' added successfully!",
                    'data' => $newInventory
                ]);
            }

            return back()->with([
                'flash' => [
                    'title' => 'Success!',
                    'message' => "New batch '{$request->batch_number}' added successfully!",
                    'icon' => "success"
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Add batch error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            if ($request->header('X-Inertia') || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => "Error: " . $e->getMessage()
                ], 500);
            }
            
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
            'item_id' => 'nullable|exists:inventory,id',
            'batches' => 'required|array|min:1',
            'batches.*.batch_number' => 'required|string',
            'batches.*.quantity' => 'required|integer|min:1',
            'batches.*.item_id' => 'required|exists:inventory,id',
            'disposal_reason' => 'required|string',
            'disposal_method' => 'required|string',
            'disposal_date' => 'required|date',
            'disposed_by' => 'required|string',
            'notes' => 'nullable|string',
            'disposal_cost' => 'nullable|numeric|min:0'
        ]);

        try {
            DB::beginTransaction();

            // Get the main inventory item (first batch's item)
            $mainInventory = inventory::findOrFail($request->batches[0]['item_id']);

            // Process each batch disposal individually
            foreach ($request->batches as $batch) {
                // Find the specific inventory record for this batch using item_id
                $batchInventory = inventory::findOrFail($batch['item_id']);
                
                if (!$batchInventory) {
                    throw new \Exception("Batch {$batch['batch_number']} not found for item ID {$batch['item_id']}");
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
            \Log::error('Bulk disposal failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request_data' => $request->all(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'error' => 'Failed to bulk dispose: ' . $e->getMessage(),
                'details' => 'Please check your inputs and try again. If the problem persists, contact support.'
            ]);
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
                        'id' => $item->id,
                        'batch_id' => $item->id,
                        'batch_number' => $item->batch_number,
                        'expiry_date' => $item->expiry_date,
                        'available_quantity' => optional($item->stock)->stocks ?? 0,
                        'storage_location' => $item->storage_location,
                        'location' => $item->storage_location, // Keep for backward compatibility
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
            // Get unique case IDs from prescriptions that are not null and not empty and are pending
            $caseIds = \App\Models\Prescription::whereNotNull('case_id')
                ->where('case_id', '!=', '')
                ->where('status', 'pending')
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
                'license_number' => $doctor->license_number ?? 'N/A',
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

    /**
     * Handle bulk dispense of multiple items
     */
    public function bulk_dispense(Request $request)
    {
        \Log::info('Bulk dispense request received', [
            'user_id' => Auth::id(),
            'request_data' => $request->all(),
            'request_method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'user_agent' => $request->header('User-Agent')
        ]);
        
        // Determine dispense mode based on data provided
        $isPrescriptionMode = $request->has('prescription_id') && $request->prescription_id;
        
        \Log::info('Dispense mode detection', [
            'has_prescription_id' => $request->has('prescription_id'),
            'prescription_id_value' => $request->prescription_id,
            'is_prescription_mode' => $isPrescriptionMode,
            'all_request_keys' => array_keys($request->all())
        ]);
        
        
        try {
            if ($isPrescriptionMode) {
                // Prescription mode validation
                $request->validate([
                    'items' => 'required|array|min:1',
                    'items.*.item_id' => 'required|exists:inventory,id',
                    'items.*.quantity' => 'required|integer|min:1',
                    'patient_name' => 'required|string|max:255',
                    'case_id' => 'required|string|max:255',
                    'doctor_name' => 'nullable|string|max:255',
                    'dispense_date' => 'required|date',
                    'prescription_id' => 'required|integer',
                    'patient_id' => 'required|string|max:255',
                    'doctor_id' => 'nullable|integer',
                ]);
                
                \Log::info('Prescription mode validation passed', [
                    'patient_name' => $request->patient_name,
                    'case_id' => $request->case_id,
                    'prescription_id' => $request->prescription_id,
                    'patient_id' => $request->patient_id,
                    'doctor_id' => $request->doctor_id,
                    'items_count' => count($request->items)
                ]);
            } else {
                // Manual mode validation
                $request->validate([
                    'items' => 'required|array|min:1',
                    'items.*.item_id' => 'required|exists:inventory,id',
                    'items.*.quantity' => 'required|integer|min:1',
                    'reason_for_dispensing' => 'required|string|max:500',
                    'dispense_date' => 'required|date',
                ]);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Bulk dispense validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            
            return back()->withErrors($e->errors());
        }

        DB::beginTransaction();
        try {
            $dispensedItems = [];
            $errors = [];

            foreach ($request->items as $itemData) {
                \Log::info('Processing item', [
                    'item_id' => $itemData['item_id'],
                    'quantity' => $itemData['quantity'],
                    'item_data' => $itemData
                ]);
                
                $inventory = inventory::find($itemData['item_id']);
                if (!$inventory) {
                    $errors[] = "Item with ID {$itemData['item_id']} not found";
                    \Log::error('Inventory item not found', [
                        'item_id' => $itemData['item_id'],
                        'available_items' => inventory::pluck('id')->toArray()
                    ]);
                    continue;
                }
                
                \Log::info('Inventory item found', [
                    'inventory_id' => $inventory->id,
                    'inventory_name' => $inventory->name,
                    'has_stock' => !!$inventory->stock,
                    'current_stock' => $inventory->stock ? $inventory->stock->stocks : 0
                ]);

                $currentStock = $inventory->stock ? $inventory->stock->stocks : 0;
                $requestedQuantity = $itemData['quantity'];

                if ($currentStock < $requestedQuantity) {
                    $errors[] = "Insufficient stock for {$inventory->name}. Available: {$currentStock}, Requested: {$requestedQuantity}";
                    continue;
                }

                // Prescription mode validation: Check if available stock meets prescription requirement
                if ($isPrescriptionMode && $request->prescription_id) {
                    $prescription = \App\Models\Prescription::find($request->prescription_id);
                    if ($prescription) {
                        $prescriptionMedicine = $prescription->medicines()
                            ->where('medicine_id', $itemData['item_id'])
                            ->first();
                        
                        if ($prescriptionMedicine) {
                            $prescriptionQuantity = $prescriptionMedicine->quantity;
                            if ($currentStock < $prescriptionQuantity) {
                                $errors[] = "Insufficient stock for prescription requirement: {$inventory->name}. Required: {$prescriptionQuantity}, Available: {$currentStock}";
                                continue;
                            }
                        }
                    }
                }

                // Update stock
                $newStock = $currentStock - $requestedQuantity;
                \Log::info('Updating stock', [
                    'inventory_id' => $inventory->id,
                    'current_stock' => $currentStock,
                    'requested_quantity' => $requestedQuantity,
                    'new_stock' => $newStock,
                    'stock_exists' => !!$inventory->stock
                ]);
                
                if (!$inventory->stock) {
                    $errors[] = "No stock record found for {$inventory->name}";
                    continue;
                }
                
                $inventory->stock->update(['stocks' => $newStock]);

                // Create stock movement record
                $notes = "Bulk dispense";
                if ($isPrescriptionMode) {
                    // Prescription mode
                    $notes .= " to {$request->patient_name} (Case: {$request->case_id})";
                } else {
                    // Manual mode
                    $notes .= " - Reason: {$request->reason_for_dispensing}";
                }
                
                try {
                    // Create stock movement record
                    $movementData = [
                        'inventory_id' => $inventory->id,
                        'type' => 'Outgoing',
                        'quantity' => $requestedQuantity,
                        'reason' => 'Bulk Dispense',
                        'notes' => $notes,
                        'staff_id' => Auth::id(),
                        'inventory_name' => $inventory->name,
                        'stock_id' => $inventory->stock ? $inventory->stock->id : null,
                        'batch_number' => $itemData['batch_number'] ?? 'N/A',
                    ];
                    
                    // Add prescription-specific fields for prescription mode
                    if ($isPrescriptionMode) {
                        $movementData['patient_name'] = $request->patient_name;
                        $movementData['prescription_number'] = $request->case_id;
                        $movementData['dispensed_by'] = Auth::user()->firstname . ' ' . Auth::user()->lastname;
                    } else {
                        $movementData['patient_name'] = $request->reason_for_dispensing;
                        $movementData['prescription_number'] = null;
                        $movementData['dispensed_by'] = Auth::user()->firstname . ' ' . Auth::user()->lastname;
                    }
                    
                    \Log::info('Creating stock movement', [
                        'movement_data' => $movementData,
                        'inventory_id' => $inventory->id
                    ]);
                    
                    istock_movements::create($movementData);
                    
                    \Log::info('Stock movement created successfully', [
                        'inventory_id' => $inventory->id,
                        'quantity' => $requestedQuantity
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Failed to create stock movement', [
                        'inventory_id' => $inventory->id,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                        'movement_data' => $movementData ?? 'No data'
                    ]);
                    $errors[] = "Failed to create stock movement for {$inventory->name}: " . $e->getMessage();
                    continue;
                }

                $dispensedItems[] = [
                    'item_id' => $inventory->id,
                    'name' => $inventory->name,
                    'quantity' => $requestedQuantity,
                    'batch_number' => $itemData['batch_number'] ?? 'N/A',
                    'expiry_date' => $itemData['expiry_date'] ?? null,
                ];
            }

            if (empty($dispensedItems)) {
                DB::rollBack();
                \Log::error('No items were dispensed', [
                    'errors' => $errors,
                    'request_items' => $request->items
                ]);
                return back()->withErrors(['error' => 'No items were dispensed. ' . implode(' ', $errors)]);
            }

            // If prescription mode, mark the prescription as dispensed
            if ($isPrescriptionMode && $request->prescription_id) {
                $prescription = \App\Models\Prescription::find($request->prescription_id);
                if ($prescription && $prescription->status === 'pending') {
                    $prescription->markAsDispensed(Auth::id());
                    \Log::info('Prescription marked as dispensed', [
                        'prescription_id' => $prescription->id,
                        'status' => $prescription->status,
                        'dispensed_by' => Auth::id()
                    ]);
                }
            }

            // Fire inventory updated event
            event(new InventoryUpdated('bulk_dispense', [
                'dispensed_items' => $dispensedItems,
                'total_quantity' => array_sum(array_column($dispensedItems, 'quantity')),
                'mode' => $isPrescriptionMode ? 'prescription' : 'manual'
            ]));

            DB::commit();

            return back()->with('success', 'Bulk dispense completed successfully! ' . count($dispensedItems) . ' items dispensed.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Bulk dispense failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request_data' => $request->all(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'error' => 'Failed to complete bulk dispense: ' . $e->getMessage(),
                'details' => 'Please check your inputs and try again. If the problem persists, contact support.'
            ]);
        }
    }

    /**
     * Handle bulk update of multiple items
     */
    public function bulk_update(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:inventory,id',
            'items.*.current_quantity' => 'required|integer|min:0',
            'items.*.new_quantity' => 'required|integer|min:0',
            'items.*.update_type' => 'required|in:add,subtract',
            'items.*.update_amount' => 'required|integer|min:0',
            'items.*.is_batch_update' => 'nullable|boolean',
            'items.*.batch_id' => 'nullable|integer',
            'items.*.batch_number' => 'nullable|string',
            'update_type' => 'required|in:add,subtract',
            'update_amount' => 'required|integer|min:0',
            'update_date' => 'required|date',
            'minimum_stock' => 'required|integer|min:0',
            'maximum_stock' => 'required|integer|min:0',
            'supplier' => 'required|string|max:255',
            'reason' => 'nullable|string|max:500',
        ]);

        \Log::info('Bulk update request received', [
            'items_count' => count($request->items),
            'update_type' => $request->update_type,
            'update_amount' => $request->update_amount,
            'minimum_stock' => $request->minimum_stock,
            'maximum_stock' => $request->maximum_stock,
            'supplier' => $request->supplier,
            'user_id' => Auth::id(),
            'request_data' => $request->all()
        ]);

        DB::beginTransaction();
        try {
            $updatedItems = [];
            $errors = [];

            \Log::info('Starting bulk update', [
                'items_count' => count($request->items),
                'items' => $request->items,
                'user_id' => Auth::id()
            ]);

            foreach ($request->items as $itemData) {
                \Log::info('Processing item for bulk update', [
                    'item_id' => $itemData['item_id'],
                    'current_quantity' => $itemData['current_quantity'],
                    'new_quantity' => $itemData['new_quantity'],
                    'update_type' => $itemData['update_type'],
                    'is_batch_update' => $itemData['is_batch_update'] ?? false,
                    'batch_id' => $itemData['batch_id'] ?? null,
                    'batch_number' => $itemData['batch_number'] ?? null
                ]);

                $inventory = inventory::find($itemData['item_id']);
                if (!$inventory) {
                    $error = "Item with ID {$itemData['item_id']} not found";
                    $errors[] = $error;
                    \Log::error('Item not found in bulk update', [
                        'item_id' => $itemData['item_id'],
                        'available_items' => inventory::pluck('id')->toArray()
                    ]);
                    continue;
                }

                $currentStock = $inventory->stock ? $inventory->stock->stocks : 0;
                $newQuantity = $itemData['new_quantity'];

                \Log::info('Item found, checking stock', [
                    'inventory_id' => $inventory->id,
                    'inventory_name' => $inventory->name,
                    'has_stock' => !!$inventory->stock,
                    'current_stock' => $currentStock,
                    'new_quantity' => $newQuantity,
                    'is_batch_update' => $itemData['is_batch_update'] ?? false
                ]);

                // Handle batch-specific updates
                if ($itemData['is_batch_update'] ?? false) {
                    // For batch updates, we need to find the specific batch using batch_id
                    $batchInventory = null;
                    
                    if (isset($itemData['batch_id'])) {
                        // Use batch_id if provided
                        $batchInventory = inventory::find($itemData['batch_id']);
                    } else if (isset($itemData['batch_number'])) {
                        // Find batch by batch_number and name (since batches are separate inventory records with same name)
                        $batchInventory = inventory::where('batch_number', $itemData['batch_number'])
                            ->where('name', $inventory->name)
                            ->first();
                    }
                    
                    if (!$batchInventory) {
                        $error = "Batch {$itemData['batch_number']} not found for item {$inventory->name}";
                        $errors[] = $error;
                        \Log::error('Batch not found in bulk update', [
                            'item_id' => $itemData['item_id'],
                            'batch_id' => $itemData['batch_id'] ?? 'not provided',
                            'batch_number' => $itemData['batch_number'] ?? 'not provided',
                            'inventory_name' => $inventory->name,
                            'available_batches' => inventory::where('name', $inventory->name)->pluck('batch_number', 'id')
                        ]);
                        continue;
                    }

                    // Ensure batch has stock record
                    if (!$batchInventory->stock) {
                        \Log::info('Creating stock record for batch', [
                            'batch_id' => $batchInventory->id,
                            'batch_number' => $batchInventory->batch_number
                        ]);
                        $stock = istocks::create([
                            'stocks' => 0,
                            'stockname' => $batchInventory->unit_type ?? 'units',
                            'inventory_id' => $batchInventory->id,
                        ]);
                        $batchInventory->update(['stock_id' => $stock->id]);
                        $batchInventory->refresh();
                    }

                    // Update batch stock
                    \Log::info('Updating stock for batch', [
                        'batch_id' => $batchInventory->id,
                        'batch_number' => $batchInventory->batch_number,
                        'old_stock' => $batchInventory->stock->stocks,
                        'new_stock' => $newQuantity
                    ]);
                    $batchInventory->stock->update(['stocks' => $newQuantity]);
                    
                    // Update batch inventory fields
                    $batchInventory->update([
                        'minimum_stock' => $request->minimum_stock,
                        'maximum_stock' => $request->maximum_stock,
                        'supplier' => $request->supplier,
                    ]);
                } else {
                    // Handle item-level updates (overall stock)
                    // Ensure stock record exists
                    if (!$inventory->stock) {
                        \Log::info('Creating stock record for item', [
                            'inventory_id' => $inventory->id,
                            'inventory_name' => $inventory->name
                        ]);
                        $stock = istocks::create([
                            'stocks' => 0,
                            'stockname' => $inventory->unit_type ?? 'units',
                            'inventory_id' => $inventory->id,
                        ]);
                        $inventory->update(['stock_id' => $stock->id]);
                        $inventory->refresh();
                    }

                    // Update stock
                    \Log::info('Updating stock for item', [
                        'inventory_id' => $inventory->id,
                        'old_stock' => $currentStock,
                        'new_stock' => $newQuantity
                    ]);
                    $inventory->stock->update(['stocks' => $newQuantity]);
                }

                // Update additional fields (now required) - only for item-level updates
                if (!($itemData['is_batch_update'] ?? false)) {
                    $inventory->update([
                        'minimum_stock' => $request->minimum_stock,
                        'maximum_stock' => $request->maximum_stock,
                        'supplier' => $request->supplier,
                    ]);
                }

                // Create stock movement record
                $movementType = $newQuantity > $currentStock ? 'Incoming' : 'Outgoing';
                $quantityChange = abs($newQuantity - $currentStock);
                
                if ($quantityChange > 0) {
                    $notes = "Bulk update: {$itemData['update_type']} {$itemData['update_amount']} units";
                    if ($request->reason) {
                        $notes .= " - Reason: {$request->reason}";
                    }
                    
                    // For batch updates, include batch number in the movement
                    $movementData = [
                        'inventory_id' => $inventory->id,
                        'type' => $movementType,
                        'quantity' => $quantityChange,
                        'reason' => 'Bulk Update - ' . ucfirst($itemData['update_type']),
                        'notes' => $notes,
                        'staff_id' => Auth::id(),
                        'inventory_name' => $inventory->name,
                        'stock_id' => $inventory->stock ? $inventory->stock->id : null,
                        'created_at' => now(),
                    ];
                    
                    // Add batch number for batch-specific updates
                    if ($itemData['is_batch_update'] ?? false) {
                        $movementData['batch_number'] = $itemData['batch_number'];
                        $movementData['notes'] .= " (Batch: {$itemData['batch_number']})";
                    }
                    
                    istock_movements::create($movementData);
                }

                $updatedItem = [
                    'item_id' => $inventory->id,
                    'name' => $inventory->name,
                    'old_quantity' => $currentStock,
                    'new_quantity' => $newQuantity,
                    'change' => $newQuantity - $currentStock,
                    'update_type' => $itemData['update_type'],
                ];
                
                // Add batch information for batch-specific updates
                if ($itemData['is_batch_update'] ?? false) {
                    $updatedItem['batch_number'] = $itemData['batch_number'];
                    $updatedItem['batch_id'] = $itemData['batch_id'];
                    $updatedItem['is_batch_update'] = true;
                }
                
                $updatedItems[] = $updatedItem;
            }

            if (empty($updatedItems)) {
                DB::rollBack();
                \Log::error('No items were updated in bulk update', [
                    'errors' => $errors,
                    'items_count' => count($request->items)
                ]);
                return back()->withErrors(['error' => 'No items were updated. ' . implode(' ', $errors)]);
            }

            \Log::info('Bulk update completed successfully', [
                'updated_items_count' => count($updatedItems),
                'updated_items' => $updatedItems,
                'errors' => $errors
            ]);

            // Fire inventory updated event
            event(new InventoryUpdated('bulk_update', [
                'updated_items' => $updatedItems,
                'total_items' => count($updatedItems)
            ]));

            DB::commit();

            return back()->with('success', 'Bulk update completed successfully! ' . count($updatedItems) . ' items updated.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Bulk update failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request_data' => $request->all(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'error' => 'Failed to complete bulk update: ' . $e->getMessage(),
                'details' => 'Please check your inputs and try again. If the problem persists, contact support.'
            ]);
        }
    }

    public function getPrescriptionByCaseId($caseId)
    {
        try {
            \Log::info('Fetching prescription by CASE ID', ['case_id' => $caseId]);

            // Find prescription by case_id
            $prescription = Prescription::where('case_id', $caseId)->first();

            if (!$prescription) {
                \Log::warning('No prescription found for CASE ID', ['case_id' => $caseId]);
                return response()->json(['error' => 'No prescription found for this CASE ID'], 404);
            }

            // Get prescription medicines
            $prescriptionMedicines = \App\Models\PrescriptionMedicine::where('prescription_id', $prescription->id)
                ->get();

            // Get doctor name
            $doctorName = 'Unknown Doctor';
            if ($prescription->doctor_id) {
                $doctor = \App\Models\User::find($prescription->doctor_id);
                if ($doctor) {
                    $doctorName = $doctor->firstname . ' ' . $doctor->lastname;
                }
            }

            // Format the response
            $formattedPrescription = [
                'id' => $prescription->id,
                'case_id' => $prescription->case_id,
                'patient_name' => $prescription->patient_name,
                'patient_id' => $prescription->patient_id,
                'doctor_id' => $prescription->doctor_id,
                'doctor_name' => $doctorName,
                'status' => $prescription->status,
                'created_at' => $prescription->created_at,
                'medicines' => $prescriptionMedicines->map(function ($prescriptionMedicine) {
                    // Get inventory item information since medicine_id points to inventory table
                    $inventoryItem = \App\Models\inventory::find($prescriptionMedicine->medicine_id);
                    
                    return [
                        'medicine_id' => $prescriptionMedicine->medicine_id,
                        'medicine_name' => $inventoryItem ? $inventoryItem->name : 'Unknown Medicine',
                        'batch_number' => $prescriptionMedicine->batch_number,
                        'quantity' => $prescriptionMedicine->quantity,
                        'frequency' => $prescriptionMedicine->frequency,
                        'duration' => $prescriptionMedicine->duration,
                        'instructions' => $prescriptionMedicine->instructions,
                    ];
                })
            ];

            \Log::info('Successfully fetched prescription by CASE ID', [
                'case_id' => $caseId,
                'prescription_id' => $prescription->id,
                'medicines_count' => count($formattedPrescription['medicines'])
            ]);

            return response()->json($formattedPrescription);

        } catch (\Exception $e) {
            \Log::error('Error fetching prescription by CASE ID: ' . $e->getMessage(), [
                'case_id' => $caseId,
                'error' => $e->getMessage()
            ]);
            return response()->json(['error' => 'Failed to fetch prescription'], 500);
        }
    }

    /**
     * Get all available Case IDs for dropdown
     */
    public function getAvailableCaseIds()
    {
        try {
            \Log::info('Fetching available Case IDs');

            // Get all unique case IDs from prescriptions that are pending
            $caseIds = Prescription::whereNotNull('case_id')
                ->where('case_id', '!=', '')
                ->where('status', 'pending')
                ->select('case_id', 'id', 'patient_name', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($prescription) {
                    return [
                        'case_id' => $prescription->case_id,
                        'prescription_id' => $prescription->id,
                        'patient_name' => $prescription->patient_name,
                        'created_at' => $prescription->created_at->format('Y-m-d H:i:s'),
                        'display_text' => $prescription->case_id . ' - ' . $prescription->patient_name
                    ];
                });

            \Log::info('Successfully fetched Case IDs', [
                'count' => $caseIds->count()
            ]);

            return response()->json($caseIds);

        } catch (\Exception $e) {
            \Log::error('Error fetching available Case IDs: ' . $e->getMessage(), [
                'error' => $e->getMessage()
            ]);
            return response()->json(['error' => 'Failed to fetch Case IDs'], 500);
        }
    }
}
