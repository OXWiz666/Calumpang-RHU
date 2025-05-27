import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  imageUrl?: string;
}

interface TestimonialSliderProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ title, subtitle, testimonials }) => {
  useEffect(() => {
    // Import Swiper styles dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <section className="w-full py-16 bg-slate-50">
      <style jsx>{`
        .swiper {
          padding: 20px 50px 60px 50px !important;
          position: relative;
        }
        .swiper-pagination {
          bottom: 0px !important;
        }
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #cbd5e1;
          opacity: 1;
          margin: 0 6px !important;
        }
        .swiper-pagination-bullet-active {
          background: #0B1120;
          transform: scale(1.2);
        }
        .custom-button {
          width: 40px !important;
          height: 40px !important;
          background: #0B1120 !important;
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
        }
        .swiper-button-prev {
          left: 0 !important;
        }
        .swiper-button-next {
          right: 0 !important;
        }
        .custom-button:hover {
          background: #1a2744 !important;
          transform: translateY(-50%) scale(1.1) !important;
        }
        .custom-button::after {
          font-size: 16px !important;
          color: white !important;
        }
      `}</style>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="testimonialSwiper"
          >
            <SwiperSlide
            // key={index}
            >
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <div className="mb-4 text-primary">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-6 flex-grow">"The online appointment system has saved me so much time. I no longer have to wait in long lines at the health center."</p>
                  <div className="flex items-center mt-auto">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" alt="Maria Santos" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900">Vincent Ermac</h4>
                      <p className="text-sm text-gray-500">Barangay Calumpang Resident</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide
            // key={index}
            >
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <div className="mb-4 text-primary">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-6 flex-grow">"As a senior citizen, I appreciate how easy it is to access my medical records online. The staff also helped me learn how to use the system."</p>
                  <div className="flex items-center mt-auto">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Juan" alt="Juan Dela Cruz" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900">Jude Lesmoras</h4>
                      <p className="text-sm text-gray-500">Senior Citizen</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide
            // key={index}
            >
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <div className="mb-4 text-primary">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-6 flex-grow">"Scheduling vaccinations for my children has never been easier. I get reminders and can see their complete vaccination history."</p>
                  <div className="flex items-center mt-auto">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" alt="Ana Reyes" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900">Abdul Jabbar Mohammad</h4>
                      <p className="text-sm text-gray-500">Father of Three</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide
            // key={index}
            >
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <div className="mb-4 text-primary">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-6 flex-grow">"This system has transformed how we deliver healthcare services. We can now reach more residents and provide better follow-up care."</p>
                  <div className="flex items-center mt-auto">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro" alt="Pedro Lim" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900">Renz Emilanan</h4>
                      <p className="text-sm text-gray-500">Community Health Worker</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

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
