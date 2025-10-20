<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\inventory;
use App\Models\icategory;
use App\Models\istocks;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories first
        $categories = [
            ['name' => 'Medicines', 'description' => 'Prescription and over-the-counter medicines'],
            ['name' => 'Supplies', 'description' => 'Medical supplies and equipment'],
            ['name' => 'Vaccines', 'description' => 'Vaccines and immunizations'],
            ['name' => 'Equipment', 'description' => 'Medical equipment and devices'],
        ];

        foreach ($categories as $categoryData) {
            icategory::create($categoryData);
        }

        // Get category IDs
        $medicineCategory = icategory::where('name', 'Medicines')->first();
        $suppliesCategory = icategory::where('name', 'Supplies')->first();
        $vaccinesCategory = icategory::where('name', 'Vaccines')->first();
        $equipmentCategory = icategory::where('name', 'Equipment')->first();

        // Create sample inventory items
        $inventoryItems = [
            [
                'name' => 'Paracetamol 500mg',
                'manufacturer' => 'Generic Pharma',
                'description' => 'Pain reliever and fever reducer',
                'category_id' => $medicineCategory->id,
                'unit_type' => 'tablets',
                'storage_location' => 'Medicine Cabinet A',
                'batch_number' => 'PAR001',
                'expiry_date' => now()->addMonths(12)->format('Y-m-d'),
            ],
            [
                'name' => 'Ibuprofen 400mg',
                'manufacturer' => 'MedCorp',
                'description' => 'Anti-inflammatory pain reliever',
                'category_id' => $medicineCategory->id,
                'unit_type' => 'tablets',
                'storage_location' => 'Medicine Cabinet A',
                'batch_number' => 'IBU001',
                'expiry_date' => now()->addMonths(18)->format('Y-m-d'),
            ],
            [
                'name' => 'Amoxicillin 250mg',
                'manufacturer' => 'AntibioPharm',
                'description' => 'Antibiotic medication',
                'category_id' => $medicineCategory->id,
                'unit_type' => 'capsules',
                'storage_location' => 'Refrigerated Storage',
                'batch_number' => 'AMX001',
                'expiry_date' => now()->addMonths(24)->format('Y-m-d'),
            ],
            [
                'name' => 'Syringes 5ml',
                'manufacturer' => 'MedSupply Inc',
                'description' => 'Disposable medical syringes',
                'category_id' => $suppliesCategory->id,
                'unit_type' => 'pieces',
                'storage_location' => 'Supply Room B',
                'batch_number' => 'SYR001',
                'expiry_date' => now()->addYears(3)->format('Y-m-d'),
            ],
            [
                'name' => 'Gauze Pads 4x4',
                'manufacturer' => 'WoundCare Ltd',
                'description' => 'Sterile gauze pads for wound care',
                'category_id' => $suppliesCategory->id,
                'unit_type' => 'packets',
                'storage_location' => 'Supply Room A',
                'batch_number' => 'GAU001',
                'expiry_date' => now()->addYears(2)->format('Y-m-d'),
            ],
            [
                'name' => 'COVID-19 Vaccine',
                'manufacturer' => 'VaxCorp',
                'description' => 'mRNA vaccine for COVID-19',
                'category_id' => $vaccinesCategory->id,
                'unit_type' => 'vials',
                'storage_location' => 'Vaccine Refrigerator',
                'batch_number' => 'COV001',
                'expiry_date' => now()->addMonths(6)->format('Y-m-d'),
            ],
            [
                'name' => 'Blood Pressure Monitor',
                'manufacturer' => 'MedTech Solutions',
                'description' => 'Digital blood pressure monitoring device',
                'category_id' => $equipmentCategory->id,
                'unit_type' => 'units',
                'storage_location' => 'Equipment Room',
                'batch_number' => 'BPM001',
                'expiry_date' => now()->addYears(5)->format('Y-m-d'),
            ],
            [
                'name' => 'Thermometer Digital',
                'manufacturer' => 'TempTech',
                'description' => 'Digital thermometer for temperature measurement',
                'category_id' => $equipmentCategory->id,
                'unit_type' => 'units',
                'storage_location' => 'Equipment Room',
                'batch_number' => 'THM001',
                'expiry_date' => now()->addYears(3)->format('Y-m-d'),
            ],
        ];

        foreach ($inventoryItems as $itemData) {
            $inventory = inventory::create($itemData);

            // Create stock record for each inventory item
            istocks::create([
                'inventory_id' => $inventory->id,
                'stocks' => rand(50, 200), // Random stock between 50-200
                'stockname' => $inventory->name . ' Stock',
            ]);
        }

        // Create some expired items for testing
        $expiredItems = [
            [
                'name' => 'Expired Medicine A',
                'manufacturer' => 'Test Pharma',
                'description' => 'Expired test medicine',
                'category_id' => $medicineCategory->id,
                'unit_type' => 'tablets',
                'storage_location' => 'Expired Items',
                'batch_number' => 'EXP001',
                'expiry_date' => now()->subMonths(2)->format('Y-m-d'),
            ],
            [
                'name' => 'Expired Medicine B',
                'manufacturer' => 'Test Pharma',
                'description' => 'Another expired test medicine',
                'category_id' => $medicineCategory->id,
                'unit_type' => 'capsules',
                'storage_location' => 'Expired Items',
                'batch_number' => 'EXP002',
                'expiry_date' => now()->subMonths(1)->format('Y-m-d'),
            ],
        ];

        foreach ($expiredItems as $itemData) {
            $inventory = inventory::create($itemData);

            // Create stock record for expired items
            istocks::create([
                'inventory_id' => $inventory->id,
                'stocks' => rand(5, 15), // Low stock for expired items
                'stockname' => $inventory->name . ' Stock',
            ]);
        }

        // Create some low stock items
        $lowStockItems = [
            [
                'name' => 'Low Stock Medicine',
                'manufacturer' => 'LowStock Pharma',
                'description' => 'Medicine with low stock for testing',
                'category_id' => $medicineCategory->id,
                'unit_type' => 'tablets',
                'storage_location' => 'Medicine Cabinet B',
                'batch_number' => 'LOW001',
                'expiry_date' => now()->addMonths(6)->format('Y-m-d'),
            ],
        ];

        foreach ($lowStockItems as $itemData) {
            $inventory = inventory::create($itemData);

            // Create stock record with low stock
            istocks::create([
                'inventory_id' => $inventory->id,
                'stocks' => 5, // Low stock
                'stockname' => $inventory->name . ' Stock',
            ]);
        }
    }
}
