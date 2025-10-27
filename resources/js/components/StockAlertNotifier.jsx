import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, Volume2, VolumeX, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/tempo/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tempo/components/ui/card';
import { Badge } from '@/components/tempo/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const StockAlertNotifier = ({ 
    alerts = [], 
    isVisible = false, 
    onClose, 
    onDismissAll,
    soundEnabled = true,
    onToggleSound 
}) => {
    const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
    const [isPlaying, setIsPlaying] = useState(false);

    // Filter out dismissed alerts
    const activeAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

    // Play alert sound when new critical alerts appear
    useEffect(() => {
        if (soundEnabled && activeAlerts.length > 0) {
            const criticalAlerts = activeAlerts.filter(alert => alert.alert_level === 'critical');
            if (criticalAlerts.length > 0 && !isPlaying) {
                playAlertSound();
            }
        }
    }, [activeAlerts, soundEnabled, isPlaying]);

    const playAlertSound = () => {
        if (!soundEnabled) return;
        
        setIsPlaying(true);
        
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a beep pattern (3 short beeps)
        const beepPattern = [
            { frequency: 800, duration: 0.1 },
            { frequency: 600, duration: 0.1 },
            { frequency: 800, duration: 0.2 }
        ];
        
        let currentTime = audioContext.currentTime;
        
        beepPattern.forEach((beep, index) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(beep.frequency, currentTime);
            gain.gain.setValueAtTime(0.3, currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, currentTime + beep.duration);
            
            osc.start(currentTime);
            osc.stop(currentTime + beep.duration);
            
            currentTime += beep.duration + 0.05; // Small gap between beeps
        });
        
        // Stop playing after pattern completes
        setTimeout(() => {
                setIsPlaying(false);
        }, 1000);
    };

    const dismissAlert = (alertId) => {
        setDismissedAlerts(prev => new Set([...prev, alertId]));
    };

    const dismissAllAlerts = () => {
        const allAlertIds = activeAlerts.map(alert => alert.id);
        setDismissedAlerts(prev => new Set([...prev, ...allAlertIds]));
        if (onDismissAll) onDismissAll();
    };

    const getAlertIcon = (alertLevel) => {
        switch (alertLevel) {
            case 'critical':
                return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'low':
                return <AlertTriangle className="h-5 w-5 text-orange-500" />;
            default:
                return <AlertTriangle className="h-5 w-5 text-gray-500" />;
        }
    };

    const getAlertBadgeColor = (alertLevel) => {
        switch (alertLevel) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getAlertTitle = (alertLevel) => {
        switch (alertLevel) {
            case 'critical':
                return 'CRITICAL STOCK ALERT';
            case 'warning':
                return 'WARNING: Low Stock';
            case 'low':
                return 'Low Stock Alert';
            default:
                return 'Stock Alert';
        }
    };

    if (!isVisible || activeAlerts.length === 0) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="fixed top-4 right-4 z-50 max-w-md w-full"
            >
                <Card className="border-l-4 border-l-red-500 shadow-lg">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-red-500" />
                                <CardTitle className="text-lg font-bold text-red-700">
                                    Stock Alert
                                </CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onToggleSound}
                                    className="h-8 w-8 p-0"
                                >
                                    {soundEnabled ? (
                                        <Volume2 className="h-4 w-4" />
                                    ) : (
                                        <VolumeX className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-600">
                                {activeAlerts.length} item{activeAlerts.length !== 1 ? 's' : ''} in danger zone
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={dismissAllAlerts}
                                className="text-xs"
                            >
                                Dismiss All
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {activeAlerts.map((alert) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border"
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getAlertIcon(alert.alert_level)}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-sm text-gray-900 truncate">
                                                {alert.name}
                                            </h4>
                                            <Badge 
                                                variant="outline" 
                                                className={`text-xs ${getAlertBadgeColor(alert.alert_level)}`}
                                            >
                                                {alert.alert_level.toUpperCase()}
                                            </Badge>
                                        </div>
                                        
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <p>
                                                <span className="font-medium">Current:</span> {alert.current_stock} {alert.unit}
                                            </p>
                                            <p>
                                                <span className="font-medium">Minimum:</span> {alert.minimum_stock} {alert.unit}
                                            </p>
                                            <p>
                                                <span className="font-medium">Category:</span> {alert.category}
                                            </p>
                                            {alert.days_remaining > 0 && (
                                                <p>
                                                    <span className="font-medium">Est. Days:</span> {alert.days_remaining}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => dismissAlert(alert.id)}
                                        className="h-6 w-6 p-0 flex-shrink-0"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>

                        {activeAlerts.length > 0 && (
                            <div className="pt-2 border-t">
                                <p className="text-xs text-gray-500 text-center">
                                    Click on an item to view details and reorder
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};

export default StockAlertNotifier;