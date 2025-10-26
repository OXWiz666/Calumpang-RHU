import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AlertTriangle, 
    X, 
    Volume2, 
    VolumeX, 
    Bell, 
    BellOff,
    Trash2,
    RefreshCw,
    Play,
    TestTube
} from 'lucide-react';
import { Button } from '@/components/tempo/components/ui/button';
import { Badge } from '@/components/tempo/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { ScrollArea } from '@/components/tempo/components/ui/scroll-area';
import useStockAlerts from '@/hooks/useStockAlerts';

const StockAlertPanel = ({ isOpen, onClose }) => {
    const {
        alerts,
        alertHistory,
        isAudioEnabled,
        clearAlerts,
        removeAlert,
        toggleAudio,
        getAlertHistory,
        clearAlertHistory,
        getStockLevelColor,
        getStockLevelIcon
    } = useStockAlerts();

    const [activeTab, setActiveTab] = useState('current');

    useEffect(() => {
        if (isOpen) {
            getAlertHistory();
        }
    }, [isOpen, getAlertHistory]);

    const getPriorityColor = (priority) => {
        const colors = {
            'critical': 'bg-red-100 border-red-200 text-red-800',
            'high': 'bg-orange-100 border-orange-200 text-orange-800',
            'medium': 'bg-yellow-100 border-yellow-200 text-yellow-800',
            'low': 'bg-blue-100 border-blue-200 text-blue-800'
        };
        return colors[priority] || colors['low'];
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8" />
                            <div>
                                <h2 className="text-2xl font-bold">Stock Alert Center</h2>
                                <p className="text-red-100 text-sm">Monitor critical stock levels</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleAudio}
                                className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-red-600"
                            >
                                {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                {isAudioEnabled ? 'Sound On' : 'Sound Off'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (window.stockAlertSystem) {
                                        window.stockAlertSystem.testAlertSounds();
                                    }
                                }}
                                className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-blue-600"
                            >
                                <TestTube className="h-4 w-4 mr-2" />
                                Test Sounds
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="text-white hover:bg-white hover:bg-opacity-20"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('current')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'current'
                                    ? 'border-red-600 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Current Alerts ({alerts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'history'
                                    ? 'border-red-600 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Alert History ({alertHistory.length})
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'current' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Active Stock Alerts</h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearAlerts}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear All
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className="h-96">
                                {alerts.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium">No Active Alerts</p>
                                        <p className="text-sm">All stock levels are healthy</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {alerts.map((alert, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="p-4 border rounded-lg bg-white shadow-sm"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-2xl">
                                                            {getStockLevelIcon(alert.level)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-semibold text-gray-900">
                                                                    {alert.title}
                                                                </h4>
                                                                <Badge
                                                                    className={getPriorityColor(alert.priority)}
                                                                >
                                                                    {alert.priority}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-gray-600 text-sm">
                                                                {alert.message}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {formatTime(alert.timestamp)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeAlert(index)}
                                                        className="text-gray-400 hover:text-red-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Alert History</h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={getAlertHistory}
                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Refresh
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearAlertHistory}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear History
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className="h-96">
                                {alertHistory.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <BellOff className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium">No Alert History</p>
                                        <p className="text-sm">Alert history will appear here</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {alertHistory.map((alert, index) => (
                                            <div
                                                key={index}
                                                className="p-4 border rounded-lg bg-gray-50"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="text-xl">
                                                        {getStockLevelIcon(alert.level)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-medium text-gray-900">
                                                                {alert.title}
                                                            </h4>
                                                            <Badge
                                                                className={getPriorityColor(alert.priority)}
                                                            >
                                                                {alert.priority}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-gray-600 text-sm">
                                                            {alert.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {formatDate(alert.timestamp)} at {formatTime(alert.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StockAlertPanel;
