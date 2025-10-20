import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Send, CheckCircle, XCircle, Phone, MessageSquare } from 'lucide-react';

const SMSTestComponent = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [messageType, setMessageType] = useState('custom');

    const sendVerificationCode = async () => {
        if (!phone) {
            setResult({ success: false, message: 'Please enter a phone number' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/sms/send-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ phone })
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ success: false, message: 'Network error: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        if (!phone || !verificationCode) {
            setResult({ success: false, message: 'Please enter phone number and verification code' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/sms/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ phone, code: verificationCode })
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ success: false, message: 'Network error: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const sendCustomMessage = async () => {
        if (!phone || !message) {
            setResult({ success: false, message: 'Please enter phone number and message' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/sms/send-custom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ phone, message, type: messageType })
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ success: false, message: 'Network error: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const sendTestSMS = async () => {
        if (!phone) {
            setResult({ success: false, message: 'Please enter a phone number' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/sms/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ phone, message: message || undefined })
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ success: false, message: 'Network error: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">SMS API Test Center</h1>
                <p className="text-gray-600">Test and manage SMS functionality for Calumpang RHU</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Verification Code Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            Verification Code
                        </CardTitle>
                        <CardDescription>
                            Send and verify 6-digit verification codes
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <Input
                                type="tel"
                                placeholder="+639123456789"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <Button 
                            onClick={sendVerificationCode} 
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                            Send Verification Code
                        </Button>
                        
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Enter 6-digit code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                maxLength={6}
                            />
                            <Button 
                                onClick={verifyCode} 
                                disabled={loading}
                                variant="outline"
                                className="w-full"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                Verify Code
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Custom Message Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Custom Message
                        </CardTitle>
                        <CardDescription>
                            Send personalized messages to patients
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <Input
                                type="tel"
                                placeholder="+639123456789"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Message Type
                            </label>
                            <Select value={messageType} onValueChange={setMessageType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="custom">Custom Message</SelectItem>
                                    <SelectItem value="appointment_reminder">Appointment Reminder</SelectItem>
                                    <SelectItem value="health_advisory">Health Advisory</SelectItem>
                                    <SelectItem value="test">Test Message</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <Textarea
                                placeholder="Enter your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Button 
                                onClick={sendCustomMessage} 
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                Send Custom Message
                            </Button>
                            
                            <Button 
                                onClick={sendTestSMS} 
                                disabled={loading}
                                variant="outline"
                                className="w-full"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                Send Test SMS
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Result Display */}
            {result && (
                <Card>
                    <CardContent className="pt-6">
                        <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                            <div className="flex items-center gap-2">
                                {result.success ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                )}
                                <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                                    <strong>{result.success ? 'Success' : 'Error'}:</strong> {result.message}
                                    {result.provider && (
                                        <span className="block text-sm mt-1">
                                            Provider: {result.provider}
                                        </span>
                                    )}
                                </AlertDescription>
                            </div>
                        </Alert>
                    </CardContent>
                </Card>
            )}

            {/* Quick Examples */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Examples</CardTitle>
                    <CardDescription>
                        Pre-filled examples for testing different message types
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">Appointment Reminder</h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setMessageType('appointment_reminder');
                                    setMessage('Reminder: You have an appointment tomorrow at 2:00 PM with Dr. Juan Dela Cruz. Reference: APT-20240115-0001');
                                }}
                            >
                                Load Example
                            </Button>
                        </div>
                        
                        <div className="space-y-2">
                            <h4 className="font-medium">Health Advisory</h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setMessageType('health_advisory');
                                    setMessage('Important: Please visit the health center for your annual check-up. Call (083) 554-0146 to schedule.');
                                }}
                            >
                                Load Example
                            </Button>
                        </div>
                        
                        <div className="space-y-2">
                            <h4 className="font-medium">Test Message</h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setMessageType('test');
                                    setMessage('Test message from Calumpang RHU SMS API. This is a test to verify SMS functionality.');
                                }}
                            >
                                Load Example
                            </Button>
                        </div>
                        
                        <div className="space-y-2">
                            <h4 className="font-medium">Custom Message</h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setMessageType('custom');
                                    setMessage('Your test results are ready for pickup. Please visit the health center during office hours.');
                                }}
                            >
                                Load Example
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SMSTestComponent;
