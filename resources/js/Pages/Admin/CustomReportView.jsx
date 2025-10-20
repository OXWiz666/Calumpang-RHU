import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Download, 
    Eye, 
    BarChart3, 
    PieChart, 
    TrendingUp, 
    FileText,
    Calendar,
    Users,
    Package,
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    X
} from 'lucide-react';

const CustomReportView = ({ reportConfig, data, analytics }) => {
    const [activeTab, setActiveTab] = useState('table');
    const [isFullscreen, setIsFullscreen] = useState(false);

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

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'patients':
                return <Users className="h-5 w-5 text-blue-500" />;
            case 'appointments':
                return <Calendar className="h-5 w-5 text-green-500" />;
            case 'inventory':
                return <Package className="h-5 w-5 text-purple-500" />;
            case 'staff':
                return <Users className="h-5 w-5 text-orange-500" />;
            default:
                return <FileText className="h-5 w-5 text-gray-500" />;
        }
    };

    const renderVisualization = (viz) => {
        switch (viz.type) {
            case 'bar':
                return <BarChartVisualization data={data} fields={viz.fields} />;
            case 'pie':
                return <PieChartVisualization data={data} fields={viz.fields} />;
            case 'line':
                return <LineChartVisualization data={data} fields={viz.fields} />;
            case 'table':
                return <DataTableVisualization data={data} fields={reportConfig.fields} />;
            default:
                return <div className="text-gray-500">Unsupported visualization type</div>;
        }
    };

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'min-h-screen bg-gray-50'}`}>
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            {getCategoryIcon(reportConfig.category)}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{reportConfig.name}</h1>
                                <p className="text-sm text-gray-600">{reportConfig.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                            >
                                <Eye className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Records</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.total_records}</p>
                            </div>
                        </div>
                    </div>

                    {analytics.new_patients && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">New Patients</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.new_patients}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {analytics.completed_appointments && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.completed_appointments}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {analytics.low_stock_items && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Low Stock</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.low_stock_items}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow">
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
                    <div className="p-6">
                        {activeTab === 'table' ? (
                            <DataTableVisualization data={data} fields={reportConfig.fields} />
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
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Generated on {new Date().toLocaleString()} • {reportConfig.category.charAt(0).toUpperCase() + reportConfig.category.slice(1)} Report</p>
                </div>
            </div>
        </div>
    );
};

// Data Table Component
const DataTableVisualization = ({ data, fields }) => {
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
                const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                
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

export default CustomReportView;
