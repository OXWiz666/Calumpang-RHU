import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 20,
        fontFamily: 'Helvetica',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#1e3a8a',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666666',
    },
    metaInfo: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        marginBottom: 20,
        borderLeft: '4px solid #1e3a8a',
    },
    metaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    metaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '48%',
        marginBottom: 5,
    },
    metaLabel: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    metaValue: {
        fontSize: 10,
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginBottom: 20,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#1e3a8a',
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
        padding: 8,
        textAlign: 'left',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#1e3a8a',
    },
    tableCell: {
        fontSize: 9,
        padding: 6,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#dddddd',
    },
    tableRowEven: {
        backgroundColor: '#f8f9fa',
    },
    statusExpired: { color: '#dc2626', fontWeight: 'bold' },
    statusCritical: { color: '#dc2626', fontWeight: 'bold' },
    statusExpiring: { color: '#d97706', fontWeight: 'bold' },
    statusLowStock: { color: '#ea580c', fontWeight: 'bold' },
    statusOutOfStock: { color: '#dc2626', fontWeight: 'bold' },
    statusOverstocked: { color: '#2563eb', fontWeight: 'bold' },
    statusActive: { color: '#16a34a', fontWeight: 'bold' },
    priorityHigh: { color: '#dc2626', fontWeight: 'bold' },
    priorityMedium: { color: '#d97706', fontWeight: 'bold' },
    priorityLow: { color: '#16a34a', fontWeight: 'bold' },
    daysCritical: { color: '#dc2626', fontWeight: 'bold' },
    daysWarning: { color: '#d97706', fontWeight: 'bold' },
    daysSafe: { color: '#16a34a' },
    footer: {
        marginTop: 30,
        textAlign: 'center',
        fontSize: 10,
        color: '#666666',
    },
});

const InventorySummaryPDF = ({ title, subtitle, meta, data, columns, analytics }) => {
    const getStatusStyle = (status) => {
        switch(status) {
            case 'Expired': return styles.statusExpired;
            case 'Critical Expiry': return styles.statusCritical;
            case 'Expiring Soon': return styles.statusExpiring;
            case 'Low Stock': return styles.statusLowStock;
            case 'Out of Stock': return styles.statusOutOfStock;
            case 'Overstocked': return styles.statusOverstocked;
            default: return styles.statusActive;
        }
    };

    const getPriorityStyle = (priority) => {
        switch(priority) {
            case 'High': return styles.priorityHigh;
            case 'Medium': return styles.priorityMedium;
            case 'Low': return styles.priorityLow;
            default: return {};
        }
    };

    const getDaysStyle = (days) => {
        if (days < 0) return styles.daysCritical;
        if (days <= 7) return styles.daysCritical;
        if (days <= 30) return styles.daysWarning;
        return styles.daysSafe;
    };

    const renderCellValue = (key, value) => {
        if (key === 'Status') {
            return <Text style={getStatusStyle(value)}>{value}</Text>;
        } else if (key === 'Priority') {
            return <Text style={getPriorityStyle(value)}>{value}</Text>;
        } else if (key === 'Days Until Expiry' && value !== 'N/A') {
            return <Text style={getDaysStyle(value)}>{value}</Text>;
        } else if (key === 'Current Stock' || key === 'Minimum Stock' || key === 'Maximum Stock') {
            return new Intl.NumberFormat().format(value);
        }
        return value;
    };

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <Text style={styles.header}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                
                <View style={styles.metaInfo}>
                    <View style={styles.metaGrid}>
                        {Object.entries(meta).map(([key, value]) => (
                            <View key={key} style={styles.metaItem}>
                                <Text style={styles.metaLabel}>{key}:</Text>
                                <Text style={styles.metaValue}>{value}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableRow}>
                        {Object.entries(columns).map(([key, label]) => (
                            <View key={key} style={styles.tableHeader}>
                                <Text>{label}</Text>
                            </View>
                        ))}
                    </View>
                    
                    {/* Table Body */}
                    {data.map((item, index) => (
                        <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : {}]}>
                            {Object.entries(columns).map(([key, label]) => (
                                <View key={key} style={styles.tableCell}>
                                    <Text>{renderCellValue(key, item[key])}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
                
                <View style={styles.footer}>
                    <Text><Text style={{fontWeight: 'bold'}}>OFFICIAL DOCUMENT</Text> - Generated on {new Date().toLocaleString()}</Text>
                    <Text>RURAL HEALTH UNIT CALUMPANG</Text>
                </View>
            </Page>
        </Document>
    );
};

export default InventorySummaryPDF;
