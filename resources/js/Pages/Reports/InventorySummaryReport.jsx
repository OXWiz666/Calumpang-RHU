import React from 'react';

const InventorySummaryReport = ({ title, subtitle, meta, data, columns, analytics }) => {
    const getStatusClass = (status) => {
        switch(status) {
            case 'Expired': return 'status-expired';
            case 'Critical Expiry': return 'status-critical';
            case 'Expiring Soon': return 'status-expiring';
            case 'Low Stock': return 'status-low-stock';
            case 'Out of Stock': return 'status-out-of-stock';
            case 'Overstocked': return 'status-overstocked';
            default: return 'status-active';
        }
    };

    const getPriorityClass = (priority) => {
        switch(priority) {
            case 'High': return 'priority-high';
            case 'Medium': return 'priority-medium';
            case 'Low': return 'priority-low';
            default: return '';
        }
    };

    const getDaysClass = (days) => {
        if (days < 0) return 'days-critical';
        if (days <= 7) return 'days-critical';
        if (days <= 30) return 'days-warning';
        return 'days-safe';
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
        <div className="inventory-summary-report">
            <style jsx>{`
                .inventory-summary-report {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: #1e3a8a;
                }
                .subtitle {
                    text-align: center;
                    font-size: 16px;
                    margin-bottom: 20px;
                    color: #666;
                }
                .meta-info {
                    background: #f8f9fa;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-left: 4px solid #1e3a8a;
                }
                .meta-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                }
                .meta-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                }
                .meta-label {
                    font-weight: bold;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                }
                th {
                    background: #1e3a8a;
                    color: white;
                    padding: 8px;
                    text-align: left;
                    font-size: 10px;
                }
                td {
                    padding: 6px 8px;
                    border-bottom: 1px solid #ddd;
                }
                tr:nth-child(even) {
                    background: #f8f9fa;
                }
                .status-expired { color: #dc2626; font-weight: bold; }
                .status-critical { color: #dc2626; font-weight: bold; }
                .status-expiring { color: #d97706; font-weight: bold; }
                .status-low-stock { color: #ea580c; font-weight: bold; }
                .status-out-of-stock { color: #dc2626; font-weight: bold; }
                .status-overstocked { color: #2563eb; font-weight: bold; }
                .status-active { color: #16a34a; font-weight: bold; }
                .priority-high { color: #dc2626; font-weight: bold; }
                .priority-medium { color: #d97706; font-weight: bold; }
                .priority-low { color: #16a34a; font-weight: bold; }
                .days-critical { color: #dc2626; font-weight: bold; }
                .days-warning { color: #d97706; font-weight: bold; }
                .days-safe { color: #16a34a; }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                }
            `}</style>

            <div className="header">{title}</div>
            <div className="subtitle">{subtitle}</div>
            
            <div className="meta-info">
                <div className="meta-grid">
                    {Object.entries(meta).map(([key, value]) => (
                        <div key={key} className="meta-item">
                            <span className="meta-label">{key}:</span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        {Object.entries(columns).map(([key, label]) => (
                            <th key={key}>{label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {Object.entries(columns).map(([key, label]) => (
                                <td key={key}>
                                    {renderCellValue(key, item[key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="footer">
                <p><strong>OFFICIAL DOCUMENT</strong> - Generated on {new Date().toLocaleString()}</p>
                <p>RURAL HEALTH UNIT CALUMPANG</p>
            </div>
        </div>
    );
};

export default InventorySummaryReport;
