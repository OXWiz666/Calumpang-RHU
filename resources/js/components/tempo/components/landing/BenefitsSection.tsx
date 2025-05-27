import React from 'react';

interface BenefitProps {
  icon: 'clock' | 'shield' | 'heart' | 'check';
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitProps> = ({ icon, title, description }) => {
  const renderIcon = () => {
    switch (icon) {
      case 'clock':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        );
      case 'heart':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        );
      case 'check':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <div className="p-3 rounded-full text-primary mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const BenefitsSection: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Benefits of Our Digital Healthcare System</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Discover how our system improves healthcare access for Barangay Calumpang residents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BenefitCard
            icon="clock"
            title="Fast Service"
            description="Quick and efficient healthcare services with minimal wait times"
          />
          <BenefitCard
            icon="shield"
            title="Safe & Secure"
            description="Your health data is protected with the highest security standards"
          />
          <BenefitCard
            icon="heart"
            title="Compassionate Care"
            description="Our team provides personalized, empathetic healthcare services"
          />
          <BenefitCard
            icon="check"
            title="Proven Results"
            description="Trusted healthcare solutions with demonstrated effectiveness"
          />
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
