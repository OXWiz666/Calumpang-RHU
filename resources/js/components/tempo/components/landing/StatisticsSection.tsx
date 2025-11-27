import React, { useState, useEffect, useRef } from 'react';
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
import { motion, useInView, useSpring, useMotionValue, useTransform } from 'framer-motion';

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

const AnimatedCounter = ({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = `${prefix}${Math.floor(latest).toLocaleString()}${suffix}`;
            }
        });
    }, [springValue, prefix, suffix]);

    return <span ref={ref} />;
};

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
    // Parse the number string to a number for the counter
    const numericValue = parseInt(number.replace(/,/g, ''), 10);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: delay * 0.001 }} // Convert delay to seconds
            className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
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
                    <AnimatedCounter value={numericValue} prefix={prefix} suffix={suffix} />
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
                <div className="mt-6 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                            width: label.includes('Population') ? '100%' :
                                label.includes('Consultations') ? '85%' :
                                    label.includes('Immunization') ? '95%' :
                                        label.includes('Prenatal') ? '100%' :
                                            label.includes('Hours') ? '75%' :
                                                label.includes('Years') ? '90%' : '100%'
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className={`h-full rounded-full bg-gradient-to-r from-gray-500 to-gray-600`}
                    ></motion.div>
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        </motion.div>
    );
};

const StatisticsSection: React.FC = () => {
    const stats = [
        {
            icon: Users,
            number: "2,847",
            label: "Total Population Served",
            description: "Residents of Barangay Calumpang benefiting from our health services",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
            delay: 0
        },
        {
            icon: Calendar,
            number: "1,200",
            label: "Monthly Consultations",
            description: "Average number of patient consultations per month",
            color: "from-teal-500 to-teal-600",
            bgColor: "bg-teal-50",
            iconColor: "text-teal-600",
            delay: 100
        },
        {
            icon: Heart,
            number: "95",
            label: "Immunization Coverage",
            description: "Percentage of children fully immunized in the barangay",
            color: "from-rose-500 to-rose-600",
            bgColor: "bg-rose-50",
            iconColor: "text-rose-600",
            delay: 200,
            suffix: "%"
        },
        {
            icon: Shield,
            number: "100",
            label: "Prenatal Care Coverage",
            description: "Percentage of pregnant women receiving prenatal care",
            color: "from-indigo-500 to-indigo-600",
            bgColor: "bg-indigo-50",
            iconColor: "text-indigo-600",
            delay: 300,
            suffix: "%"
        },
        {
            icon: Clock,
            number: "8",
            label: "Hours Daily Service",
            description: "Operating hours for health services (8 AM - 5 PM)",
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            iconColor: "text-orange-600",
            delay: 400,
            suffix: " hrs"
        },
        {
            icon: Award,
            number: "15",
            label: "Years of Service",
            description: "Years of dedicated healthcare service to the community",
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
            delay: 500,
            suffix: "+"
        }
    ];

    return (
        <section className="py-24 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-800 rounded-full text-sm font-medium mb-6 border border-teal-100">
                        <TrendingUp className="w-4 h-4 mr-2 text-teal-600" />
                        Our Impact
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
                        Numbers That Speak for Themselves
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Discover the measurable impact of our digital healthcare system on the Barangay Calumpang community
                        through key performance indicators and success metrics.
                    </p>
                </motion.div>

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
