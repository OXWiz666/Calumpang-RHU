<?php

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\inventory;
use App\Models\icategory;
use App\Models\istock_movements;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Jimmyjs\ReportGenerator\ReportMedia\CSVReport;

class InventoryReportsController extends Controller
{
    /**
     * Show the reports page
     */
    public function index(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());
        
        // Convert to Carbon instances if they're strings
        if (is_string($startDate)) {
            $startDate = Carbon::parse($startDate);
        }
        if (is_string($endDate)) {
            $endDate = Carbon::parse($endDate);
        }

        // Get categories for filtering
        $categories = icategory::all();

        // Get analytics
        $analytics = $this->getPharmacistAnalytics($startDate, $endDate);

        // Get actual inventory data for the reports
        $inventoryItems = $this->getInventoryData($startDate, $endDate);
        $expiredBatches = $this->getExpiredBatchesData($startDate, $endDate, []);
        $expiringSoonBatches = $this->getExpiringSoonBatchesData($startDate, $endDate);
        $dispensingData = $this->getDispensingData($startDate, $endDate);
        $dispensingSummary = $this->getDispensingSummary($startDate, $endDate);
        $topDispensedItems = $this->getTopDispensedItems($startDate, $endDate);

        return Inertia::render("Authenticated/Pharmacist/Reports", [
            'dateRange' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'analytics' => $analytics,
            'categories' => $categories,
            'inventoryItems' => $inventoryItems,
            'expiredBatches' => $expiredBatches,
            'expiringSoonBatches' => $expiringSoonBatches,
            'expiredBatchesCount' => count($expiredBatches),
            'expiringSoonBatchesCount' => count($expiringSoonBatches),
            'dispensingData' => $dispensingData,
            'dispensingSummary' => $dispensingSummary,
            'topDispensedItems' => $topDispensedItems,
        ]);
    }

    /**
     * Get dashboard analytics for AJAX loading
     */
    public function dashboardAnalytics(Request $request)
    {
        try {
            $startDate = $request->input('start_date', now()->startOfMonth());
            $endDate = $request->input('end_date', now()->endOfMonth());
            
            // Get the pharmacist analytics which includes the report data
            $pharmacistAnalytics = $this->getPharmacistAnalytics($startDate, $endDate);
            $inventoryItems = $this->getInventoryData($startDate, $endDate);
            $expiredBatches = $this->getExpiredBatchesData($startDate, $endDate, []);
            $expiringSoonBatches = $this->getExpiringSoonBatchesData($startDate, $endDate);
            $dispensingData = $this->getDispensingData($startDate, $endDate);
            $dispensingSummary = $this->getDispensingSummary($startDate, $endDate);
            $topDispensedItems = $this->getTopDispensedItems($startDate, $endDate);

            // Debug logging
            \Log::info('Dashboard Analytics Response:', [
                'analytics' => $pharmacistAnalytics['analytics'],
                'inventoryItems_count' => count($inventoryItems),
                'expiredBatches_count' => count($expiredBatches),
                'expiringSoonBatches_count' => count($expiringSoonBatches)
            ]);

        return response()->json([
                'success' => true,
                'analytics' => $pharmacistAnalytics['analytics'],
                'inventoryItems' => $inventoryItems,
                'expiredBatches' => $expiredBatches,
                'expiringSoonBatches' => $expiringSoonBatches,
                'expiredBatchesCount' => count($expiredBatches),
                'expiringSoonBatchesCount' => count($expiringSoonBatches),
                'dispensingData' => $dispensingData,
                'dispensingSummary' => $dispensingSummary,
                'topDispensedItems' => $topDispensedItems,
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard Analytics Error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'error' => 'Failed to load analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate inventory summary report (GET endpoint for easy frontend integration)
     */
    public function summary(Request $request)
    {
        $format = $request->get('format', 'json');
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());
        
        // Convert to Carbon instances if they're strings
        if (is_string($startDate)) {
            $startDate = Carbon::parse($startDate);
        }
        if (is_string($endDate)) {
            $endDate = Carbon::parse($endDate);
        }

        $filters = [
            'category_id' => $request->get('category_id'),
            'status' => $request->get('status'),
            'priority' => $request->get('priority'),
            'sort_by' => $request->get('sort_by', 'name'),
            'sort_order' => $request->get('sort_order', 'asc'),
            'limit' => $request->get('limit', 100)
        ];

        $reportData = $this->getInventorySummaryData($startDate, $endDate, $filters);

        if ($format === 'pdf') {
            return $this->generatePDFReport($reportData, 'inventory_summary', $startDate, $endDate);
        } elseif ($format === 'excel') {
            return $this->generateExcelReport($reportData, 'inventory_summary', $startDate, $endDate);
        } elseif ($format === 'csv') {
            return $this->generateCSVReport($reportData, 'inventory_summary', $startDate, $endDate);
        } else {
            $analytics = $this->getPharmacistAnalytics($startDate, $endDate)['analytics'];
        return response()->json([
                'success' => true,
                'data' => $reportData,
                'items' => $reportData, // Add items for frontend compatibility
            'analytics' => $analytics,
                'summary' => [
                    'total_items' => $analytics['total_items'] ?? 0,
                    'in_stock' => $analytics['in_stock'] ?? 0,
                    'low_stock_items' => $analytics['low_stock_items'] ?? 0,
                    'out_of_stock' => $analytics['out_of_stock'] ?? 0,
                    'expired_items' => $analytics['expired_items'] ?? 0,
                    'expiring_soon' => $analytics['expiring_soon'] ?? 0,
                    'critical_alerts' => $analytics['critical_alerts'] ?? 0,
                ],
                'generated_at' => now()->format('Y-m-d H:i:s'),
                'date_range' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d')
            ]
        ]);
    }
    }

    /**
     * Generate expiry report (GET endpoint)
     */
    public function expiry(Request $request)
    {
        $format = $request->get('format', 'json');
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());
        
        if (is_string($startDate)) {
            $startDate = Carbon::parse($startDate);
        }
        if (is_string($endDate)) {
            $endDate = Carbon::parse($endDate);
        }

        $filters = [
            'category_id' => $request->get('category_id'),
            'days_ahead' => $request->get('days_ahead', 30),
            'include_expired' => $request->get('include_expired', false)
        ];

        $reportData = $this->getStockMovementData($startDate, $endDate, $filters);
        
        \Log::info('Expiry/Stock Movements Report', [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'data_count' => count($reportData),
            'sample_data' => isset($reportData[0]) ? $reportData[0] : 'no data'
        ]);

        if ($format === 'pdf') {
            return $this->generatePDFReport($reportData, 'stock_movements', $startDate, $endDate);
        } elseif ($format === 'excel') {
            return $this->generateExcelReport($reportData, 'stock_movements', $startDate, $endDate);
        } elseif ($format === 'csv') {
            return $this->generateCSVReport($reportData, 'stock_movements', $startDate, $endDate);
        } else {
            return response()->json([
                'success' => true,
                'data' => $reportData,
                'items' => $reportData // Add items for frontend compatibility
            ]);
        }
    }

    /**
     * Generate dispensing report (GET endpoint)
     */
    public function dispensing(Request $request)
    {
        $format = $request->get('format', 'json');
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfDay()); // Include today's date
        
        if (is_string($startDate)) {
            $startDate = Carbon::parse($startDate)->startOfDay();
        }
        if (is_string($endDate)) {
            $endDate = Carbon::parse($endDate)->endOfDay();
        }

        $filters = [
            'category_id' => $request->get('category_id'),
            'status' => $request->get('status')
        ];

        $reportData = $this->getDispensingReportData($startDate, $endDate, $filters);
        
        \Log::info('Dispensing Report', [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'data_count' => count($reportData),
            'sample_data' => isset($reportData[0]) ? $reportData[0] : 'no data'
        ]);

        if ($format === 'pdf') {
            return $this->generatePDFReport($reportData, 'dispensing_report', $startDate, $endDate);
        } elseif ($format === 'excel') {
            return $this->generateExcelReport($reportData, 'dispensing_report', $startDate, $endDate);
        } elseif ($format === 'csv') {
            return $this->generateCSVReport($reportData, 'dispensing_report', $startDate, $endDate);
        } else {
            return response()->json([
                'success' => true,
                'data' => $reportData,
                'items' => $reportData // Add items for frontend compatibility
            ]);
        }
    }

    /**
     * Generate low stock alert report (GET endpoint)
     */
    public function lowStockAlert(Request $request)
    {
        $format = $request->get('format', 'json');
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());
        
        if (is_string($startDate)) {
            $startDate = Carbon::parse($startDate);
        }
        if (is_string($endDate)) {
            $endDate = Carbon::parse($endDate);
        }

        $filters = [
            'category_id' => $request->get('category_id'),
            'threshold' => $request->get('threshold', 10)
        ];

        $reportData = $this->getDisposalReportData($startDate, $endDate, $filters);
        
        \Log::info('Disposal Report', [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'data_count' => count($reportData),
            'sample_data' => isset($reportData[0]) ? $reportData[0] : 'no data'
        ]);

        if ($format === 'pdf') {
            return $this->generatePDFReport($reportData, 'disposal_report', $startDate, $endDate);
        } elseif ($format === 'excel') {
            return $this->generateExcelReport($reportData, 'disposal_report', $startDate, $endDate);
        } elseif ($format === 'csv') {
            return $this->generateCSVReport($reportData, 'disposal_report', $startDate, $endDate);
        } else {
            return response()->json([
                'success' => true,
                'data' => $reportData,
                'items' => $reportData // Add items for frontend compatibility
            ]);
        }
    }

    /**
     * Generate expired batches report (GET endpoint)
     */
    public function expiredBatches(Request $request)
    {
        $format = $request->get('format', 'json');
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());
        
        if (is_string($startDate)) {
            $startDate = Carbon::parse($startDate);
        }
        if (is_string($endDate)) {
            $endDate = Carbon::parse($endDate);
        }

        $filters = [
            'category_id' => $request->get('category_id')
        ];

        $reportData = $this->getExpiredBatchesData($startDate, $endDate, $filters);
        
        \Log::info('Expired Batches Report', [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'data_count' => count($reportData),
            'sample_data' => isset($reportData[0]) ? $reportData[0] : 'no data'
        ]);

        if ($format === 'pdf') {
            return $this->generatePDFReport($reportData, 'expired_batches', $startDate, $endDate);
        } elseif ($format === 'excel') {
            return $this->generateExcelReport($reportData, 'expired_batches', $startDate, $endDate);
        } elseif ($format === 'csv') {
            return $this->generateCSVReport($reportData, 'expired_batches', $startDate, $endDate);
        } else {
            return response()->json([
                'success' => true,
                'data' => $reportData,
                'items' => $reportData // Add items for frontend compatibility
            ]);
        }
    }

    /**
     * Generate any report (PDF, Excel, CSV) - POST endpoint
     */
    public function generateReport(Request $request)
    {
        $request->validate([
            'report_type' => 'required|in:pdf,excel,csv',
            'report_category' => 'required|string',
            'date_range' => 'required|array',
            'date_range.start' => 'required|date',
            'date_range.end' => 'required|date|after_or_equal:date_range.start',
            'filters' => 'nullable|array',
            'custom_fields' => 'nullable|array'
        ]);

        $startDate = Carbon::parse($request->date_range['start']);
        $endDate = Carbon::parse($request->date_range['end']);
        $reportType = $request->report_type;
        $reportCategory = $request->report_category;
        $filters = $request->filters ?? [];
        $customFields = $request->custom_fields ?? [];

        try {
            // Get data based on report category
            $reportData = $this->getReportData($reportCategory, $startDate, $endDate, $filters, $customFields);
            
            if ($reportType === 'pdf') {
                return $this->generatePDFReport($reportData, $reportCategory, $startDate, $endDate);
            } elseif ($reportType === 'excel') {
                return $this->generateExcelReport($reportData, $reportCategory, $startDate, $endDate);
            } else {
                return $this->generateCSVReport($reportData, $reportCategory, $startDate, $endDate);
            }
        } catch (\Exception $e) {
            \Log::error('Pharmacist Report Generation Error', [
                'error' => $e->getMessage(), 
                'trace' => $e->getTraceAsString(),
                'category' => $reportCategory,
                'type' => $reportType
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate report: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get report data based on category
     */
    private function getReportData($category, $startDate, $endDate, $filters = [], $customFields = [])
    {
        switch ($category) {
            case 'inventory_summary':
                return $this->getInventorySummaryData($startDate, $endDate, $filters);
            case 'expiry_report':
                return $this->getStockMovementData($startDate, $endDate, $filters);
            case 'dispensing_report':
                return $this->getDispensingReportData($startDate, $endDate, $filters);
            case 'low_stock_alert':
                return $this->getDisposalReportData($startDate, $endDate, $filters);
            case 'expired_batches':
                return $this->getExpiredBatchesData($startDate, $endDate, $filters);
            case 'custom_official_report':
                return $this->getCustomOfficialReportData($startDate, $endDate, $filters, $customFields);
                default:
                throw new \Exception("Unknown report category: {$category}");
        }
    }

    /**
     * Generate custom report with selected report types
     */
    public function custom(Request $request)
    {
        $format = $request->get('format', 'json');
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());
        
        // Convert to Carbon instances if they're strings
        if (is_string($startDate)) {
            $startDate = Carbon::parse($startDate);
        }
        if (is_string($endDate)) {
            $endDate = Carbon::parse($endDate);
        }

        // Get selected report types
        $includeTypes = $request->get('include_types', []);
        $customTitle = $request->get('custom_title', 'Custom Official Report');
        $customDescription = $request->get('custom_description', 'Comprehensive custom report with selected data sections');
        $includeCharts = $request->get('include_charts', false);
        $includeAnalytics = $request->get('include_analytics', true);

        $filters = [
            'category_id' => $request->get('category_id'),
            'status' => $request->get('status'),
            'priority' => $request->get('priority'),
            'sort_by' => $request->get('sort_by', 'name'),
            'sort_order' => $request->get('sort_order', 'asc'),
            'limit' => $request->get('limit', 100)
        ];

        // Generate combined report data
        $combinedData = $this->generateCustomReportData($includeTypes, $startDate, $endDate, $filters, [
            'custom_title' => $customTitle,
            'custom_description' => $customDescription,
            'include_charts' => $includeCharts,
            'include_analytics' => $includeAnalytics
        ]);

        if ($format === 'pdf') {
            return $this->generateCustomPDFReport($combinedData, $startDate, $endDate);
        } elseif ($format === 'excel') {
            return $this->generateCustomExcelReport($combinedData, $startDate, $endDate);
        } elseif ($format === 'csv') {
            return $this->generateCustomCSVReport($combinedData, $startDate, $endDate);
        } else {
            return response()->json([
                'success' => true,
                'data' => $combinedData,
                'custom_config' => [
                    'title' => $customTitle,
                    'description' => $customDescription,
                    'include_charts' => $includeCharts,
                    'include_analytics' => $includeAnalytics,
                    'selected_types' => $includeTypes
                ],
                'generated_at' => now()->format('Y-m-d H:i:s'),
                'date_range' => [
                    'start' => $startDate->format('Y-m-d'),
                    'end' => $endDate->format('Y-m-d')
                ]
            ]);
        }
    }

    /**
     * Generate PDF report using React-like HTML
     */
    private function generatePDFReport($data, $category, $startDate, $endDate)
    {
        $title = 'RURAL HEALTH UNIT CALUMPANG';
        
        // Map category to proper display title
        $categoryTitles = [
            'inventory_summary' => 'INVENTORY SUMMARY',
            'stock_movements' => 'STOCK MOVEMENTS',
            'expiry_report' => 'EXPIRY',
            'dispensing_report' => 'DISPENSING',
            'disposal_report' => 'DISPOSAL',
            'expired_batches' => 'EXPIRED BATCHES'
        ];
        
        $subtitle = ($categoryTitles[$category] ?? strtoupper(str_replace('_', ' ', $category))) . ' REPORT';
        $filename = "report_{$category}_" . $startDate->format('Y-m-d') . "_to_" . $endDate->format('Y-m-d') . ".pdf";
        
        // Generate HTML using React-like approach
        $html = $this->generateReactHTML($title, $subtitle, $data, $category, $startDate, $endDate);
        
        try {
            $pdf = Pdf::loadHTML($html);
            $pdf->setPaper('a4', 'landscape');
            $pdf->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled' => true,
                    'defaultFont' => 'Arial'
            ]);
            
            return $pdf->stream($filename);
        } catch (\Exception $e) {
            \Log::error('PDF Generation Error', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Generate Excel report
     */
    private function generateExcelReport($data, $category, $startDate, $endDate)
    {
        $filename = "report_{$category}_" . $startDate->format('Y-m-d') . "_to_" . $endDate->format('Y-m-d') . ".xlsx";
        
        // Prepare data for Excel
        $excelData = $this->prepareDataForExcel($data, $category);
        $columns = $this->getReportColumns($category);
        
        return Excel::download(new class($excelData, $columns) implements \Maatwebsite\Excel\Concerns\FromArray, \Maatwebsite\Excel\Concerns\WithHeadings {
                protected $data;
                protected $columns;
                
                public function __construct($data, $columns) {
                    $this->data = $data;
                    $this->columns = $columns;
                }
                
                public function array(): array {
                    return $this->data;
                }
                
                public function headings(): array {
                    return array_values($this->columns);
                }
            }, $filename);
    }

    /**
     * Generate CSV report
     */
    private function generateCSVReport($data, $category, $startDate, $endDate)
    {
        $filename = "report_{$category}_" . $startDate->format('Y-m-d') . "_to_" . $endDate->format('Y-m-d') . ".csv";
        
        // Prepare data for CSV
        $csvData = $this->prepareDataForExcel($data, $category);
        $columns = $this->getReportColumns($category);
        
            $headers = [
                'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"'
            ];

        $callback = function() use ($csvData, $columns) {
                $file = fopen('php://output', 'w');
                
                // Add headers
                fputcsv($file, array_values($columns));
                
                // Add data
            foreach ($csvData as $row) {
                fputcsv($file, $row);
                }
                
                fclose($file);
            };

            return response()->stream($callback, 200, $headers);
    }

    /**
     * Generate React-like HTML for PDF
     */
    private function generateReactHTML($title, $subtitle, $data, $category, $startDate, $endDate)
    {
        $meta = [
            'Generated on' => now()->format('F j, Y \a\t g:i A'),
            'Report Period' => $startDate->format('F j, Y') . ' to ' . $endDate->format('F j, Y'),
            'Total Records' => is_array($data) ? count($data) : 0,
            'Category' => ucfirst(str_replace('_', ' ', $category))
        ];

        $html = '<!DOCTYPE html>
<html>
<head>
    <title>' . $title . '</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #1e3a8a; }
        .subtitle { text-align: center; font-size: 16px; margin-bottom: 20px; color: #666; }
        .meta-info { background: #f8f9fa; padding: 15px; margin-bottom: 20px; border-left: 4px solid #1e3a8a; }
        .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
        .meta-item { display: flex; justify-content: space-between; padding: 5px 0; }
        .meta-label { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th { background: #1e3a8a; color: white; padding: 8px; text-align: left; font-size: 10px; }
        td { padding: 6px 8px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background: #f8f9fa; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="header">' . $title . '</div>
    <div class="subtitle">' . $subtitle . '</div>
    
    <div class="meta-info">
        <div class="meta-grid">';
        
        foreach ($meta as $key => $value) {
            $html .= '<div class="meta-item">
                <span class="meta-label">' . $key . ':</span>
                <span>' . $value . '</span>
            </div>';
        }
        
        $html .= '</div>
    </div>';
        
        if (is_array($data) && count($data) > 0) {
            $html .= '<div class="data-section">
                <h3>Report Data</h3>
                <table>
                    <thead>
                        <tr>';
            
            if (isset($data[0])) {
                foreach (array_keys($data[0]) as $column) {
                    // Skip the 'id' column for PDF reports
                    if (strtolower($column) !== 'id') {
                        $html .= '<th>' . ucfirst(str_replace('_', ' ', $column)) . '</th>';
                    }
                }
            }
            
            $html .= '</tr>
                    </thead>
                    <tbody>';
            
            foreach ($data as $row) {
                $html .= '<tr>';
                foreach ($row as $column => $value) {
                    // Skip the 'id' column for PDF reports
                    if (strtolower($column) !== 'id') {
                        $html .= '<td>' . htmlspecialchars($value) . '</td>';
                    }
                }
                $html .= '</tr>';
            }
            
            $html .= '</tbody>
                </table>
            </div>';
        } else {
            $html .= '<div class="no-data">
                <p>No data available for the selected criteria.</p>
            </div>';
        }
        
        $html .= '<div class="footer">
            <p><strong>OFFICIAL DOCUMENT</strong> - Generated on ' . now()->format('F j, Y \a\t g:i A') . '</p>
            <p>RURAL HEALTH UNIT CALUMPANG</p>
        </div>
</body>
</html>';

        return $html;
    }

    // Data retrieval methods for different report types
    private function getInventorySummaryData($startDate, $endDate, $filters)
    {
        $query = inventory::with(['category', 'istocks']);

        if (isset($filters['category_id']) && $filters['category_id']) {
            $query->where('category_id', $filters['category_id']);
        }

        $inventoryItems = $query->get();

        return $inventoryItems->map(function ($item) {
            $stock = $item->istocks ? $item->istocks->sum('stocks') : 0;
            $expiryDate = $item->expiry_date && $item->expiry_date !== 'N/A' 
                ? Carbon::parse($item->expiry_date) 
                : null;
            
            $daysUntilExpiry = $expiryDate ? (int) now()->diffInDays($expiryDate, false) : null;
            $status = 'Active';
            $priority = 'Low';
            
            if ($expiryDate) {
                if ($expiryDate < now()) {
                    $status = 'Expired';
                    $priority = 'High';
                } elseif ($daysUntilExpiry <= 7) {
                    $status = 'Critical Expiry';
                    $priority = 'High';
                } elseif ($daysUntilExpiry <= 30) {
                    $status = 'Expiring Soon';
                    $priority = 'Medium';
                }
            }
            
            if ($stock <= 0) {
                $status = 'Out of Stock';
                $priority = 'High';
            }

            return [
                'id' => $item->id,
                'name' => $item->name,
                'category' => $item->category ? $item->category->name : 'Uncategorized',
                'quantity' => $stock,
                'unit' => $item->unit_type ?? 'units',
                'status' => $status,
                'manufacturer' => $item->manufacturer ?? 'N/A',
                'batch_number' => $item->batch_number ?? 'N/A',
                'expiry_date' => $item->expiry_date ? Carbon::parse($item->expiry_date)->format('Y-m-d') : 'N/A',
                'description' => $item->description ?? '',
                'storage_location' => $item->storage_location ?? 'Main Storage',
            ];
        })->toArray();
    }


    private function getExpiryReportData($startDate, $endDate, $filters)
    {
        $daysAhead = $filters['days_ahead'] ?? 30;
        $expiryThreshold = now()->addDays($daysAhead);
        
        $query = inventory::with(['category', 'stock'])
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '!=', 'N/A')
            ->where('expiry_date', '<=', $expiryThreshold);

        if (isset($filters['category_id']) && $filters['category_id']) {
            $query->where('category_id', $filters['category_id']);
        }

        $inventoryItems = $query->get();

        return $inventoryItems->map(function ($item) {
            $stock = $item->stock ? $item->stock->stocks : 0;
            $expiryDate = Carbon::parse($item->expiry_date);
            $daysUntilExpiry = (int) now()->diffInDays($expiryDate, false);
            
            $status = 'Active';
            if ($expiryDate < now()) {
                $status = 'Expired';
            } elseif ($daysUntilExpiry <= 7) {
                $status = 'Critical Expiry';
            } elseif ($daysUntilExpiry <= 30) {
                $status = 'Expiring Soon';
            }

            return [
                'Item Name' => $item->name,
                'Category' => $item->category ? $item->category->name : 'Uncategorized',
                'Batch Number' => $item->batch_number ?? 'N/A',
                'Current Stock' => $stock,
                'Unit Type' => $item->unit_type ?? 'pieces',
                'Expiry Date' => $expiryDate->format('Y-m-d'),
                'Status' => $status,
                'Manufacturer' => $item->manufacturer ?? 'N/A',
                'Storage Location' => $item->storage_location ?? 'N/A',
            ];
        })->toArray();
    }

    private function getDispensingReportData($startDate, $endDate, $filters)
    {
        // Ensure dates include full day range
        $startDateParsed = Carbon::parse($startDate)->startOfDay();
        $endDateParsed = Carbon::parse($endDate)->endOfDay();
        
        \Log::info('Dispensing report data query', [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'start_date_parsed' => $startDateParsed->toDateTimeString(),
            'end_date_parsed' => $endDateParsed->toDateTimeString(),
            'start_timestamp' => $startDateParsed->timestamp,
            'end_timestamp' => $endDateParsed->timestamp
        ]);
        
        $movements = istock_movements::with(['inventory', 'staff'])
            ->where('type', 'Outgoing')
            ->whereBetween('created_at', [$startDateParsed, $endDateParsed])
            ->get();
        
        \Log::info('Dispensing report movements found', [
            'count' => $movements->count(),
            'movements' => $movements->map(function($m) {
                return [
                    'id' => $m->id,
                    'inventory_name' => $m->inventory_name,
                    'quantity' => $m->quantity,
                    'type' => $m->type,
                    'created_at' => $m->created_at
                ];
            })->toArray()
        ]);

        $groupedMovements = $movements->groupBy('inventory_id');

        return $groupedMovements->map(function ($movementGroup) {
            $firstMovement = $movementGroup->first();
            
            // Get inventory - try relationship first, then fallback to inventory_name
            $inventory = $firstMovement->inventory;
            $inventoryName = $inventory ? $inventory->name : ($firstMovement->inventory_name ?? 'Unknown Item');
            
            $totalQuantity = $movementGroup->sum('quantity');
            $dispenseCount = $movementGroup->count();
            
            $sortedByDate = $movementGroup->sortBy('created_at');
            $firstMovementByDate = $sortedByDate->first();
            $lastMovement = $sortedByDate->last();

            return [
                'Item Name' => $inventoryName,
                'Category' => $inventory && $inventory->category ? $inventory->category->name : 'Uncategorized',
                'Total Dispensed' => $totalQuantity,
                'Dispense Count' => $dispenseCount,
                'First Dispensed' => $firstMovementByDate ? Carbon::parse($firstMovementByDate->created_at)->format('M d, Y') : 'N/A',
                'Last Dispensed' => $lastMovement ? Carbon::parse($lastMovement->created_at)->format('M d, Y') : 'N/A',
                'Unit Type' => $inventory ? $inventory->unit_type ?? 'pieces' : 'pieces',
                'Most Recent Staff' => $lastMovement->staff ? 
                    $lastMovement->staff->firstname . ' ' . $lastMovement->staff->lastname : 'N/A',
                'Manufacturer' => $inventory ? $inventory->manufacturer ?? 'N/A' : 'N/A',
                'Patient Name/Reason' => $lastMovement->patient_name ?? 'N/A',
                'Batch Number' => $lastMovement->batch_number ?? 'N/A',
                'Mode' => $lastMovement->reason ?? 'Dispensed',
            ];
        })->filter(function($item) {
            return !empty($item['Item Name']) && $item['Item Name'] !== 'Unknown Item';
        })->sortByDesc('Total Dispensed')->values()->toArray();
    }

    private function getLowStockAlertData($startDate, $endDate, $filters)
    {
        $thresholdPercentage = $filters['threshold_percentage'] ?? 20;
        
        $query = inventory::with(['category', 'stock']);
        if (isset($filters['category_id']) && $filters['category_id']) {
            $query->where('category_id', $filters['category_id']);
        }

        $inventoryItems = $query->get();

        return $inventoryItems->map(function ($item) use ($thresholdPercentage) {
            $stock = $item->stock ? $item->stock->stocks : 0;
            
            $urgency = 'Low';
            if ($stock <= 0) {
                $urgency = 'Critical';
            }

            return [
                'Item Name' => $item->name,
                'Category' => $item->category ? $item->category->name : 'Uncategorized',
                'Current Stock' => $stock,
                'Urgency Level' => $urgency,
                'Manufacturer' => $item->manufacturer ?? 'N/A',
                'Last Restocked' => $item->updated_at ? Carbon::parse($item->updated_at)->format('M d, Y') : 'N/A',
            ];
        })->filter(function ($item) use ($thresholdPercentage) {
            return $item['Urgency Level'] !== 'Low';
        })->sortBy(function($item) {
            $urgencyOrder = ['Critical' => 4, 'High' => 3, 'Medium' => 2, 'Low' => 1];
            return $urgencyOrder[$item['Urgency Level']] ?? 0;
        })->values()->toArray();
    }

    private function getDisposalReportData($startDate, $endDate, $filters)
    {
        // Parse dates to ensure proper formatting
        $startDateParsed = is_string($startDate) ? Carbon::parse($startDate)->startOfDay() : $startDate->startOfDay();
        $endDateParsed = is_string($endDate) ? Carbon::parse($endDate)->endOfDay() : $endDate->endOfDay();
        
        // Get all disposal movements from istock_movements table
        $query = istock_movements::with(['inventory.category', 'staff'])
            ->where('type', 'Disposal')
            ->whereBetween('created_at', [$startDateParsed, $endDateParsed]);

        if (isset($filters['category_id']) && $filters['category_id']) {
            $query->whereHas('inventory', function($q) use ($filters) {
                $q->where('category_id', $filters['category_id']);
            });
        }

        $disposalMovements = $query->orderBy('created_at', 'desc')->get();

        return $disposalMovements->map(function ($movement) {
            $inventory = $movement->inventory;
            $staff = $movement->staff;
            
            return [
                'Item Name' => $inventory ? $inventory->name : ($movement->inventory_name ?? 'Unknown Item'),
                'Category' => $inventory && $inventory->category ? $inventory->category->name : 'Uncategorized',
                'Batch Number' => $movement->batch_number ?? 'N/A',
                'Quantity Disposed' => $movement->quantity ?? 0,
                'Disposal Date' => $movement->created_at ? Carbon::parse($movement->created_at)->format('M d, Y H:i') : 'N/A',
                'Reason' => $movement->reason ?? 'N/A',
                'Disposed By' => $staff ? $staff->firstname . ' ' . $staff->lastname : 'Unknown Staff',
                'Manufacturer' => $inventory ? $inventory->manufacturer ?? 'N/A' : 'N/A',
                'Notes' => $movement->notes ?? 'N/A'
            ];
        })->toArray();
    }

    private function getStockMovementData($startDate, $endDate, $filters)
    {
        // Parse dates to ensure proper formatting
        $startDateParsed = is_string($startDate) ? Carbon::parse($startDate)->startOfDay() : $startDate->startOfDay();
        $endDateParsed = is_string($endDate) ? Carbon::parse($endDate)->endOfDay() : $endDate->endOfDay();
        
        \Log::info('Stock Movement Query', [
            'start_date' => $startDateParsed->toDateTimeString(),
            'end_date' => $endDateParsed->toDateTimeString(),
            'category_id' => $filters['category_id'] ?? null
        ]);
        
        // Get all stock movements from istock_movements table
        $query = istock_movements::with(['inventory.category', 'staff'])
            ->whereBetween('created_at', [$startDateParsed, $endDateParsed]);

        if (isset($filters['category_id']) && $filters['category_id']) {
            $query->whereHas('inventory', function($q) use ($filters) {
                $q->where('category_id', $filters['category_id']);
            });
        }

        $stockMovements = $query->orderBy('created_at', 'desc')->get();
        
        \Log::info('Stock Movement Results', [
            'total_movements' => $stockMovements->count(),
            'sample_ids' => $stockMovements->take(3)->pluck('id')->toArray()
        ]);

        return $stockMovements->map(function ($movement) {
            $inventory = $movement->inventory;
            $staff = $movement->staff;
            
            return [
                'Movement ID' => $movement->id,
                'Item Name' => $inventory ? $inventory->name : ($movement->inventory_name ?? 'Unknown Item'),
                'Category' => $inventory && $inventory->category ? $inventory->category->name : 'Uncategorized',
                'Movement Type' => $movement->type ?? 'Unknown',
                'Quantity' => $movement->quantity ?? 0,
                'Batch Number' => $movement->batch_number ?? 'N/A',
                'Movement Date' => $movement->created_at ? Carbon::parse($movement->created_at)->format('M d, Y H:i') : 'N/A',
                'Staff Member' => $staff ? $staff->firstname . ' ' . $staff->lastname : 'Unknown Staff',
                'Reason' => $movement->reason ?? 'N/A',
                'Manufacturer' => $inventory ? $inventory->manufacturer ?? 'N/A' : 'N/A',
                'Expiry Date' => $movement->expiry_date ? Carbon::parse($movement->expiry_date)->format('M d, Y') : 'N/A',
                'Notes' => $movement->notes ?? 'N/A'
            ];
        })->toArray();
    }

    private function getExpiredBatchesData($startDate, $endDate, $filters)
    {
        // Get inventory items that are expired
        $query = inventory::with(['category', 'istocks'])
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '!=', 'N/A')
            ->where('expiry_date', '<', now());

        if (isset($filters['category_id']) && $filters['category_id']) {
            $query->where('category_id', $filters['category_id']);
        }

        $inventoryItems = $query->get();

        return $inventoryItems->map(function ($item) {
            $totalStock = $item->istocks->sum('stocks');
            $expiryDate = Carbon::parse($item->expiry_date);
            // Calculate days expired - how many days have passed since expiry
            $daysExpired = abs((int) $expiryDate->diffInDays(now(), false));

            return [
                'Item Name' => $item->name,
                'Category' => $item->category ? $item->category->name : 'Uncategorized',
                'Batch Number' => $item->batch_number ?? 'N/A',
                'Current Stock' => $totalStock,
                'Unit Type' => $item->unit_type ?? 'pieces',
                'Expiry Date' => $expiryDate->format('M d, Y'),
                'Days Expired' => $daysExpired,
                'Status' => 'Expired',
                'Manufacturer' => $item->manufacturer ?? 'N/A',
                'Storage Location' => $item->storage_location ?? 'N/A',
            ];
        })->sortByDesc('Days Expired')->values()->toArray();
    }

    private function getCustomOfficialReportData($startDate, $endDate, $filters, $customFields)
    {
        // This would be a custom report based on selected fields
        // For now, return a basic inventory report
        return $this->getInventorySummaryData($startDate, $endDate, $filters);
    }

    // Additional data methods for the React component
    private function getInventoryData($startDate, $endDate)
    {
        $inventoryItems = inventory::with(['category', 'stock'])->get();

        return $inventoryItems->map(function ($item) {
            $stock = $item->stock ? $item->stock->stocks : 0;
            $expiryDate = $item->expiry_date && $item->expiry_date !== 'N/A' 
                ? Carbon::parse($item->expiry_date) 
                : null;
            
            $daysUntilExpiry = $expiryDate ? (int) now()->diffInDays($expiryDate, false) : null;
            $status = 'Active';
            $priority = 'Low';
            
            if ($expiryDate) {
                if ($expiryDate < now()) {
                    $status = 'Expired';
                    $priority = 'High';
                } elseif ($daysUntilExpiry <= 7) {
                    $status = 'Critical Expiry';
                    $priority = 'High';
                } elseif ($daysUntilExpiry <= 30) {
                    $status = 'Expiring Soon';
                    $priority = 'Medium';
                }
            }
            
            if ($stock <= 0) {
                $status = 'Out of Stock';
                $priority = 'High';
            }

            return [
                'id' => $item->id,
                'name' => $item->name,
                'generic_name' => $item->generic_name,
                'category' => $item->category ? $item->category->name : 'Uncategorized',
                'category_id' => $item->category_id,
                'current_stock' => $stock,
                'unit_type' => $item->unit_type ?? 'pieces',
                'expiry_date' => $expiryDate ? $expiryDate->format('Y-m-d') : null,
                'days_until_expiry' => $daysUntilExpiry,
                'status' => $status,
                'priority' => $priority,
                'manufacturer' => $item->manufacturer ?? 'N/A',
                'batch_number' => $item->batch_number ?? 'N/A',
                'storage_location' => $item->storage_location ?? 'N/A',
                'created_at' => $item->created_at ? Carbon::parse($item->created_at)->format('Y-m-d H:i:s') : 'N/A',
                'updated_at' => $item->updated_at ? Carbon::parse($item->updated_at)->format('Y-m-d H:i:s') : 'N/A',
            ];
        })->toArray();
    }

    private function getExpiringSoonBatchesData($startDate, $endDate)
    {
        $expiryThreshold = now()->addDays(30);
        
        // Get inventory items that are expiring soon
        $inventoryItems = inventory::with(['category', 'istocks'])
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '!=', 'N/A')
            ->where('expiry_date', '>', now())
            ->where('expiry_date', '<=', $expiryThreshold)
            ->get();

        return $inventoryItems->map(function ($item) {
            $totalStock = $item->istocks->sum('stocks');
            $expiryDate = Carbon::parse($item->expiry_date);
            $daysUntilExpiry = (int) now()->diffInDays($expiryDate, false);

            return [
                'id' => $item->id,
                'name' => $item->name,
                'category' => $item->category ? $item->category->name : 'Uncategorized',
                'current_stock' => $totalStock,
                'expiry_date' => $expiryDate->format('Y-m-d'),
                'days_until_expiry' => $daysUntilExpiry,
                'batch_number' => $item->batch_number ?? 'N/A',
                'manufacturer' => $item->manufacturer ?? 'N/A',
                'unit_type' => $item->unit_type ?? 'pieces',
            ];
        })->toArray();
    }

    private function getDispensingData($startDate, $endDate)
    {
        $movements = istock_movements::with(['inventory', 'staff'])
            ->where('type', 'Outgoing')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        return $movements->map(function ($movement) {
            // Determine dispense mode based on prescription_number and reason
            $dispenseMode = 'Manual Dispense';
            $patientInfo = $movement->patient_name ?? 'N/A';
            
            if (!empty($movement->prescription_number) && $movement->prescription_number !== 'N/A') {
                $dispenseMode = 'Auto Prescription';
                // For auto prescription, show the actual patient name
                $patientInfo = $movement->patient_name ?? 'Unknown Patient';
            } elseif (!empty($movement->reason) && $movement->reason !== 'N/A') {
                $dispenseMode = $movement->reason;
            }

            return [
                'id' => $movement->id,
                'inventory_id' => $movement->inventory_id,
                'inventory_name' => $movement->inventory ? $movement->inventory->name : 'Unknown Item',
                'quantity' => $movement->quantity,
                'movement_type' => $movement->type,
                'staff_name' => $movement->staff ? $movement->staff->firstname . ' ' . $movement->staff->lastname : 'Unknown Staff',
                'patient_name' => $patientInfo,
                'prescription_number' => $movement->prescription_number ?? 'N/A',
                'batch_number' => $movement->batch_number ?? 'N/A',
                'reason' => $movement->reason ?? 'N/A',
                'dispense_mode' => $dispenseMode,
                'dispensed_by' => $movement->dispensed_by ?? 'N/A',
                'notes' => $movement->notes ?? '',
                'created_at' => $movement->created_at ? Carbon::parse($movement->created_at)->format('Y-m-d H:i:s') : Carbon::now()->format('Y-m-d H:i:s'),
                'staff' => $movement->staff,
                'inventory' => $movement->inventory,
            ];
        })->toArray();
    }

    private function getDispensingSummary($startDate, $endDate)
    {
        $totalDispensed = istock_movements::where('type', 'Outgoing')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('quantity');

        $totalDispenses = istock_movements::where('type', 'Outgoing')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $uniqueItems = istock_movements::where('type', 'Outgoing')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->distinct('inventory_id')
            ->count();

            return [
            'total_dispensed' => $totalDispensed,
            'total_dispenses' => $totalDispenses,
            'unique_items' => $uniqueItems,
            'average_per_dispense' => $totalDispenses > 0 ? round($totalDispensed / $totalDispenses, 2) : 0,
        ];
    }

    private function getTopDispensedItems($startDate, $endDate)
    {
        $movements = istock_movements::with(['inventory'])
            ->where('type', 'Outgoing')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $groupedMovements = $movements->groupBy('inventory_id');

        return $groupedMovements->map(function ($movementGroup) {
            $inventory = $movementGroup->first()->inventory;
            $totalQuantity = $movementGroup->sum('quantity');
            $dispenseCount = $movementGroup->count();

            return [
                'inventory_id' => $movementGroup->first()->inventory_id,
                'item_name' => $inventory ? $inventory->name : 'Unknown Item',
                'total_dispensed' => $totalQuantity,
                'dispense_count' => $dispenseCount,
                'average_per_dispense' => round($totalQuantity / $dispenseCount, 2),
            ];
        })->sortByDesc('total_dispensed')->take(10)->values()->toArray();
    }

    // Analytics methods
    private function getPharmacistAnalytics($startDate, $endDate)
    {
        try {
            // Get inventory items with basic relationships only
        $inventoryItems = inventory::with(['category', 'stock'])->get();

            $totalItems = $inventoryItems->count();
            $inStock = 0;
            $lowStock = 0;
            $outOfStock = 0;
            $expiredItems = 0;
            $expiringSoon = 0;
            $criticalAlerts = 0;

            foreach ($inventoryItems as $item) {
            $stock = $item->stock ? $item->stock->stocks : 0;
                $expiryDate = $item->expiry_date && $item->expiry_date !== 'N/A' 
                    ? Carbon::parse($item->expiry_date) 
                    : null;
                
                $daysUntilExpiry = $expiryDate ? (int) now()->diffInDays($expiryDate, false) : null;
                
                // Count by status - define low stock as 1-10 units
                if ($stock > 10) {
                    $inStock++;
                } elseif ($stock > 0) {
                    $lowStock++;
                    $criticalAlerts++;
                } else {
                    $outOfStock++;
                    $criticalAlerts++;
                }
                
                if ($expiryDate) {
                    if ($expiryDate < now()) {
                        $expiredItems++;
                        $criticalAlerts++;
                    } elseif ($daysUntilExpiry <= 30 && $daysUntilExpiry > 0) {
                        $expiringSoon++;
                    }
                }
            }

            $analytics = [
                'total_items' => $totalItems,
                'in_stock' => $inStock,
                'low_stock_items' => $lowStock,
                'out_of_stock' => $outOfStock,
                'expired_items' => $expiredItems,
                'expiring_soon' => $expiringSoon,
                'critical_alerts' => $criticalAlerts,
            ];

            // Debug logging
            \Log::info('Analytics calculation:', [
                'totalItems' => $totalItems,
                'analytics' => $analytics
            ]);

            return [
                'analytics' => $analytics,
                'dashboard_metrics' => [
                    'total_inventory_value' => 0, // Can be calculated later
                    'average_stock_level' => $inStock > 0 ? round($inStock / $totalItems, 2) : 0,
                    'out_of_stock_items' => $outOfStock,
                    'expiry_risk_items' => $expiringSoon + $expiredItems,
                ],
                'period' => [
                    'start' => $startDate->format('Y-m-d'),
                    'end' => $endDate->format('Y-m-d')
                ]
            ];
        } catch (\Exception $e) {
            \Log::error('Pharmacist Analytics Error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return [
                'analytics' => [
                    'total_items' => 0,
                    'in_stock' => 0,
                    'low_stock_items' => 0,
                    'out_of_stock' => 0,
                    'expired_items' => 0,
                    'expiring_soon' => 0,
                    'critical_alerts' => 0,
                ],
                'dashboard_metrics' => [],
                'period' => [
                    'start' => $startDate->format('Y-m-d'),
                    'end' => $endDate->format('Y-m-d')
                ]
            ];
        }
    }

    private function calculateInventoryAnalytics($reportData)
    {
        $analytics = [
            'total_items' => $reportData->count(),
            'in_stock' => $reportData->where('Status', 'Active')->count(),
            'low_stock_items' => $reportData->where('Status', 'Out of Stock')->count(),
            'out_of_stock' => $reportData->where('Status', 'Out of Stock')->count(),
            'expired_items' => $reportData->where('Status', 'Expired')->count(),
            'expiring_soon' => $reportData->whereIn('Status', ['Critical Expiry', 'Expiring Soon'])->count(),
            'critical_alerts' => $reportData->whereIn('Status', ['Critical Expiry', 'Out of Stock'])->count(),
        ];
        
        // Debug logging
        \Log::info('Analytics calculation:', [
            'reportData_count' => $reportData->count(),
            'analytics' => $analytics,
            'statuses' => $reportData->pluck('Status')->unique()->toArray()
        ]);
        
        return $analytics;
    }

    private function prepareDataForExcel($data, $category)
    {
        if (!is_array($data)) {
            return [];
        }

        return array_map(function($item) {
            return is_array($item) ? $item : (array) $item;
        }, $data);
    }

    private function getReportColumns($category)
    {
        $columns = [
            'inventory_summary' => [
                'Name' => 'Name',
                'Category' => 'Category',
                'Quantity' => 'Quantity',
                'Unit' => 'Unit',
                'Status' => 'Status',
                'Manufacturer' => 'Manufacturer',
                'Batch number' => 'Batch number',
                'Expiry date' => 'Expiry date',
                'Description' => 'Description',
                'Storage location' => 'Storage location',
            ],
            'expiry_report' => [
                'Movement ID' => 'Movement ID',
                'Item Name' => 'Item Name',
                'Category' => 'Category',
                'Movement Type' => 'Movement Type',
                'Quantity' => 'Quantity',
                'Batch Number' => 'Batch Number',
                'Movement Date' => 'Movement Date',
                'Staff Member' => 'Staff Member',
                'Reason' => 'Reason',
                'Manufacturer' => 'Manufacturer',
                'Expiry Date' => 'Expiry Date',
                'Notes' => 'Notes'
            ],
            'dispensing_report' => [
            'Item Name' => 'Item Name',
            'Category' => 'Category',
            'Total Dispensed' => 'Total Dispensed',
            'Dispense Count' => 'Dispense Count',
            'First Dispensed' => 'First Dispensed',
            'Last Dispensed' => 'Last Dispensed',
            'Unit Type' => 'Unit Type',
            'Most Recent Staff' => 'Most Recent Staff',
            'Manufacturer' => 'Manufacturer',
            'Patient Name' => 'Patient Name',
            'Batch Number' => 'Batch Number',
            'Reason' => 'Reason',
            ],
            'low_stock_alert' => [
                'Item Name' => 'Item Name',
                'Category' => 'Category',
                'Batch Number' => 'Batch Number',
                'Quantity Disposed' => 'Quantity Disposed',
                'Disposal Date' => 'Disposal Date',
                'Reason' => 'Reason',
                'Disposed By' => 'Disposed By',
                'Manufacturer' => 'Manufacturer',
                'Notes' => 'Notes'
            ],
            'expired_batches' => [
                'Item Name' => 'Item Name',
                'Category' => 'Category',
                'Batch Number' => 'Batch Number',
                'Current Stock' => 'Current Stock',
                'Unit Type' => 'Unit Type',
                'Expiry Date' => 'Expiry Date',
                'Status' => 'Status',
                'Manufacturer' => 'Manufacturer',
                'Storage Location' => 'Storage Location',
            ],
        ];

        return $columns[$category] ?? [];
    }

    /**
     * Generate custom report data by combining selected report types
     */
    private function generateCustomReportData($includeTypes, $startDate, $endDate, $filters, $customConfig)
    {
        $combinedData = [
            'title' => $customConfig['custom_title'],
            'description' => $customConfig['custom_description'],
            'generated_at' => now()->format('Y-m-d H:i:s'),
            'date_range' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d')
            ],
            'sections' => [],
            'analytics' => []
        ];

        // Generate data for each selected report type
        foreach ($includeTypes as $reportType) {
            switch ($reportType) {
                case 'inventory_summary':
                    $data = $this->getInventorySummaryData($startDate, $endDate, $filters);
                    $combinedData['sections']['inventory_summary'] = [
                        'title' => 'Inventory Summary',
                        'data' => $data,
                        'count' => count($data)
                    ];
                    break;
                    
                case 'dispensing_report':
                    $data = $this->getDispensingReportData($startDate, $endDate, $filters);
                    $combinedData['sections']['dispensing_report'] = [
                        'title' => 'Dispensing Activity',
                        'data' => $data,
                        'count' => count($data)
                    ];
                    break;
                    
                case 'expiry_report':
                    $data = $this->getExpiryReportData($startDate, $endDate, $filters);
                    $combinedData['sections']['expiry_report'] = [
                        'title' => 'Expiry Report',
                        'data' => $data,
                        'count' => count($data)
                    ];
                    break;
                    
                case 'low_stock_alert':
                    $data = $this->getDisposalReportData($startDate, $endDate, $filters);
                    $combinedData['sections']['low_stock_alert'] = [
                        'title' => 'Disposal Report',
                        'data' => $data,
                        'count' => count($data)
                    ];
                    break;
                    
                case 'expired_batches':
                    $data = $this->getExpiredBatchesData($startDate, $endDate, $filters);
                    $combinedData['sections']['expired_batches'] = [
                        'title' => 'Expired Batches',
                        'data' => $data,
                        'count' => count($data)
                    ];
                    break;
            }
        }

        // Generate combined analytics if requested
        if ($customConfig['include_analytics']) {
            $analytics = $this->getPharmacistAnalytics($startDate, $endDate);
            $combinedData['analytics'] = $analytics['analytics'] ?? [];
        }

        return $combinedData;
    }

    /**
     * Generate custom PDF report
     */
    private function generateCustomPDFReport($data, $startDate, $endDate)
    {
        $title = 'RURAL HEALTH UNIT CALUMPANG';
        $subtitle = 'CUSTOM OFFICIAL REPORT';
        $filename = "custom_report_" . $startDate->format('Y-m-d') . "_to_" . $endDate->format('Y-m-d') . ".pdf";

        $html = $this->generateCustomHTML($data, $title, $subtitle);

        try {
            $pdf = Pdf::loadHTML($html);
            $pdf->setPaper('a4', 'portrait');
            $pdf->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'defaultFont' => 'Arial'
            ]);
            
            return $pdf->stream($filename);
        } catch (\Exception $e) {
            \Log::error('Custom PDF Generation Error', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Generate custom Excel report
     */
    private function generateCustomExcelReport($data, $startDate, $endDate)
    {
        $filename = "custom_report_" . $startDate->format('Y-m-d') . "_to_" . $endDate->format('Y-m-d') . ".xlsx";
        
        // Prepare data for Excel - combine all sections
        $excelData = [];
        $allColumns = [];
        
        foreach ($data['sections'] as $sectionKey => $section) {
            if (!empty($section['data'])) {
                // Add section header
                $excelData[] = [$section['title']];
                $excelData[] = []; // Empty row
                
                // Add data
                foreach ($section['data'] as $item) {
                    $excelData[] = array_values($item);
                }
                
                $excelData[] = []; // Empty row between sections
            }
        }
        
        return Excel::download(new class($excelData) implements \Maatwebsite\Excel\Concerns\FromArray {
            protected $data;
            
            public function __construct($data) {
                $this->data = $data;
            }
            
            public function array(): array {
                return $this->data;
            }
        }, $filename);
    }

    /**
     * Generate custom CSV report
     */
    private function generateCustomCSVReport($data, $startDate, $endDate)
    {
        $filename = "custom_report_" . $startDate->format('Y-m-d') . "_to_" . $endDate->format('Y-m-d') . ".csv";
        
        return response()->streamDownload(function() use ($data) {
            $file = fopen('php://output', 'w');
            
            // Write header
            fputcsv($file, ['RURAL HEALTH UNIT CALUMPANG - CUSTOM REPORT']);
            fputcsv($file, ['Generated: ' . $data['generated_at']]);
            fputcsv($file, ['Date Range: ' . $data['date_range']['start'] . ' to ' . $data['date_range']['end']]);
            fputcsv($file, []);
            
            // Write each section
            foreach ($data['sections'] as $sectionKey => $section) {
                if (!empty($section['data'])) {
                    fputcsv($file, [$section['title']]);
                    fputcsv($file, []);
                    
                    // Write data
                    foreach ($section['data'] as $item) {
                        fputcsv($file, array_values($item));
                    }
                    
                    fputcsv($file, []); // Empty row between sections
                }
            }
            
            fclose($file);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"'
        ]);
    }

    /**
     * Generate custom HTML for PDF
     */
    private function generateCustomHTML($data, $title, $subtitle)
    {
        $html = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>{$title} - {$subtitle}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .title { font-size: 24px; font-weight: bold; color: #1e40af; }
                .subtitle { font-size: 18px; color: #374151; margin-top: 10px; }
                .section { margin-bottom: 30px; }
                .section-title { font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
                .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .table th, .table td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
                .table th { background-color: #f3f4f6; font-weight: bold; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
            </style>
        </head>
        <body>
            <div class='header'>
                <div class='title'>{$title}</div>
                <div class='subtitle'>{$subtitle}</div>
                <div style='margin-top: 10px; font-size: 14px; color: #6b7280;'>
                    Generated: {$data['generated_at']} | 
                    Period: {$data['date_range']['start']} to {$data['date_range']['end']}
                </div>
            </div>
        ";

        // Add each section
        foreach ($data['sections'] as $sectionKey => $section) {
            if (!empty($section['data'])) {
                $html .= "<div class='section'>";
                $html .= "<div class='section-title'>{$section['title']} ({$section['count']} items)</div>";
                
                if (!empty($section['data'])) {
                    $html .= "<table class='table'>";
                    
                    // Get headers from first item
                    $firstItem = reset($section['data']);
                    if ($firstItem) {
                        $html .= "<thead><tr>";
                        foreach (array_keys($firstItem) as $header) {
                            $html .= "<th>" . ucwords(str_replace('_', ' ', $header)) . "</th>";
                        }
                        $html .= "</tr></thead>";
                    }
                    
                    $html .= "<tbody>";
                    foreach ($section['data'] as $item) {
                        $html .= "<tr>";
                        foreach ($item as $value) {
                            $html .= "<td>" . htmlspecialchars($value) . "</td>";
                        }
                        $html .= "</tr>";
                    }
                    $html .= "</tbody></table>";
                }
                
                $html .= "</div>";
            }
        }

        $html .= "
            <div class='footer'>
                <p>This is an official document generated by RHU Calumpang Management System</p>
                <p>For inquiries, contact: RHU Calumpang, Calumpang, Bulacan</p>
            </div>
        </body>
        </html>";

        return $html;
    }
}
