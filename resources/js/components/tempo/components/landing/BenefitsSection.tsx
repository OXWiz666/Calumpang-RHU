import React, { useState, useEffect, useRef } from 'react';
import { Clock, Shield, Heart, CheckCircle, TrendingUp, Users, Star, Zap } from 'lucide-react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';

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
        // Format logic to handle decimals if needed, here assuming integers mostly
        const formatted = Math.floor(latest).toLocaleString();
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix]);

  return <span ref={ref} />;
};

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
  // Extract number from stat string for animation
  const numericValue = parseFloat(stat.replace(/[^\d.]/g, '')) || 0;
  const suffix = stat.replace(/[\d.,]/g, '').trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay * 0.001 }}
      className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
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
            <AnimatedCounter value={numericValue} suffix={suffix} />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Achievement
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{
              width: stat.includes('%') ? `${Math.min(numericValue, 100)}%` :
                stat.includes('min') ? '85%' :
                  stat.includes('+') ? '95%' :
                    stat.includes('/') ? '90%' : '100%'
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

const BenefitsSection: React.FC<{ title?: string; subtitle?: string }> = ({
  title = "Why Choose Our Digital Healthcare System?",
  subtitle = "Discover how our innovative digital healthcare system transforms the way Barangay Calumpang residents access and manage their health services."
}) => {
  const benefits = [
    {
      icon: Clock,
      title: "Quick Service Delivery",
      description: "Average consultation time reduced to 15 minutes with our efficient digital appointment system.",
      stat: "15 min",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      delay: 0
    },
    {
      icon: Shield,
      title: "Community Health Security",
      description: "100% immunization coverage and zero maternal deaths maintained in our barangay.",
      stat: "100%",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
      delay: 100
    },
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Serving 2,847 residents with personalized healthcare services and community health programs.",
      stat: "2,847",
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      delay: 200
    },
    {
      icon: CheckCircle,
      title: "Proven Excellence",
      description: "15+ years of dedicated service with 4/5 community satisfaction rating.",
      stat: "4",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      delay: 300
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-gray-50/50">
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
            <Star className="w-4 h-4 mr-2 text-teal-600" />
            Proven Benefits
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

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
