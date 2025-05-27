import { Head } from '@inertiajs/react';
import LandingLayout from "@/Layouts/LandingLayout";

const AboutPage = () => {
    return (
        <LandingLayout className="bg-gray-50">
            <Head title="About Calumpang RHU" />
            <main className="overflow-hidden">
                {/* Hero Section - Enhanced with better gradient and typography */}
                <div className="relative h-[300px] overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="https://i.ibb.co/wFSCZYdV/471634916-609791331562667-4920390300131702624-n.jpg"
                            className="w-full h-full object-cover filter blur-sm"
                        />
                        <div className="absolute inset-0 bg-black/60" />
                    </div>
                    <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-center items-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-center mb-3 tracking-tight animate-fade-in-down font-montserrat text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                            About Calumpang Rural Health Unit
                        </h1>
                        <p className="text-sm md:text-base text-center max-w-3xl mx-auto text-white font-inter leading-relaxed justify-center animate-fade-in-up drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        ​The Calumpang Rural Health Unit (RHU) in Barangay Calumpang, General Santos City, was established in 1985. 
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-20">
                    {/* Mission Section - Improved with better card design */}
                    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mb-20 transform transition-all hover:shadow-2xl duration-300 animate-fade-in border border-gray-200">
                        <div className="md:flex items-stretch">
                            <div className="md:w-2/5 relative overflow-hidden">
                                <img className="h-[350px] w-full object-cover transition-transform duration-700 hover:scale-105"
                                    src="https://i.ibb.co/3yRJvkHH/471581852-609518671589933-5131197107649287493-n.jpg"
                                    alt="Healthcare professionals" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-30"></div>
                            </div>
                            <div className="p-10 md:w-3/5 flex flex-col justify-center">
                                <div className="inline-block px-4 py-1.5 rounded-full bg-gray-700 text-white font-semibold text-sm mb-6 animate-bounce shadow-sm">
                                    Our Mission
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-6 font-montserrat">
                                    Compassionate Care for All
                                </h2>
                                <p className="text-gray-600 leading-relaxed animate-fade-in-left font-inter text-lg text-justify">
                                    Committed to enhancing the quality of life,
                                    we seek to serve the needs of the community
                                    by providing accessible, comprehensive, and 
                                    affordable health services in a caring, 
                                    professional and safe environment.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* History and Team Section - Grid layout with improved cards */}
                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl duration-300 animate-fade-in border border-gray-200">
                            <div className="md:flex flex-col h-full">
                                <div className="h-64 relative overflow-hidden">
                                    <img className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                                        src="https://i.ibb.co/mF4d4ksf/474569388-626983356510131-2002503501262866671-n.jpg"
                                        alt="History of healthcare" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-30"></div>
                                </div>
                                <div className="p-10 flex flex-col justify-center flex-grow">
                                    <div className="inline-block px-4 py-1.5 rounded-full bg-gray-700 text-white font-semibold text-sm mb-6 shadow-sm animate-bounce">
                                        Our History
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 font-montserrat">
                                        Serving Since 1985
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed font-inter text-justify animate-fade-in-left">
                                    Originally a small clinic, it has since evolved into a comprehensive healthcare facility that integrates traditional care with modern digital solutions.
                                    In 2022, the RHU launched a digital health management system to better serve the growing community.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl duration-300 animate-fade-in border border-gray-200">
                            <div className="md:flex flex-col h-full">
                                <div className="h-64 relative overflow-hidden">
                                    <img className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-110"
                                        src="https://i.ibb.co/dJHzf5yf/482356994-660872756454524-3789380206323173638-n.jpg"
                                        alt="Healthcare team" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-30"></div>
                                </div>
                                <div className="p-10 flex flex-col justify-center flex-grow">
                                    <div className="inline-block px-4 py-1.5 rounded-full bg-gray-700 text-white font-semibold text-sm mb-6 shadow-sm animate-bounce">
                                        Our Team
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 font-montserrat">
                                        Dedicated Professionals
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed font-inter text-justify animate-fade-in-left">
                                        Our team consists of licensed physicians, nurses, data encoder, midwives, and
                                        barangay health workers committed to providing the highest
                                        standard of care. All our medical professionals undergo regular
                                        training to stay updated with the latest healthcare practices.
                                        We also have a technical team maintaining our digital health
                                        management system for a seamless user experience.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Facilities Section - Updated with modern card design */}
                    <div className="mb-20 animate-fade-in">
                        <div className="text-center mb-16">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-gray-700 text-white font-semibold text-sm mb-4 shadow-sm animate-bounce">
                                Our Facilities
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800 font-montserrat">
                                State-of-the-Art Healthcare Facilities
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto font-inter text-lg animate-fade-in-left">
                                Equipped with modern amenities to provide comprehensive
                                healthcare services to our community
                            </p>
                            <div className="flex justify-center mt-6">
                                <div className="h-1 w-24 bg-gray-500 rounded-full"></div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-10">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:translateY(-5px) animate-fade-in-up delay-200 border border-gray-200">
                                <div className="h-56 overflow-hidden relative">
                                    <img src="https://i.ibb.co/0yXZpVvm/482212492-655365630338570-8121140410946240034-n.jpg"
                                        alt="Consultation Room" className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-30"></div>
                                </div>
                                <div className="p-8">
                                    <h3 className="font-bold text-xl mb-4 text-gray-800 font-montserrat">
                                        Consultation Rooms
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed font-inter text-justify animate-fade-in-left">
                                        Private, comfortable rooms for patient consultations with
                                        our healthcare providers, ensuring confidentiality and
                                        personalized care.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:translateY(-5px) animate-fade-in-up delay-300 border border-gray-200">
                                <div className="h-56 overflow-hidden relative"> 
                                    <img src="https://i.ibb.co/3mWfV8pV/472697263-616240264251107-9013982212104289498-n.jpg"
                                        alt="Treatment Area" className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-30"></div>
                                </div>
                                <div className="p-8">
                                    <h3 className="font-bold text-xl mb-4 text-gray-800 font-montserrat">
                                        Treatment Area
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed font-inter text-justify">
                                        Fully equipped for minor procedures, vaccinations, and
                                        emergency care with modern medical equipment and trained
                                        staff.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:translateY(-5px) animate-fade-in-up delay-400 border border-gray-200">
                                <div className="h-56 overflow-hidden relative">
                                    <img src="https://i.ibb.co/PzzKTc4w/471643963-609518651589935-8506127192558360431-n.jpg" 
                                        alt="Digital Access Point" className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-30"></div>
                                </div>
                                <div className="p-8">
                                    <h3 className="font-bold text-xl mb-4 text-gray-800 font-montserrat">
                                        Triage
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed font-inter text-justify">
                                        Our triage system quickly assesses the severity of
                                        patients' conditions, so they can receive the right care
                                        at the right time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Vision Section - Enhanced with better design */}
                    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mb-20 transform transition-all hover:shadow-2xl duration-300 animate-fade-in">
                        <div className="md:flex items-stretch">
                            <div className="md:w-2/5 relative overflow-hidden">
                                <img src="https://i.ibb.co/S4361ngr/483526747-660872816454518-5942785603012561384-n.jpg" 
                                    alt="Vision" className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110 opacity-80" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent"></div>
                            </div>
                            <div className="p-10 md:w-3/5 flex flex-col justify-center">
                                <div className="inline-block px-4 py-1.5 rounded-full bg-gray-600 text-white font-semibold text-sm mb-6 shadow-sm animate-bounce">
                                    Our Vision
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-6 font-montserrat ">
                                    Shaping the Future of Healthcare
                                </h2>
                                <p className="text-gray-600 leading-relaxed font-inter text-lg text-justify">
                                   Calumpang Rural Health Unit shall be
                                   the Provider of choice for primary and 
                                   preventive services offering comprehensive  
                                   care of high quality for all the people in the community.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action - Enhanced with better design */}
                    <div className="bg-gray-50 rounded-2xl shadow-xl p-12 text-center max-w-4xl mx-auto border border-gray-200">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6 font-montserrat">
                            Visit Our Health Center Today
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg font-inter">
                            Experience our compassionate care and modern facilities firsthand.
                            Our team is ready to assist you with all your healthcare needs.
                        </p>
                        <a href="/contact"
                            className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                            Contact Us
                        </a>
                    </div>
                </div>
            </main>
        </LandingLayout>
    );
};

export default AboutPage;
