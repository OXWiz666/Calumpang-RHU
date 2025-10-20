<?php

namespace App\Services;

use Illuminate\Support\Facades\Process;

class ReactPDFService
{
    /**
     * Generate PDF from React component
     */
    public static function generatePDF($componentPath, $data, $filename = 'report.pdf')
    {
        // Create a temporary data file
        $tempDataFile = tempnam(sys_get_temp_dir(), 'react_pdf_data_');
        file_put_contents($tempDataFile, json_encode($data));
        
        // Create a temporary output file
        $tempOutputFile = tempnam(sys_get_temp_dir(), 'react_pdf_output_') . '.pdf';
        
        try {
            // Use Node.js to render the React component to PDF
            $nodeScript = "
                const { render } = require('@react-pdf/renderer');
                const React = require('react');
                const fs = require('fs');
                
                // Read the data
                const data = JSON.parse(fs.readFileSync('{$tempDataFile}', 'utf8'));
                
                // Import the component (we'll need to create a build script for this)
                const InventorySummaryPDF = require('./resources/js/Pages/Reports/InventorySummaryPDF.jsx');
                
                // Render to PDF
                const pdf = render(React.createElement(InventorySummaryPDF, data));
                pdf.pipe(fs.createWriteStream('{$tempOutputFile}'));
            ";
            
            $tempScriptFile = tempnam(sys_get_temp_dir(), 'react_pdf_script_') . '.js';
            file_put_contents($tempScriptFile, $nodeScript);
            
            // Execute the Node.js script
            $result = Process::run("node {$tempScriptFile}");
            
            if ($result->successful() && file_exists($tempOutputFile)) {
                $pdfContent = file_get_contents($tempOutputFile);
                
                // Clean up temporary files
                unlink($tempDataFile);
                unlink($tempOutputFile);
                unlink($tempScriptFile);
                
                return response($pdfContent, 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="' . $filename . '"'
                ]);
            } else {
                throw new \Exception('Failed to generate PDF: ' . $result->errorOutput());
            }
        } catch (\Exception $e) {
            // Clean up temporary files
            if (file_exists($tempDataFile)) unlink($tempDataFile);
            if (file_exists($tempOutputFile)) unlink($tempOutputFile);
            if (isset($tempScriptFile) && file_exists($tempScriptFile)) unlink($tempScriptFile);
            
            throw $e;
        }
    }
    
    /**
     * Generate HTML from React component (for web display)
     */
    public static function generateHTML($componentPath, $data)
    {
        // For now, we'll use a simpler approach with server-side rendering
        // This would require a more complex setup with V8 or similar
        return view('reports.inventory-summary', $data);
    }
}
