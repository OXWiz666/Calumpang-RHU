import React, { useState, useEffect } from 'react';
import {
    Smartphone,
    Shield,
    Clock,
    Users,
    FileText,
    Bell,
    Search,
    Download,
    Upload,
    Eye,
    Lock,
    Zap,
    CheckCircle,
    ArrowRight,
    Star,
    Globe,
    Wifi
} from 'lucide-react';

interface FeatureCardProps {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    features: string[];
    color: string;
    bgColor: string;
    iconColor: string;
    delay: number;
    isHighlighted?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    icon: Icon,
    title,
    description,
    features,
    color,
    bgColor,
    iconColor,
    delay,
    isHighlighted = false
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${isHighlighted ? 'ring-4 ring-teal-200 scale-105' : ''}`}
        >
            {/* Background Pattern */}
            <div className={`absolute inset-0 ${bgColor} opacity-5`}></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

            {/* Highlight Badge */}
            {isHighlighted && (
                <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                    </div>
                </div>
            )}

            <div className="relative z-10 p-8">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                    {description}
                </p>

                {/* Features List */}
                <div className="space-y-3">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        </div>
    );
};

const FeaturesSection: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const features = [
        {
            icon: Smartphone,
            title: "Mobile-First Design",
            description: "Access all healthcare services from any device with our responsive, mobile-optimized interface.",
            features: [
                "Responsive Design",
                "Touch-Friendly Interface",
                "Offline Capability",
                "Push Notifications"
            ],
            color: "from-teal-500 to-teal-600",
            bgColor: "bg-teal-50",
            iconColor: "text-teal-600",
            delay: 200
        },
        {
            icon: Shield,
            title: "Advanced Security",
            description: "Bank-level encryption and security measures to protect your personal health information.",
            features: [
                "End-to-End Encryption",
                "Two-Factor Authentication",
                "Regular Security Audits",
                "HIPAA Compliance"
            ],
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
            delay: 400
        },
        {
            icon: Clock,
            title: "Real-Time Updates",
            description: "Get instant notifications and updates about your appointments, health records, and important announcements.",
            features: [
                "Instant Notifications",
                "Real-Time Status Updates",
                "Automated Reminders",
                "Live Chat Support"
            ],
            color: "from-teal-500 to-teal-600",
            bgColor: "bg-teal-50",
            iconColor: "text-teal-600",
            delay: 600
        },
        {
            icon: Users,
            title: "Multi-User Support",
            description: "Manage family health records and appointments for multiple family members from a single account.",
            features: [
                "Family Account Management",
                "Guardian Access",
                "Child Health Tracking",
                "Elderly Care Support"
            ],
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
            delay: 800
        },
        {
            icon: FileText,
            title: "Digital Records",
            description: "Complete digital transformation of health records with easy access and sharing capabilities.",
            features: [
                "Digital Health History",
                "Prescription Management",
                "Lab Results Access",
                "Document Sharing"
            ],
            color: "from-teal-500 to-teal-600",
            bgColor: "bg-teal-50",
            iconColor: "text-teal-600",
            delay: 1000
        },
        {
            icon: Search,
            title: "Smart Search",
            description: "Find information quickly with our intelligent search system that understands medical terminology.",
            features: [
                "Medical Term Search",
                "Symptom Checker",
                "Doctor Finder",
                "Service Locator"
            ],
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
            delay: 1200,
            isHighlighted: true
        }
    ];

    const capabilities = [
        {
            icon: Globe,
            title: "24/7 Accessibility",
            description: "Access your health information anytime, anywhere"
        },
        {
            icon: Wifi,
            title: "Offline Mode",
            description: "Continue using the app even without internet connection"
        },
        {
            icon: Download,
            title: "Export Data",
            description: "Download your health records in multiple formats"
        },
        {
            icon: Upload,
            title: "Easy Import",
            description: "Import existing health records from other systems"
        },
        {
            icon: Eye,
            title: "Privacy Controls",
            description: "Granular control over who can access your information"
        },
        {
            icon: Lock,
            title: "Secure Backup",
            description: "Automatic backup of your data with encryption"
        }
    ];

    return (
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-white via-teal-50 to-slate-100">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium mb-6">
                        <Zap className="w-4 h-4 mr-2" />
                        Advanced Features
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-teal-900 to-gray-900 bg-clip-text text-transparent">
                        Powerful Features for Modern Healthcare
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Experience the next generation of digital healthcare with our comprehensive suite of features
                        designed to make healthcare management simple, secure, and efficient.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>

                {/* Capabilities Section */}
                <div className={`bg-gradient-to-r from-slate-900 to-teal-900 rounded-3xl p-12 text-white transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">
                            Additional Capabilities
                        </h3>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Discover the comprehensive range of capabilities that make our system the preferred choice
                            for digital healthcare management.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {capabilities.map((capability, index) => {
                            const Icon = capability.icon;
                            return (
                                <div key={index} className="text-center group">
                                    <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">{capability.title}</h4>
                                    <p className="text-gray-300 text-sm">{capability.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Technology Stack */}
                <div className={`mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Built with Modern Technology
                            </h3>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Our system is built using cutting-edge technologies to ensure reliability,
                                security, and optimal performance.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-teal-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-teal-600">R</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">React</div>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-emerald-600">L</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">Laravel</div>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-teal-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-teal-600">T</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">TypeScript</div>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-emerald-600">M</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">MySQL</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4">
                            Ready to Experience These Features?
                        </h3>
                        <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
                            Start using our advanced digital healthcare system today and discover how these
                            powerful features can transform your healthcare experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#services"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-teal-600 rounded-xl hover:bg-teal-50 hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                                Explore Features
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </a>
                            <a
                                href="#contact"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300"
                            >
                                Get Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
