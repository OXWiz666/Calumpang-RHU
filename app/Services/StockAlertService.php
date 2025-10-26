<?php

namespace App\Services;

use App\Models\inventory;
use App\Models\istocks;
use Illuminate\Support\Facades\Log;

class StockAlertService
{
    /**
     * Check for low stock items and return alert data
     */
    public function checkLowStockItems()
    {
        $lowStockItems = [];
        
        try {
            // Get all inventory items with their current stock levels
            $inventoryItems = inventory::with(['istocks', 'icategory'])
                ->where('status', 1) // Only active items
                ->get();

            foreach ($inventoryItems as $item) {
                $currentStock = $this->getCurrentStock($item);
                $minimumStock = $item->minimum_stock ?? 0;
                $maximumStock = $item->maximum_stock ?? 0;
                
                // Check if item is in danger zone (below minimum)
                if ($currentStock <= $minimumStock && $minimumStock > 0) {
                    $alertLevel = $this->getAlertLevel($currentStock, $minimumStock, $maximumStock);
                    
                    $lowStockItems[] = [
                        'id' => $item->id,
                        'name' => $item->name,
                        'generic_name' => $item->generic_name,
                        'category' => $item->icategory?->name ?? 'General',
                        'current_stock' => $currentStock,
                        'minimum_stock' => $minimumStock,
                        'maximum_stock' => $maximumStock,
                        'unit' => $item->unit ?? 'units',
                        'alert_level' => $alertLevel,
                        'days_remaining' => $this->calculateDaysRemaining($currentStock, $item),
                        'last_updated' => $item->updated_at,
                        'category_priority' => $this->getCategoryPriority($item->icategory?->name),
                    ];
                }
            }
            
            // Sort by alert level and category priority
            usort($lowStockItems, function($a, $b) {
                // First by alert level (critical > warning > low)
                $alertOrder = ['critical' => 3, 'warning' => 2, 'low' => 1];
                $alertDiff = $alertOrder[$b['alert_level']] - $alertOrder[$a['alert_level']];
                if ($alertDiff !== 0) return $alertDiff;
                
                // Then by category priority
                return $b['category_priority'] - $a['category_priority'];
            });
            
        } catch (\Exception $e) {
            Log::error('Stock alert check failed: ' . $e->getMessage());
        }
        
        return $lowStockItems;
    }
    
    /**
     * Get current stock level for an item
     */
    private function getCurrentStock($item)
    {
        return $item->istocks->sum('stocks') ?? 0;
    }
    
    /**
     * Determine alert level based on stock levels
     */
    private function getAlertLevel($currentStock, $minimumStock, $maximumStock)
    {
        if ($currentStock <= 0) {
            return 'critical'; // Out of stock
        }
        
        $percentage = ($currentStock / $minimumStock) * 100;
        
        if ($percentage <= 25) {
            return 'critical'; // Less than 25% of minimum
        } elseif ($percentage <= 50) {
            return 'warning'; // 25-50% of minimum
        } else {
            return 'low'; // 50-100% of minimum
        }
    }
    
    /**
     * Calculate estimated days remaining based on usage
     */
    private function calculateDaysRemaining($currentStock, $item)
    {
        // This is a simplified calculation - in a real system, you'd track usage history
        $averageDailyUsage = 1; // Default assumption
        return $currentStock > 0 ? max(1, round($currentStock / $averageDailyUsage)) : 0;
    }
    
    /**
     * Get category priority for sorting
     */
    private function getCategoryPriority($categoryName)
    {
        $priorities = [
            'Emergency' => 10,
            'Critical Care' => 9,
            'Surgery' => 8,
            'Medicine' => 7,
            'Vaccine' => 6,
            'General' => 5,
        ];
        
        return $priorities[$categoryName] ?? 1;
    }
    
    /**
     * Get stock alert summary
     */
    public function getStockAlertSummary()
    {
        $lowStockItems = $this->checkLowStockItems();
        
        $summary = [
            'total_alerts' => count($lowStockItems),
            'critical_count' => count(array_filter($lowStockItems, fn($item) => $item['alert_level'] === 'critical')),
            'warning_count' => count(array_filter($lowStockItems, fn($item) => $item['alert_level'] === 'warning')),
            'low_count' => count(array_filter($lowStockItems, fn($item) => $item['alert_level'] === 'low')),
            'items' => $lowStockItems,
        ];
        
        return $summary;
    }
}
