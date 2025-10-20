import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart3, 
    PieChart, 
    TrendingUp, 
    FileText, 
    Download, 
    Eye,
    Calendar,
    Users,
    Package,
    Activity,
    AlertCircle,
    CheckCircle,
    Clock
} from 'lucide-react';

const CustomReportPreview = ({ reportConfig, data, onClose, onGenerate }) => {
    const [previewData, setPreviewData] = useState(data || []);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('table');

    // Mock data generation for preview
    useEffect(() => {
        if (!data) {
            generateMockData();
        }
    }, [reportConfig]);

    const generateMockData = () => {
        const mockData = [];
        const sampleSize = 20;
        
        for (let i = 0; i < sampleSize; i++) {
            const item = {};
            reportConfig.fields.forEach(field => {
                switch (field.type) {
                    case 'text':
                        item[field.id] = `Sample ${field.name} ${i + 1}`;
                        break;
                    case 'number':
                        item[field.id] = Math.floor(Math.random() * 1000);
                        break;
                    case 'date':
                        item[field.id] = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        break;
                    case 'email':
                        item[field.id] = `user${i + 1}@example.com`;
                        break;
                    case 'select':
                        const options = ['Active', 'Inactive', 'Pending', 'Completed'];
                        item[field.id] = options[Math.floor(Math.random() * options.length)];
                        break;
                    default:
                        item[field.id] = `Sample ${field.name} ${i + 1}`;
                }
            });
            mockData.push(item);
        }
        
        setPreviewData(mockData);
    };

    const renderVisualization = (viz) => {
        switch (viz.type) {
            case 'bar':
                return <BarChartVisualization data={previewData} fields={viz.fields} />;
            case 'pie':
                return <PieChartVisualization data={previewData} fields={viz.fields} />;
            case 'line':
                return <LineChartVisualization data={previewData} fields={viz.fields} />;
            case 'table':
                return <DataTableVisualization data={previewData} fields={reportConfig.fields} />;
            default:
                return <div className="text-gray-500">Unsupported visualization type</div>;
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'inactive':
            case 'cancelled':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Activity className="h-4 w-4 text-gray-500" />;
        }
    };

    const formatValue = (value, field) => {
        if (value === null || value === undefined) return 'N/A';
        
        switch (field.type) {
            case 'number':
                return new Intl.NumberFormat().format(value);
            case 'date':
                return new Date(value).toLocaleDateString();
            case 'email':
                return value;
            default:
                return String(value);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{reportConfig.name || 'Custom Report Preview'}</h2>
                            <p className="text-sm text-gray-600">{reportConfig.description || 'Preview of your custom report'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('table')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'table'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FileText className="h-4 w-4 inline mr-2" />
                            Data Table
                        </button>
                        {reportConfig.visualizations.map((viz, index) => (
                            <button
                                key={viz.id}
                                onClick={() => setActiveTab(`viz-${index}`)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === `viz-${index}`
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {viz.type === 'bar' && <BarChart3 className="h-4 w-4 inline mr-2" />}
                                {viz.type === 'pie' && <PieChart className="h-4 w-4 inline mr-2" />}
                                {viz.type === 'line' && <TrendingUp className="h-4 w-4 inline mr-2" />}
                                {viz.title}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6 overflow-auto max-h-[60vh]">
                    {activeTab === 'table' ? (
                        <DataTableVisualization data={previewData} fields={reportConfig.fields} />
                    ) : (
                        reportConfig.visualizations.map((viz, index) => (
                            activeTab === `viz-${index}` && (
                                <div key={viz.id}>
                                    {renderVisualization(viz)}
                                </div>
                            )
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {previewData.length} records • Generated on {new Date().toLocaleString()}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => onGenerate && onGenerate(reportConfig)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Download className="h-4 w-4" />
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Data Table Component
const DataTableVisualization = ({ data, fields }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {fields.map(field => (
                            <th
                                key={field.id}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {field.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {fields.map(field => (
                                <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        {field.type === 'select' && getStatusIcon(item[field.id])}
                                        {formatValue(item[field.id], field)}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Bar Chart Component
const BarChartVisualization = ({ data, fields }) => {
    const chartData = data.slice(0, 10); // Limit to 10 items for preview
    
    return (
        <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.map((item, index) => {
                const value = item[fields[0]?.id] || 0;
                const maxValue = Math.max(...chartData.map(d => d[fields[0]?.id] || 0));
                const height = (value / maxValue) * 100;
                
                return (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div
                            className="bg-blue-500 w-full rounded-t"
                            style={{ height: `${height}%` }}
                        />
                        <div className="text-xs text-gray-600 mt-2 truncate w-full text-center">
                            {String(item[fields[0]?.id] || '').substring(0, 10)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Pie Chart Component
const PieChartVisualization = ({ data, fields }) => {
    const chartData = data.slice(0, 5); // Limit to 5 items for preview
    const total = chartData.reduce((sum, item) => sum + (item[fields[0]?.id] || 0), 0);
    
    return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-600">Total {fields[0]?.name || 'Value'}</div>
                <div className="mt-4 space-y-1">
                    {chartData.map((item, index) => {
                        const value = item[fields[0]?.id] || 0;
                        const percentage = total > 0 ? (value / total) * 100 : 0;
                        const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                        
                        return (
                            <div key={index} className="flex items-center gap-2 text-sm">
                                <div className={`w-3 h-3 rounded ${colors[index % colors.length]}`} />
                                <span>{String(item[fields[0]?.id] || '').substring(0, 15)}</span>
                                <span className="text-gray-500">({percentage.toFixed(1)}%)</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Line Chart Component
const LineChartVisualization = ({ data, fields }) => {
    const chartData = data.slice(0, 10); // Limit to 10 items for preview
    
    return (
        <div className="h-64 flex items-center justify-center">
            <div className="text-center">
                <TrendingUp className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <div className="text-lg font-semibold text-gray-900">Line Chart Preview</div>
                <div className="text-sm text-gray-600">Data points: {chartData.length}</div>
                <div className="text-xs text-gray-500 mt-2">
                    Full line chart will be rendered in the actual report
                </div>
            </div>
        </div>
    );
};

export default CustomReportPreview;
