import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/tempo/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/tempo/components/ui/avatar";
import { Badge } from "@/components/tempo/components/ui/badge";
import { Button } from "@/components/tempo/components/ui/button";
import { Separator } from "@/components/tempo/components/ui/separator";
import { ScrollArea } from "@/components/tempo/components/ui/scroll-area";
import {
    Check,
    Clock,
    FileText,
    MessageSquare,
    Package,
    User,
    AlertTriangle,
    Calendar,
    Pill,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Activity,
    RefreshCw,
    Eye,
    ExternalLink,
    Zap,
    Star,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Timer,
    Users,
    ShoppingCart,
    Stethoscope,
    Heart,
    Shield,
    Bell,
    Sparkles
} from "lucide-react";

// utils/formatTime.js
import moment from "moment";
import PrimaryButton from "@/components/PrimaryButton";
import Reschedule from "@/Pages/Authenticated/Admin/partials/Reschedule";

const getActivityIcon = (type, status) => {
    const iconProps = { className: "h-5 w-5" };
    
    switch (type) {
        case "patient":
        case "user":
            return <Users {...iconProps} className="h-5 w-5 text-blue-500" />;
        case "appointment":
            return <Calendar {...iconProps} className="h-5 w-5 text-purple-500" />;
        case "inventory":
            return <Package {...iconProps} className="h-5 w-5 text-green-500" />;
        case "prescription":
            return <Pill {...iconProps} className="h-5 w-5 text-orange-500" />;
        case "message":
            return <MessageSquare {...iconProps} className="h-5 w-5 text-indigo-500" />;
        case "alert":
            return <AlertTriangle {...iconProps} className="h-5 w-5 text-red-500" />;
        case "program":
            return <Heart {...iconProps} className="h-5 w-5 text-pink-500" />;
        default:
            return <Activity {...iconProps} className="h-5 w-5 text-gray-500" />;
    }
};

const getStatusBadge = (status, priority) => {
    if (!status) return null;

    const baseClasses = "text-xs font-medium px-2 py-1 rounded-full";
    
    switch (status) {
        case "success":
        case "completed":
        case "dispensed":
            return (
                <Badge className={`${baseClasses} bg-green-100 text-green-800 border-green-200`}>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                </Badge>
            );
        case "pending":
            return (
                <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`}>
                    <Timer className="h-3 w-3 mr-1" />
                    Pending
                </Badge>
            );
        case "confirmed":
            return (
                <Badge className={`${baseClasses} bg-blue-100 text-blue-800 border-blue-200`}>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Confirmed
                </Badge>
            );
        case "cancelled":
            return (
                <Badge className={`${baseClasses} bg-red-100 text-red-800 border-red-200`}>
                    <XCircle className="h-3 w-3 mr-1" />
                    Cancelled
                </Badge>
            );
        case "warning":
            return (
                <Badge className={`${baseClasses} bg-orange-100 text-orange-800 border-orange-200`}>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Warning
                </Badge>
            );
        case "error":
            return (
                <Badge className={`${baseClasses} bg-red-100 text-red-800 border-red-200`}>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Alert
                </Badge>
            );
        default:
            return (
                <Badge className={`${baseClasses} bg-gray-100 text-gray-800 border-gray-200`}>
                    <Activity className="h-3 w-3 mr-1" />
                    Active
                </Badge>
            );
    }
};

const getPriorityIndicator = (priority) => {
    switch (priority) {
        case "high":
            return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />;
        case "medium":
            return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
        case "low":
            return <div className="w-2 h-2 bg-green-500 rounded-full" />;
        default:
            return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
};

const getActivityColorClasses = (type, color) => {
    const colorMap = {
        'blue': 'bg-blue-50 border-blue-200 hover:bg-blue-100',
        'green': 'bg-green-50 border-green-200 hover:bg-green-100',
        'purple': 'bg-purple-50 border-purple-200 hover:bg-purple-100',
        'orange': 'bg-orange-50 border-orange-200 hover:bg-orange-100',
        'red': 'bg-red-50 border-red-200 hover:bg-red-100',
        'yellow': 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
        'emerald': 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
        'pink': 'bg-pink-50 border-pink-200 hover:bg-pink-100'
    };
    
    return colorMap[color] || 'bg-gray-50 border-gray-200 hover:bg-gray-100';
};

const ActivityFeed = ({
    activities = [],
    title = "Recent Activities",
    maxItems = 10,
}) => {
    const displayActivities = activities.slice(0, maxItems);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        console.log('ActivityFeed - Activities received:', activities);
        console.log('ActivityFeed - Display activities:', displayActivities);
        if (displayActivities && displayActivities.length > 0) {
            console.log('First activity sample:', displayActivities[0]);
        }
    }, [activities, displayActivities]);

    const [isOpen, setIsOpen] = useState(false);
    const [appointDatas, setAppointDatas] = useState({});

    const openModal = (data) => {
        setIsOpen(true);
        setAppointDatas(data);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate refresh
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    const handleActivityClick = (activity) => {
        if (activity.action_url) {
            window.open(activity.action_url, '_blank');
        }
    };

    return (
        <Card className="w-full bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/20">
                            <Activity className="h-6 w-6" />
                        </div>
                        {title}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="text-white hover:bg-white/20"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                        <div className="flex items-center gap-2 text-white/80">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-sm font-medium">Live</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[500px] w-full">
                    <div className="p-6 space-y-4">
                        {displayActivities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="p-4 rounded-full bg-gray-100 mb-4">
                                    <Activity className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recent Activities</h3>
                                <p className="text-sm text-gray-500">Activities will appear here as they happen</p>
                            </div>
                        ) : (
                            displayActivities.map((activity, i) => {
                                // Fallback data if activity structure is incomplete
                                const safeActivity = {
                                    id: activity.id || `activity_${i}`,
                                    type: activity.type || 'default',
                                    title: activity.title || 'System Activity',
                                    description: activity.description || 'Activity occurred in the system',
                                    timestamp: activity.timestamp || new Date(),
                                    icon: activity.icon || 'Activity',
                                    status: activity.status || 'completed',
                                    color: activity.color || 'blue',
                                    priority: activity.priority || 'low',
                                    action_url: activity.action_url || null,
                                    action_text: activity.action_text || null,
                                    badge_text: activity.badge_text || null,
                                    time_ago: activity.time_ago || moment(activity.timestamp).fromNow()
                                };

                                return (
                                    <div 
                                        key={safeActivity.id} 
                                        className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${getActivityColorClasses(safeActivity.type, safeActivity.color)}`}
                                        onClick={() => handleActivityClick(safeActivity)}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon with priority indicator */}
                                            <div className="relative">
                                                <div className="p-3 rounded-xl bg-white shadow-sm border">
                                                    {getActivityIcon(safeActivity.type, safeActivity.status)}
                                                </div>
                                                {safeActivity.priority && (
                                                    <div className="absolute -top-1 -right-1">
                                                        {getPriorityIndicator(safeActivity.priority)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                            {safeActivity.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {safeActivity.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        {getStatusBadge(safeActivity.status, safeActivity.priority)}
                                                        {safeActivity.badge_text && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {safeActivity.badge_text}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{safeActivity.time_ago}</span>
                                                    </div>
                                                    
                                                    {safeActivity.action_text && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-xs h-7 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleActivityClick(safeActivity);
                                                            }}
                                                        >
                                                            {safeActivity.action_text}
                                                            <ArrowRight className="h-3 w-3 ml-1" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover effect line */}
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </CardContent>

            {/* Footer */}
            {displayActivities.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            <span>Showing {displayActivities.length} recent activities</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => window.open('/admin/activities', '_blank')}
                        >
                            View All
                            <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            <Reschedule 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                appointmentData={appointDatas} 
            />
        </Card>
    );
};

export default ActivityFeed;