import React from 'react';
import { Head } from '@inertiajs/react';
import InventorySummaryTable from '@/Components/InventorySummaryTable';

const InventorySummaryReport = ({ title, subtitle, meta, data, columns, analytics }) => {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                        <p className="text-lg text-gray-600">{subtitle}</p>
                    </div>

                    {/* Meta Information */}
                    <div className="bg-white shadow rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Report Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(meta).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="font-medium text-gray-700">{key}:</span>
                                    <span className="text-gray-900">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Analytics Cards */}
                    {analytics && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">T</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                                                <dd className="text-lg font-medium text-gray-900">{analytics.totalItems}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">C</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Critical Alerts</dt>
                                                <dd className="text-lg font-medium text-gray-900">{analytics.criticalAlerts}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">L</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Low Stock</dt>
                                                <dd className="text-lg font-medium text-gray-900">{analytics.lowStockItems}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">E</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Expired</dt>
                                                <dd className="text-lg font-medium text-gray-900">{analytics.expiredItems}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Table */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Inventory Summary</h3>
                        </div>
                        <div className="p-6">
                            <InventorySummaryTable data={data} columns={columns} />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p><strong>OFFICIAL DOCUMENT</strong> - Generated on {new Date().toLocaleString()}</p>
                        <p>RURAL HEALTH UNIT CALUMPANG</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InventorySummaryReport;
