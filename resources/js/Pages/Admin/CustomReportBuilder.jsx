import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CustomReportBuilder from '@/Components/CustomReportBuilder';
import CustomReportPreview from '@/Components/CustomReportPreview';
import { showToast } from '@/utils/toast.jsx';
import axios from 'axios';

const CustomReportBuilderPage = () => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handlePreview = async (reportConfig) => {
        try {
            setIsGenerating(true);
            
            // Generate preview data
            const response = await axios.post('/admin/custom-reports/generate', {
                ...reportConfig,
                format: 'web'
            });

            if (response.data.success) {
                setPreviewData(response.data);
                setIsPreviewOpen(true);
            } else {
                showToast('Error', 'Failed to generate preview', 'error');
            }
        } catch (error) {
            console.error('Error generating preview:', error);
            showToast('Error', 'Failed to generate preview', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async (reportConfig) => {
        try {
            setIsGenerating(true);
            
            const response = await axios.post('/admin/custom-reports/save-template', reportConfig);

            if (response.data.success) {
                showToast('Success', 'Template saved successfully', 'success');
            } else {
                showToast('Error', 'Failed to save template', 'error');
            }
        } catch (error) {
            console.error('Error saving template:', error);
            showToast('Error', 'Failed to save template', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerate = async (reportConfig) => {
        try {
            setIsGenerating(true);
            
            const response = await axios.post('/admin/custom-reports/generate', {
                ...reportConfig,
                format: reportConfig.format
            });

            if (response.data.success) {
                showToast('Success', 'Report generated successfully', 'success');
                
                // If it's a file download, trigger download
                if (reportConfig.format !== 'web') {
                    // Create a temporary link to download the file
                    const link = document.createElement('a');
                    link.href = response.data.download_url;
                    link.download = response.data.filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } else {
                showToast('Error', 'Failed to generate report', 'error');
            }
        } catch (error) {
            console.error('Error generating report:', error);
            showToast('Error', 'Failed to generate report', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setPreviewData(null);
    };

    return (
        <AdminLayout header="Custom Report Builder">
            <Head title="Custom Report Builder" />
            
            <div className="py-6">
                <CustomReportBuilder
                    onPreview={handlePreview}
                    onSave={handleSave}
                    onGenerate={handleGenerate}
                />
            </div>

            {isPreviewOpen && previewData && (
                <CustomReportPreview
                    reportConfig={previewData.reportConfig}
                    data={previewData.data}
                    analytics={previewData.analytics}
                    onClose={handleClosePreview}
                    onGenerate={handleGenerate}
                />
            )}

            {isGenerating && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-gray-700">Processing...</span>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default CustomReportBuilderPage;
