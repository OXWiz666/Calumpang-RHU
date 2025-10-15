import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Calendar, 
    Shield, 
    Clock, 
    TrendingUp, 
    Award, 
    Heart, 
    Zap,
    CheckCircle,
    Star,
    Activity,
    Globe
} from 'lucide-react';

interface StatCardProps {
    icon: React.ComponentType<any>;
    number: string;
    label: string;
    description: string;
    color: string;
    bgColor: string;
    iconColor: string;
    delay: number;
    suffix?: string;
    prefix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
    icon: Icon, 
    number, 
    label, 
    description, 
    color, 
    bgColor, 
    iconColor, 
    delay,
    suffix = '',
    prefix = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (isVisible) {
            const targetCount = parseInt(number.replace(/[^\d]/g, ''));
            const increment = targetCount / 60;
            const timer = setInterval(() => {
                setCount(prev => {
                    if (prev >= targetCount) {
                        clearInterval(timer);
                        return targetCount;
                    }
                    return Math.min(prev + increment, targetCount);
                });
            }, 20);
            return () => clearInterval(timer);
        }
    }, [isVisible, number]);

    return (
        <div 
            className={`group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            {/* Background Pattern */}
            <div className={`absolute inset-0 ${bgColor} opacity-5`}></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="relative z-10 p-8">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${iconColor}`} />
                </div>

                {/* Number */}
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors duration-300">
                    {prefix}{Math.floor(count)}{suffix}
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-gray-700 mb-3">
                    {label}
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm">
                    {description}
                </p>

                {/* Progress Bar */}
                <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 transition-all duration-1000 ease-out`}
                        style={{ 
                            width: isVisible ? 
                                (label.includes('Population') ? '100%' :
                                 label.includes('Consultations') ? '85%' :
                                 label.includes('Immunization') ? '95%' :
                                 label.includes('Prenatal') ? '100%' :
                                 label.includes('Hours') ? '75%' :
                                 label.includes('Years') ? '90%' : '100%') : '0%' 
                        }}
                    ></div>
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        </div>
    );
};

const StatisticsSection: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const stats = [
        {
            icon: Users,
            number: "2,847",
            label: "Total Population Served",
            description: "Residents of Barangay Calumpang benefiting from our health services",
            color: "from-gray-500 to-gray-600",
            bgColor: "bg-gray-50",
            iconColor: "text-gray-600",
            delay: 200
        },
        {
            icon: Calendar,
            number: "1,200",
            label: "Monthly Consultations",
            description: "Average number of patient consultations per month",
            color: "from-gray-500 to-gray-600",
            bgColor: "bg-gray-50",
            iconColor: "text-gray-600",
            delay: 400
        },
        {
            icon: Heart,
            number: "95",
            label: "Immunization Coverage",
            description: "Percentage of children fully immunized in the barangay",
            color: "from-gray-500 to-gray-600",
            bgColor: "bg-gray-50",
            iconColor: "text-gray-600",
            delay: 600,
            suffix: "%"
        },
        {
            icon: Shield,
            number: "100",
            label: "Prenatal Care Coverage",
            description: "Percentage of pregnant women receiving prenatal care",
            color: "from-gray-500 to-gray-600",
            bgColor: "bg-gray-50",
            iconColor: "text-gray-600",
            delay: 800,
            suffix: "%"
        },
        {
            icon: Clock,
            number: "8",
            label: "Hours Daily Service",
            description: "Operating hours for health services (8 AM - 5 PM)",
            color: "from-gray-500 to-gray-600",
            bgColor: "bg-gray-50",
            iconColor: "text-gray-600",
            delay: 1000,
            suffix: " hrs"
        },
        {
            icon: Award,
            number: "15",
            label: "Years of Service",
            description: "Years of dedicated healthcare service to the community",
            color: "from-gray-500 to-gray-600",
            bgColor: "bg-gray-50",
            iconColor: "text-gray-600",
            delay: 1200,
            suffix: "+"
        }
    ];

    const achievements = [
        {
            icon: CheckCircle,
            title: "Zero Maternal Deaths",
            description: "Maintained zero maternal mortality rate in the barangay",
            color: "text-gray-600"
        },
        {
            icon: Star,
            title: "4.8/5 Rating",
            description: "High patient satisfaction from community feedback",
            color: "text-gray-600"
        },
        {
            icon: Activity,
            title: "98% Health Coverage",
            description: "Comprehensive health service coverage for residents",
            color: "text-gray-600"
        },
        {
            icon: Globe,
            title: "Community Health",
            description: "Active participation in community health programs",
            color: "text-gray-600"
        }
    ];

    return (
        <section className="py-20 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-6">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Our Impact
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        Numbers That Speak for Themselves
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Discover the measurable impact of our digital healthcare system on the Barangay Calumpang community 
                        through key performance indicators and success metrics.
                    </p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>


            </div>
        </section>
    );
};

export default StatisticsSection;
