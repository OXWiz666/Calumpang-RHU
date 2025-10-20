import React from 'react';

const InventorySummaryTable = ({ data, columns }) => {
    const getStatusClass = (status) => {
        switch(status) {
            case 'Expired': return 'text-red-600 font-bold';
            case 'Critical Expiry': return 'text-red-600 font-bold';
            case 'Expiring Soon': return 'text-yellow-600 font-bold';
            case 'Low Stock': return 'text-orange-600 font-bold';
            case 'Out of Stock': return 'text-red-600 font-bold';
            case 'Overstocked': return 'text-blue-600 font-bold';
            default: return 'text-green-600 font-bold';
        }
    };

    const getPriorityClass = (priority) => {
        switch(priority) {
            case 'High': return 'text-red-600 font-bold';
            case 'Medium': return 'text-yellow-600 font-bold';
            case 'Low': return 'text-green-600 font-bold';
            default: return 'text-gray-600';
        }
    };

    const getDaysClass = (days) => {
        if (days < 0) return 'text-red-600 font-bold';
        if (days <= 7) return 'text-red-600 font-bold';
        if (days <= 30) return 'text-yellow-600 font-bold';
        return 'text-green-600';
    };

    const renderCellValue = (key, value) => {
        if (key === 'Status') {
            return <span className={getStatusClass(value)}>{value}</span>;
        } else if (key === 'Priority') {
            return <span className={getPriorityClass(value)}>{value}</span>;
        } else if (key === 'Days Until Expiry' && value !== 'N/A') {
            return <span className={getDaysClass(value)}>{value}</span>;
        } else if (key === 'Current Stock' || key === 'Minimum Stock' || key === 'Maximum Stock') {
            return new Intl.NumberFormat().format(value);
        }
        return value;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {Object.entries(columns).map(([key, label]) => (
                            <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {Object.entries(columns).map(([key, label]) => (
                                <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {renderCellValue(key, item[key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventorySummaryTable;
