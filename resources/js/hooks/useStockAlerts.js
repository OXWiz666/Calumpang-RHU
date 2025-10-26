import { useState, useEffect, useCallback } from 'react';
import stockAlertSystem from '@/utils/stockAlerts';

/**
 * Custom hook for managing stock alerts
 */
export const useStockAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [alertHistory, setAlertHistory] = useState([]);

    // Initialize alert system
    useEffect(() => {
        try {
            if (stockAlertSystem && typeof stockAlertSystem.getAlertHistory === 'function') {
                setAlertHistory(stockAlertSystem.getAlertHistory());
            }
        } catch (error) {
            console.warn('Failed to initialize stock alert system:', error);
        }
    }, []);

    /**
     * Check stock level and trigger alerts
     */
    const checkStockLevel = useCallback((item) => {
        try {
            if (!stockAlertSystem || typeof stockAlertSystem.checkStockLevel !== 'function') {
                return [];
            }

            const currentStock = item.stock?.stocks || 0;
            const minimumStock = item.minimum_stock || 0;
            const maximumStock = item.maximum_stock || 0;
            const itemName = item.name;

            // Check stock level
            const newAlerts = stockAlertSystem.checkStockLevel(
                currentStock,
                minimumStock,
                maximumStock,
                itemName
            );

            // Update alerts state
            if (newAlerts.length > 0) {
                setAlerts(prev => [...prev, ...newAlerts]);
            }

            return newAlerts;
        } catch (error) {
            console.warn('Error checking stock level:', error);
            return [];
        }
    }, []);

    /**
     * Check multiple items for stock levels
     */
    const checkMultipleItems = useCallback((items) => {
        const allAlerts = [];
        
        items.forEach(item => {
            const itemAlerts = checkStockLevel(item);
            allAlerts.push(...itemAlerts);
        });

        return allAlerts;
    }, [checkStockLevel]);

    /**
     * Clear all alerts
     */
    const clearAlerts = useCallback(() => {
        setAlerts([]);
    }, []);

    /**
     * Remove specific alert
     */
    const removeAlert = useCallback((index) => {
        setAlerts(prev => prev.filter((_, i) => i !== index));
    }, []);

    /**
     * Toggle audio alerts
     */
    const toggleAudio = useCallback(() => {
        const newState = !isAudioEnabled;
        setIsAudioEnabled(newState);
        try {
            if (stockAlertSystem && typeof stockAlertSystem.setAudioEnabled === 'function') {
                stockAlertSystem.setAudioEnabled(newState);
            }
        } catch (error) {
            console.warn('Error toggling audio:', error);
        }
    }, [isAudioEnabled]);

    /**
     * Get alert history
     */
    const getAlertHistory = useCallback(() => {
        try {
            if (stockAlertSystem && typeof stockAlertSystem.getAlertHistory === 'function') {
                const history = stockAlertSystem.getAlertHistory();
                setAlertHistory(history);
                return history;
            }
            return [];
        } catch (error) {
            console.warn('Error getting alert history:', error);
            return [];
        }
    }, []);

    /**
     * Clear alert history
     */
    const clearAlertHistory = useCallback(() => {
        try {
            if (stockAlertSystem && typeof stockAlertSystem.clearAlertHistory === 'function') {
                stockAlertSystem.clearAlertHistory();
            }
            setAlertHistory([]);
        } catch (error) {
            console.warn('Error clearing alert history:', error);
        }
    }, []);

    /**
     * Get stock level status
     */
    const getStockLevelStatus = useCallback((currentStock, minimumStock) => {
        if (currentStock === 0) return 'out';
        if (currentStock < minimumStock) return 'critical';
        if (currentStock === minimumStock) return 'minimum';
        if (currentStock <= minimumStock * 1.2) return 'low';
        return 'healthy';
    }, []);

    /**
     * Get stock level color
     */
    const getStockLevelColor = useCallback((status) => {
        const colors = {
            'out': 'text-red-600 bg-red-100',
            'critical': 'text-red-600 bg-red-50',
            'minimum': 'text-yellow-600 bg-yellow-50',
            'low': 'text-orange-600 bg-orange-50',
            'healthy': 'text-green-600 bg-green-50'
        };
        return colors[status] || colors['healthy'];
    }, []);

    /**
     * Get stock level icon
     */
    const getStockLevelIcon = useCallback((status) => {
        const icons = {
            'out': '🚨',
            'critical': '⚠️',
            'minimum': '📉',
            'low': '📊',
            'healthy': '✅'
        };
        return icons[status] || icons['healthy'];
    }, []);

    return {
        alerts,
        alertHistory,
        isAudioEnabled,
        checkStockLevel,
        checkMultipleItems,
        clearAlerts,
        removeAlert,
        toggleAudio,
        getAlertHistory,
        clearAlertHistory,
        getStockLevelStatus,
        getStockLevelColor,
        getStockLevelIcon
    };
};

export default useStockAlerts;