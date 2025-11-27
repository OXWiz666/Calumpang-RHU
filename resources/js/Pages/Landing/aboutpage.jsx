import { Head } from '@inertiajs/react';
import LandingLayout from "@/Layouts/LandingLayout";
import { motion } from "framer-motion";
import { Sparkles, Target, History, Users, Building2, HeartPulse, MapPin, ArrowRight } from "lucide-react";

const AboutPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const facilities = [
        {
            image: "https://iili.io/fBSgHRs.md.jpg",
            title: "Consultation Rooms",
            description: "Private, comfortable rooms for patient consultations with our healthcare providers, ensuring confidentiality and personalized care."
        },
        {
            image: "https://iili.io/fBSj26J.md.jpg",
            title: "Treatment Area",
            description: "Fully equipped for minor procedures, vaccinations, and emergency care with modern medical equipment and trained staff."
        },
        {
            image: "https://iili.io/fBShddl.md.jpg",
            title: "Triage",
            description: "Our triage system quickly assesses the severity of patients' conditions, so they can receive the right care at the right time."
        }
    ];

    return (
        <LandingLayout className="bg-gradient-to-br from-gray-50 to-gray-100">
            <Head title="About Calumpang RHU" />
            <main className="overflow-hidden">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[400px] overflow-hidden pt-20"
                >
                    <div className="absolute inset-0">
                        <img
                            src="https://i.ibb.co/wFSCZYdV/471634916-609791331562667-4920390300131702624-n.jpg"
                            className="w-full h-full object-cover"
                            alt="Calumpang RHU"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-emerald-900/70 to-teal-800/80" />
                    </div>

                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-center items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="inline-block mb-6"
                        >
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                                <span className="text-white font-semibold flex items-center">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Serving Since 1985
                                </span>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-4xl md:text-6xl font-bold text-center mb-4 text-white drop-shadow-2xl"
                        >
                            About Calumpang<br />
                            <span className="text-teal-200">Rural Health Unit</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-lg md:text-xl text-center max-w-3xl mx-auto text-teal-100 leading-relaxed"
                        >
                            The Calumpang Rural Health Unit (RHU) in Barangay Calumpang, General Santos City, was established in 1985.
                        </motion.p>
                    </div>
                </motion.div>

                <div className="container mx-auto px-6 py-20">
                    {/* Mission Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mb-20"
                    >
                        <div className="md:flex items-stretch">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="md:w-2/5 overflow-hidden relative"
                            >
                                <img
                                    className="h-full w-full object-cover"
                                    src="https://iili.io/fBS4Kc7.md.jpg"
                                    alt="Healthcare professionals"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                            </motion.div>
                            <div className="p-10 md:w-3/5 flex flex-col justify-center">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-semibold text-sm mb-6 w-fit">
                                    <Target className="w-4 h-4 mr-2" />
                                    Our Mission
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Compassionate Care for All
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-lg text-justify">
                                    Committed to enhancing the quality of life, we seek to serve the needs of the community by providing accessible, comprehensive, and affordable health services in a caring, professional and safe environment.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* History and Team Section */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-8 mb-20"
                    >
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                                    src="https://iili.io/fBUdTcF.md.jpg"
                                    alt="History"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                            </div>
                            <div className="p-8">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-semibold text-sm mb-4">
                                    <History className="w-4 h-4 mr-2" />
                                    Our History
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Serving Since 1985
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-justify">
                                    Originally a small clinic, it has since evolved into a comprehensive healthcare facility that integrates traditional care with modern digital solutions. In 2022, the RHU launched a digital health management system to better serve the growing community.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                                    src="https://iili.io/fBSiEVj.md.jpg"
                                    alt="Team"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                            </div>
                            <div className="p-8">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-sm mb-4">
                                    <Users className="w-4 h-4 mr-2" />
                                    Our Team
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Dedicated Professionals
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-justify">
                                    Our team consists of licensed physicians, nurses, data encoder, midwives, and barangay health workers committed to providing the highest standard of care. All our medical professionals undergo regular training to stay updated with the latest healthcare practices.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Facilities Section */}
                    <div className="mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-semibold text-sm mb-4">
                                <Building2 className="w-4 h-4 mr-2" />
                                Our Facilities
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                State-of-the-Art Healthcare Facilities
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Equipped with modern amenities to provide comprehensive healthcare services to our community
                            </p>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {facilities.map((facility, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ y: -10, scale: 1.03 }}
                                    className="bg-white rounded-2xl shadow-xl overflow-hidden group"
                                >
                                    <div className="h-56 overflow-hidden relative">
                                        <img
                                            src={facility.image}
                                            alt={facility.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="font-bold text-xl mb-3 text-gray-900">
                                            {facility.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed text-justify">
                                            {facility.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Vision Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mb-20"
                    >
                        <div className="md:flex items-stretch">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="md:w-2/5 overflow-hidden relative"
                            >
                                <img
                                    src="https://iili.io/fBUHVft.md.jpg"
                                    alt="Vision"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                            </motion.div>
                            <div className="p-10 md:w-3/5 flex flex-col justify-center">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-semibold text-sm mb-6 w-fit">
                                    <HeartPulse className="w-4 h-4 mr-2" />
                                    Our Vision
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Shaping the Future of Healthcare
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-lg text-justify">
                                    Calumpang Rural Health Unit shall be the Provider of choice for primary and preventive services offering comprehensive care of high quality for all the people in the community.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-4xl mx-auto"
                    >
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Visit Our Health Center Today
                        </h3>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Experience our compassionate care and modern facilities firsthand. Our team is ready to assist you with all your healthcare needs.
                        </p>
                        <motion.a
                            href="/contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Contact Us
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </motion.a>
                    </motion.div>
                </div>
            </main>
        </LandingLayout>
    );
};

export default AboutPage;
