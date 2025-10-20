<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class InventorySummaryExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths, WithTitle
{
    protected $data;
    protected $title;

    public function __construct($data, $title = 'Inventory Summary Report')
    {
        $this->data = $data;
        $this->title = $title;
    }

    public function collection()
    {
        return collect($this->data);
    }

    public function headings(): array
    {
        return [
            'Item Name',
            'Generic Name',
            'Category',
            'Batch Number',
            'Current Stock',
            'Unit Type',
            'Expiry Date',
            'Days Until Expiry',
            'Status',
            'Priority',
            'Manufacturer',
            'Storage Location',
            'Minimum Stock',
            'Maximum Stock',
            'Turnover Rate',
            'Last Movement',
            'Created At'
        ];
    }

    public function title(): string
    {
        return $this->title;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 25, // Item Name
            'B' => 25, // Generic Name
            'C' => 15, // Category
            'D' => 15, // Batch Number
            'E' => 12, // Current Stock
            'F' => 10, // Unit Type
            'G' => 12, // Expiry Date
            'H' => 15, // Days Until Expiry
            'I' => 12, // Status
            'J' => 10, // Priority
            'K' => 20, // Manufacturer
            'L' => 15, // Storage Location
            'M' => 12, // Minimum Stock
            'N' => 12, // Maximum Stock
            'O' => 12, // Turnover Rate
            'P' => 12, // Last Movement
            'Q' => 12, // Created At
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Header styling
        $sheet->getStyle('A1:Q1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 12
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '1e3a8a']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000']
                ]
            ]
        ]);

        // Data row styling
        $sheet->getStyle('A2:Q' . (count($this->data) + 1))->applyFromArray([
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_LEFT,
                'vertical' => Alignment::VERTICAL_CENTER
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'CCCCCC']
                ]
            ]
        ]);

        // Alternate row colors
        for ($i = 2; $i <= count($this->data) + 1; $i++) {
            if ($i % 2 == 0) {
                $sheet->getStyle('A' . $i . ':Q' . $i)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'F8FAFC']
                    ]
                ]);
            }
        }

        // Auto-fit columns
        foreach (range('A', 'Q') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        return [];
    }
}

