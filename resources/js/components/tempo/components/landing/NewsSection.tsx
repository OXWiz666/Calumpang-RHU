import React, { useState, useEffect } from 'react';
import { 
    Calendar, 
    Clock, 
    User, 
    ArrowRight, 
    AlertCircle, 
    Users,
    FileText,
    ExternalLink,
    ChevronRight,
    ChevronLeft,
    Bell,
    Heart,
    Shield,
    TrendingUp
} from 'lucide-react';

interface NewsItem {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    category: string;
    imageUrl: string;
    isImportant: boolean;
    readTime: string;
    tags: string[];
}

interface NewsSectionProps {
    title?: string;
    subtitle?: string;
}

const NewsCard: React.FC<{ news: NewsItem; index: number }> = ({ news, index }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), index * 200);
        return () => clearTimeout(timer);
    }, [index]);

    const getCategoryColor = (category: string) => {
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <article 
            className={`group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${news.isImportant ? 'ring-4 ring-red-200' : ''}`}
        >
            {/* Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                        {news.category}
                    </span>
                </div>

                {/* Important Badge */}
                {news.isImportant && (
                    <div className="absolute top-4 right-4">
                        <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Important
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {news.author}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {news.readTime}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {news.date}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {news.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {news.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {news.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Read More Button */}
                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                    Read More
                    <ArrowRight className="ml-1 w-4 h-4" />
                </button>
            </div>
        </article>
    );
};

const NewsSection: React.FC<NewsSectionProps> = ({ 
    title = "Health Updates & Announcements", 
    subtitle = "Stay informed with the latest news and updates from Calumpang Rural Health Unit"
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const newsData: NewsItem[] = [
        {
            id: 1,
            title: "New Vaccination Program for Children Under 5",
            excerpt: "We're launching a comprehensive vaccination program for children under 5 years old. This includes routine immunizations and additional protection against common childhood diseases.",
            content: "Full content about the vaccination program...",
            author: "Dr. Maria Santos",
            date: "Dec 15, 2024",
            category: "Vaccination",
            imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=500&h=300&fit=crop",
            isImportant: true,
            readTime: "3 min read",
            tags: ["vaccination", "children", "health", "immunization"]
        },
        {
            id: 2,
            title: "Digital Health Records System Upgrade",
            excerpt: "Our digital health records system has been upgraded with enhanced security features and improved user interface. All patient data is now more secure and accessible.",
            content: "Full content about the system upgrade...",
            author: "IT Department",
            date: "Dec 12, 2024",
            category: "Announcement",
            imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
            isImportant: false,
            readTime: "2 min read",
            tags: ["technology", "security", "upgrade", "digital"]
        },
        {
            id: 3,
            title: "Free Health Check-up for Senior Citizens",
            excerpt: "We're offering free comprehensive health check-ups for all senior citizens in Barangay Calumpang. This includes blood pressure, blood sugar, and general health assessments.",
            content: "Full content about the health check-up program...",
            author: "Community Health Team",
            date: "Dec 10, 2024",
            category: "Program",
            imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=300&fit=crop",
            isImportant: false,
            readTime: "4 min read",
            tags: ["senior citizens", "free check-up", "community", "health"]
        },
        {
            id: 4,
            title: "Emergency Contact Numbers Updated",
            excerpt: "Please note that our emergency contact numbers have been updated. Save the new numbers for faster response during medical emergencies.",
            content: "Full content about emergency contacts...",
            author: "Emergency Response Team",
            date: "Dec 8, 2024",
            category: "Emergency",
            imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop",
            isImportant: true,
            readTime: "1 min read",
            tags: ["emergency", "contact", "urgent", "response"]
        },
        {
            id: 5,
            title: "Mental Health Awareness Program",
            excerpt: "Join our mental health awareness program designed to help community members understand and manage stress, anxiety, and other mental health concerns.",
            content: "Full content about mental health program...",
            author: "Mental Health Team",
            date: "Dec 5, 2024",
            category: "Health Update",
            imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
            isImportant: false,
            readTime: "5 min read",
            tags: ["mental health", "awareness", "wellness", "support"]
        },
        {
            id: 6,
            title: "Mobile Health Unit Schedule",
            excerpt: "Our mobile health unit will be visiting different areas of Barangay Calumpang. Check the schedule to see when we'll be in your neighborhood.",
            content: "Full content about mobile health unit...",
            author: "Mobile Health Team",
            date: "Dec 3, 2024",
            category: "Announcement",
            imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&h=300&fit=crop",
            isImportant: false,
            readTime: "2 min read",
            tags: ["mobile unit", "schedule", "community", "visit"]
        }
    ];

    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    const currentNews = newsData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <section className="py-20 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-6">
                        <Bell className="w-4 h-4 mr-2" />
                        Latest News
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Important Announcements */}
                <div className={`mb-16 transition-all duration-1000 delay-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8">
                        <div className="flex items-start space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-2xl flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Important Health Alert
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    We're currently experiencing high demand for vaccination services. Please book your appointments 
                                    in advance to avoid long wait times. Emergency services remain available 24/7.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                        High Priority
                                    </span>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                        Updated Dec 15, 2024
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {currentNews.map((news, index) => (
                        <NewsCard key={news.id} news={news} index={index} />
                    ))}
                </div>

                {/* Pagination */}
                <div className={`flex items-center justify-center space-x-4 mb-16 transition-all duration-1000 delay-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <button
                        onClick={prevPage}
                        className="flex items-center justify-center w-12 h-12 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                                    currentPage === i
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        onClick={nextPage}
                        className="flex items-center justify-center w-12 h-12 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default NewsSection;
