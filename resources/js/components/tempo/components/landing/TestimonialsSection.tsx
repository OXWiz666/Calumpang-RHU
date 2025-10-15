import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Star, Quote, Heart, Users, Award, ThumbsUp } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Testimonial {
    quote: string;
    name: string;
    role?: string;
    imageUrl?: string;
    rating: number;
    category: string;
    highlight: string;
}

interface TestimonialSliderProps {
    title: string;
    subtitle: string;
    testimonials: Testimonial[];
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
    title,
    subtitle,
    testimonials,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Import Swiper styles dynamically
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
        document.head.appendChild(link);

        const timer = setTimeout(() => setIsVisible(true), 200);
        return () => {
            document.head.removeChild(link);
            clearTimeout(timer);
        };
    }, []);

    const testimonialData = [
        {
            quote: "The online appointment system has completely transformed my healthcare experience. I can book appointments at any time, and the reminders help me stay on top of my health checkups. No more waiting in long lines!",
            name: "Renz Emilanan",
            role: "Barangay Resident",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Renz",
            rating: 5,
            category: "Appointment Booking",
            highlight: "Time-saving"
        },
        {
            quote: "As a senior citizen, I was initially hesitant about using digital systems. But the staff at Calumpang RHU patiently taught me how to access my medical records online. Now I can view my health history anytime!",
            name: "Vincent Ermac",
            role: "Senior Citizen",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vincent",
            rating: 5,
            category: "Medical Records",
            highlight: "User-friendly"
        },
        {
            quote: "Managing my children's vaccination schedules has never been easier. The system sends me timely reminders, and I can track their complete immunization history. It gives me peace of mind as a mother.",
            name: "Jude Lesmoras",
            role: "Mother of Three",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jude",
            rating: 5,
            category: "Vaccination Tracking",
            highlight: "Peace of mind"
        },
        {
            quote: "This digital system has revolutionized how we deliver healthcare in our community. We can now serve more residents efficiently and provide better follow-up care. The impact has been remarkable!",
            name: "Abdul Jabbar Lim Mohammad",
            role: "Community Health Worker",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdul",
            rating: 5,
            category: "Healthcare Delivery",
            highlight: "Efficient"
        },
        {
            quote: "The security of my personal health information was my biggest concern. But after using the system, I'm confident that my data is safe. The encryption and security measures are top-notch!",
            name: "Maria Santos",
            role: "Local Business Owner",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
            rating: 5,
            category: "Data Security",
            highlight: "Secure"
        },
        {
            quote: "I love how I can access my medical records from anywhere. When I travel for work, I can still show my health history to doctors in other cities. It's incredibly convenient!",
            name: "Carlos Rodriguez",
            role: "OFW",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
            rating: 5,
            category: "Accessibility",
            highlight: "Convenient"
        }
    ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
            />
        ));
    };

    return (
        <section className="w-full py-20 bg-white">
            <style jsx>{`
                .swiper {
                    padding: 20px 60px 80px 60px !important;
                    position: relative;
                }
                .swiper-pagination {
                    bottom: 20px !important;
                }
                .swiper-pagination-bullet {
                    width: 12px;
                    height: 12px;
                    background: #cbd5e1;
                    opacity: 1;
                    margin: 0 8px !important;
                    transition: all 0.3s ease;
                }
                  .swiper-pagination-bullet-active {
                      background: linear-gradient(135deg, #6b7280, #374151);
                      transform: scale(1.3);
                  }
                  .custom-button {
                      width: 50px !important;
                      height: 50px !important;
                      background: linear-gradient(135deg, #6b7280, #374151) !important;
                      border-radius: 50% !important;
                      color: white !important;
                      display: flex !important;
                      align-items: center !important;
                      justify-content: center !important;
                      cursor: pointer !important;
                      transition: all 0.3s ease !important;
                      position: absolute !important;
                      top: 50% !important;
                      transform: translateY(-50%) !important;
                      z-index: 10 !important;
                      box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3) !important;
                  }
                .swiper-button-prev {
                    left: 10px !important;
                }
                .swiper-button-next {
                    right: 10px !important;
                }
                .custom-button:hover {
                    transform: translateY(-50%) scale(1.1) !important;
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
                }
                .custom-button::after {
                    font-size: 18px !important;
                    color: white !important;
                    font-weight: bold !important;
                }
            `}</style>

            <div className="container mx-auto px-4">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-6">
                        <Heart className="w-4 h-4 mr-2" />
                        Community Voices
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Statistics */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4">
                            <Users className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">2,847</div>
                        <div className="text-gray-600 mb-4">Residents Served</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="h-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4">
                            <Award className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
                        <div className="text-gray-600 mb-4">Prenatal Coverage</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="h-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4">
                            <ThumbsUp className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">4.8/5</div>
                        <div className="text-gray-600 mb-4">Community Rating</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="h-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600" style={{ width: '96%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Slider */}
                <div className="max-w-6xl mx-auto relative">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        pagination={{ clickable: true }}
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="testimonialSwiper"
                    >
                        {testimonialData.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                    {/* Quote Icon */}
                                    <div className="absolute top-6 right-6 text-gray-100 group-hover:text-gray-200 transition-colors duration-300">
                                        <Quote className="w-8 h-8" />
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-8 relative">
                                        {/* Rating */}
                                        <div className="flex items-center mb-4">
                                            {renderStars(testimonial.rating)}
                                        </div>

                                        {/* Category Badge */}
                                        <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium mb-4">
                                            {testimonial.category}
                                        </div>

                                        {/* Quote */}
                                        <p className="text-gray-700 mb-6 leading-relaxed text-base">
                                            "{testimonial.quote}"
                                        </p>

                                        {/* Highlight */}
                                        <div className="bg-gray-50 rounded-lg p-3 mb-6">
                                            <div className="text-sm font-medium text-gray-900 mb-1">Key Benefit:</div>
                                            <div className="text-sm text-gray-600">{testimonial.highlight}</div>
                                        </div>

                                        {/* Author */}
                                        <div className="flex items-center">
                                            <img
                                                src={testimonial.imageUrl}
                                                alt={testimonial.name}
                                                className="w-14 h-14 rounded-full mr-4 border-2 border-gray-200"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-lg">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Effect Overlay */}
                                    <div className="absolute inset-0 bg-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </SwiperSlide>
                        ))}

                        {/* Pagination dots */}
                        <div className="swiper-pagination"></div>

                        {/* Navigation buttons */}
                        <button className="swiper-button-prev custom-button"></button>
                        <button className="swiper-button-next custom-button"></button>
                    </Swiper>
                </div>

            </div>
        </section>
    );
};

export default TestimonialSlider;
