import React, { useState, useEffect } from 'react';
import { Clock, Shield, Heart, CheckCircle, TrendingUp, Users, Award, Zap } from 'lucide-react';

interface BenefitProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  stat: string;
  color: string;
  bgColor: string;
  iconColor: string;
  delay: number;
}

const BenefitCard: React.FC<BenefitProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  stat, 
  color, 
  bgColor, 
  iconColor, 
  delay 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      const targetCount = parseInt(stat.replace(/[^\d]/g, ''));
      const increment = targetCount / 50;
      const timer = setInterval(() => {
        setCount(prev => {
          if (prev >= targetCount) {
            clearInterval(timer);
            return targetCount;
          }
          return Math.min(prev + increment, targetCount);
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isVisible, stat]);

  return (
    <div 
      className={`group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-3 ${
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

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6">
          {description}
        </p>

          {/* Stat */}
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-gray-900">
              {stat.includes('%') ? `${Math.floor(count)}%` : 
               stat.includes('+') ? `${Math.floor(count)}+` : 
               stat.includes('hr') ? `${Math.floor(count)}hr` : 
               stat.includes('min') ? `${Math.floor(count)} min` :
               stat.includes('/') ? stat :
               Math.floor(count)}
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Achievement
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 transition-all duration-1000 ease-out`}
              style={{ 
                width: isVisible ? 
                  (stat.includes('%') ? `${Math.min(Math.floor(count), 100)}%` :
                   stat.includes('min') ? '85%' :
                   stat.includes('+') ? '95%' :
                   stat.includes('/') ? '90%' : '100%') : '0%' 
              }}
            ></div>
          </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
    </div>
  );
};

const BenefitsSection: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const benefits = [
    {
      icon: Clock,
      title: "Quick Service Delivery",
      description: "Average consultation time reduced to 15 minutes with our efficient digital appointment system.",
      stat: "15 min",
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      delay: 200
    },
    {
      icon: Shield,
      title: "Community Health Security",
      description: "100% immunization coverage and zero maternal deaths maintained in our barangay.",
      stat: "100%",
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      delay: 400
    },
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Serving 2,847 residents with personalized healthcare services and community health programs.",
      stat: "2,847",
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      delay: 600
    },
    {
      icon: CheckCircle,
      title: "Proven Excellence",
      description: "15+ years of dedicated service with 4.8/5 community satisfaction rating.",
      stat: "4.8/5",
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      delay: 800
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
            <Award className="w-4 h-4 mr-2" />
            Proven Benefits
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Why Choose Our Digital Healthcare System?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover how our innovative digital healthcare system transforms the way Barangay Calumpang residents 
            access and manage their health services.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>


      </div>
    </section>
  );
};

export default BenefitsSection;
