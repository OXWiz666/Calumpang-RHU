# Enhanced Reports System

This document describes the enhanced reporting system implemented using the [Laravel Report Generator](https://github.com/Jimmy-JS/laravel-report-generator) package.

## Overview

The enhanced reports system provides professional PDF, Excel, and CSV report generation capabilities for both inventory management and administrative analytics.

## Features

- **Multiple Export Formats**: PDF, Excel, and CSV
- **Professional Styling**: Color-coded status indicators and formatted data
- **Advanced Filtering**: Date ranges, categories, status filters, and more
- **Grouping and Totals**: Automatic grouping and summary calculations
- **Responsive Design**: Landscape orientation for better data display

## Inventory Reports (Pharmacist)

### Available Reports

1. **Inventory Summary Report**
   - Route: `/pharmacist/inventory-reports/summary`
   - Parameters:
     - `format`: pdf, excel, csv
     - `start_date`: Start date filter
     - `end_date`: End date filter
     - `category_id`: Filter by category
     - `status`: active, expired, expiring_soon, low_stock

2. **Stock Movement Report**
   - Route: `/pharmacist/inventory-reports/stock-movements`
   - Parameters:
     - `format`: pdf, excel, csv
     - `start_date`: Start date filter
     - `end_date`: End date filter
     - `type`: Incoming, Outgoing, Adjustment
     - `staff_id`: Filter by staff member

3. **Expiry Report**
   - Route: `/pharmacist/inventory-reports/expiry`
   - Parameters:
     - `format`: pdf, excel, csv
     - `days_ahead`: Days to look ahead (default: 30)
     - `include_expired`: Include expired items (boolean)

4. **Category Report**
   - Route: `/pharmacist/inventory-reports/category`
   - Parameters:
     - `format`: pdf, excel, csv
     - `start_date`: Start date filter
     - `end_date`: End date filter

### Example Usage

```php
// Generate PDF inventory summary report
GET /pharmacist/inventory-reports/summary?format=pdf&start_date=2024-01-01&end_date=2024-12-31&status=expiring_soon

// Generate Excel stock movement report
GET /pharmacist/inventory-reports/stock-movements?format=excel&type=Outgoing&staff_id=1

// Generate CSV expiry report
GET /pharmacist/inventory-reports/expiry?format=csv&days_ahead=7&include_expired=true
```

## Admin Reports

### Available Reports

1. **Patient Analytics Report**
   - Route: `/admin/enhanced-reports/patient-analytics`
   - Parameters:
     - `format`: pdf, excel, csv
     - `start_date`: Start date filter
     - `end_date`: End date filter
     - `age_group`: 0-17, 18-30, 31-50, 51-70, 70+
     - `gender`: Male, Female

2. **Appointment Analytics Report**
   - Route: `/admin/enhanced-reports/appointment-analytics`
   - Parameters:
     - `format`: pdf, excel, csv
     - `start_date`: Start date filter
     - `end_date`: End date filter
     - `status`: pending, confirmed, completed, cancelled
     - `service_type`: Service type ID

3. **Staff Performance Report**
   - Route: `/admin/enhanced-reports/staff-performance`
   - Parameters:
     - `format`: pdf, excel, csv
     - `start_date`: Start date filter
     - `end_date`: End date filter
     - `role`: admin, doctor, pharmacist

4. **System Overview Report**
   - Route: `/admin/enhanced-reports/system-overview`
   - Parameters:
     - `format`: pdf, excel, csv
     - `start_date`: Start date filter
     - `end_date`: End date filter

### Example Usage

```php
// Generate PDF patient analytics report
GET /admin/enhanced-reports/patient-analytics?format=pdf&start_date=2024-01-01&end_date=2024-12-31&age_group=18-30&gender=Female

// Generate Excel appointment analytics report
GET /admin/enhanced-reports/appointment-analytics?format=excel&status=completed&service_type=1

// Generate CSV staff performance report
GET /admin/enhanced-reports/staff-performance?format=csv&role=doctor
```

## Report Features

### PDF Reports
- Professional styling with color-coded status indicators
- Landscape orientation for better data display
- Grouped data with totals and subtotals
- Custom CSS styling for different data types

### Excel Reports
- Formatted data with proper number formatting
- Grouped data with summary calculations
- Color-coded status indicators
- Downloadable with timestamped filenames

### CSV Reports
- Clean, comma-separated data
- Suitable for data analysis and import
- Downloadable with timestamped filenames

## Technical Details

### Dependencies
- `jimmyjs/laravel-report-generator`: Main report generation package
- `barryvdh/laravel-dompdf`: PDF generation
- `maatwebsite/excel`: Excel generation

### Configuration
- PDF Library: dompdf (configurable in `config/report-generator.php`)
- Paper Size: A4 (configurable per report)
- Orientation: Landscape for data-heavy reports, Portrait for summaries

### File Locations
- Controllers: 
  - `app/Http/Controllers/Pharmacist/InventoryReportsController.php`
  - `app/Http/Controllers/Admin/EnhancedReportsController.php`
- Routes: `routes/web.php`
- Config: `config/report-generator.php`

## Security

All report routes are protected by authentication middleware:
- Inventory reports: `auth` + `Pharmacist` middleware
- Admin reports: `auth` + `Admin` middleware

## Performance

- Reports use efficient database queries with proper indexing
- Large datasets are handled with pagination where appropriate
- PDF generation is optimized for memory usage
- Excel reports use streaming for large datasets

## Future Enhancements

- Scheduled report generation
- Email report delivery
- Custom report templates
- Advanced filtering options
- Report caching for frequently accessed data
