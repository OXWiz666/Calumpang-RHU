/**
 * Stock Alert System
 * Handles audio alerts and notifications for critical stock levels
 */

class StockAlertSystem {
    constructor() {
        this.audioContext = null;
        this.isAudioEnabled = true;
        this.alertHistory = [];
        this.maxHistorySize = 50;
        this.initAudio();
    }

    /**
     * Initialize audio context for sound alerts
     */
    initAudio() {
        try {
            if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } else {
                this.isAudioEnabled = false;
            }
        } catch (error) {
            console.warn('Audio context not supported:', error);
            this.isAudioEnabled = false;
        }
    }

    /**
     * Play audio alert based on stock level
     * @param {string} level - 'critical', 'low', 'minimum', 'out'
     */
    playAlertSound(level) {
        if (!this.isAudioEnabled || !this.audioContext) return;

        try {
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const soundConfig = this.getSoundConfig(level);
            this.playSoundPattern(soundConfig);
            
        } catch (error) {
            console.warn('Audio alert failed:', error);
        }
    }

    /**
     * Play a sound pattern with multiple beeps
     * @param {Object} config - Sound configuration with pattern array
     */
    playSoundPattern(config) {
        if (!config.pattern || !Array.isArray(config.pattern)) return;

        let currentTime = this.audioContext.currentTime;

        config.pattern.forEach((beep, index) => {
            if (beep.frequency > 0) {
                // Create a more complex sound with harmonics for better attention
                const oscillator1 = this.audioContext.createOscillator();
                const oscillator2 = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const filterNode = this.audioContext.createBiquadFilter();
                
                // Connect audio nodes
                oscillator1.connect(filterNode);
                oscillator2.connect(filterNode);
                filterNode.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                // Configure oscillators for richer sound
                oscillator1.frequency.setValueAtTime(beep.frequency, currentTime);
                oscillator1.type = 'square';
                
                oscillator2.frequency.setValueAtTime(beep.frequency * 1.5, currentTime);
                oscillator2.type = 'sawtooth';
                
                // Add filter for more professional sound
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(beep.frequency * 2, currentTime);
                filterNode.Q.setValueAtTime(1, currentTime);
                
                // Volume envelope with smooth attack and release
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(beep.volume * 0.3, currentTime + 0.02);
                gainNode.gain.linearRampToValueAtTime(beep.volume, currentTime + 0.05);
                gainNode.gain.linearRampToValueAtTime(beep.volume, currentTime + beep.duration - 0.05);
                gainNode.gain.linearRampToValueAtTime(0, currentTime + beep.duration);
                
                oscillator1.start(currentTime);
                oscillator1.stop(currentTime + beep.duration);
                oscillator2.start(currentTime);
                oscillator2.stop(currentTime + beep.duration);
            }
            
            // Move to next beep time
            currentTime += beep.duration;
        });
    }

    /**
     * Get sound configuration based on alert level
     */
    getSoundConfig(level) {
        const configs = {
            'out': {
                // Urgent triple beep pattern for out of stock - most attention-grabbing
                pattern: [
                    { frequency: 1200, duration: 0.15, volume: 0.45 },
                    { frequency: 0, duration: 0.08, volume: 0 },
                    { frequency: 1200, duration: 0.15, volume: 0.45 },
                    { frequency: 0, duration: 0.08, volume: 0 },
                    { frequency: 1200, duration: 0.15, volume: 0.45 },
                    { frequency: 0, duration: 0.2, volume: 0 },
                    { frequency: 1000, duration: 0.2, volume: 0.4 },
                    { frequency: 0, duration: 0.1, volume: 0 },
                    { frequency: 1000, duration: 0.2, volume: 0.4 }
                ],
                totalDuration: 1.2
            },
            'critical': {
                // Warning double beep pattern for critical stock
                pattern: [
                    { frequency: 900, duration: 0.2, volume: 0.4 },
                    { frequency: 0, duration: 0.1, volume: 0 },
                    { frequency: 900, duration: 0.2, volume: 0.4 },
                    { frequency: 0, duration: 0.15, volume: 0 },
                    { frequency: 800, duration: 0.15, volume: 0.35 }
                ],
                totalDuration: 0.8
            },
            'low': {
                // Gentle double beep for low stock
                pattern: [
                    { frequency: 700, duration: 0.12, volume: 0.3 },
                    { frequency: 0, duration: 0.08, volume: 0 },
                    { frequency: 700, duration: 0.12, volume: 0.3 }
                ],
                totalDuration: 0.32
            },
            'minimum': {
                // Soft single beep for minimum stock
                pattern: [
                    { frequency: 600, duration: 0.15, volume: 0.25 }
                ],
                totalDuration: 0.15
            }
        };
        
        return configs[level] || configs['low'];
    }

    /**
     * Show browser notification
     */
    showNotification(title, message, level = 'info') {
        if (!('Notification' in window)) {
            console.warn('Browser notifications not supported');
            return;
        }

        if (Notification.permission === 'granted') {
            this.createNotification(title, message, level);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.createNotification(title, message, level);
                }
            });
        }
    }

    /**
     * Create browser notification
     */
    createNotification(title, message, level) {
        const notification = new Notification(title, {
            body: message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'stock-alert',
            requireInteraction: level === 'critical' || level === 'out',
            silent: false
        });

        // Auto-close after 5 seconds for non-critical alerts
        if (level !== 'critical' && level !== 'out') {
            setTimeout(() => notification.close(), 5000);
        }

        // Store in history
        this.addToHistory({
            title,
            message,
            level,
            timestamp: new Date(),
            type: 'notification'
        });
    }

    /**
     * Check stock level and trigger appropriate alerts
     */
    checkStockLevel(currentStock, minimumStock, maximumStock, itemName) {
        const alerts = [];

        // Out of stock
        if (currentStock === 0) {
            alerts.push({
                level: 'out',
                title: '🚨 OUT OF STOCK',
                message: `${itemName} is completely out of stock!`,
                priority: 'critical'
            });
        }
        // Below minimum stock
        else if (currentStock < minimumStock) {
            alerts.push({
                level: 'critical',
                title: '⚠️ CRITICAL STOCK',
                message: `${itemName} is below minimum stock (${currentStock}/${minimumStock})`,
                priority: 'high'
            });
        }
        // At minimum stock
        else if (currentStock === minimumStock) {
            alerts.push({
                level: 'minimum',
                title: '📉 AT MINIMUM STOCK',
                message: `${itemName} is at minimum stock level (${currentStock})`,
                priority: 'medium'
            });
        }
        // Low stock (within 20% of minimum)
        else if (currentStock <= minimumStock * 1.2) {
            alerts.push({
                level: 'low',
                title: '📊 LOW STOCK',
                message: `${itemName} is approaching minimum stock (${currentStock}/${minimumStock})`,
                priority: 'low'
            });
        }

        // Trigger alerts
        alerts.forEach(alert => {
            this.triggerAlert(alert);
        });

        return alerts;
    }

    /**
     * Trigger alert with sound and notification
     */
    triggerAlert(alert) {
        // Play sound
        this.playAlertSound(alert.level);
        
        // Show notification
        this.showNotification(alert.title, alert.message, alert.level);
        
        // Add to history
        this.addToHistory(alert);
        
        // Log to console
        console.warn(`Stock Alert: ${alert.title} - ${alert.message}`);
    }

    /**
     * Add alert to history
     */
    addToHistory(alert) {
        this.alertHistory.unshift(alert);
        
        // Keep only recent alerts
        if (this.alertHistory.length > this.maxHistorySize) {
            this.alertHistory = this.alertHistory.slice(0, this.maxHistorySize);
        }
    }

    /**
     * Get alert history
     */
    getAlertHistory() {
        return this.alertHistory;
    }

    /**
     * Clear alert history
     */
    clearAlertHistory() {
        this.alertHistory = [];
    }

    /**
     * Enable/disable audio alerts
     */
    setAudioEnabled(enabled) {
        this.isAudioEnabled = enabled;
    }

    /**
     * Get audio status
     */
    isAudioAvailable() {
        return this.isAudioEnabled && this.audioContext !== null;
    }

    /**
     * Test alert sounds - useful for testing
     */
    testAlertSounds() {
        if (!this.isAudioAvailable()) {
            console.warn('Audio not available for testing');
            return;
        }

        console.log('Testing alert sounds...');
        
        // Test each alert level with a delay
        setTimeout(() => {
            console.log('Testing minimum stock alert...');
            this.playAlertSound('minimum');
        }, 500);

        setTimeout(() => {
            console.log('Testing low stock alert...');
            this.playAlertSound('low');
        }, 1500);

        setTimeout(() => {
            console.log('Testing critical stock alert...');
            this.playAlertSound('critical');
        }, 2500);

        setTimeout(() => {
            console.log('Testing out of stock alert...');
            this.playAlertSound('out');
        }, 3500);
    }

    /**
     * Play a custom alert sound with specific parameters
     */
    playCustomAlert(frequency = 800, duration = 0.3, volume = 0.3, pattern = 'single') {
        if (!this.isAudioAvailable()) return;

        try {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const customConfig = {
                pattern: pattern === 'single' ? 
                    [{ frequency, duration, volume }] :
                    pattern === 'double' ?
                    [
                        { frequency, duration: duration * 0.5, volume },
                        { frequency: 0, duration: 0.1, volume: 0 },
                        { frequency, duration: duration * 0.5, volume }
                    ] :
                    pattern === 'triple' ?
                    [
                        { frequency, duration: duration * 0.3, volume },
                        { frequency: 0, duration: 0.1, volume: 0 },
                        { frequency, duration: duration * 0.3, volume },
                        { frequency: 0, duration: 0.1, volume: 0 },
                        { frequency, duration: duration * 0.3, volume }
                    ] : [{ frequency, duration, volume }]
            };

            this.playSoundPattern(customConfig);
        } catch (error) {
            console.warn('Custom alert failed:', error);
        }
    }
}

// Create global instance
const stockAlertSystem = new StockAlertSystem();

// Make it available globally for testing
if (typeof window !== 'undefined') {
    window.stockAlertSystem = stockAlertSystem;
}

export default stockAlertSystem;
