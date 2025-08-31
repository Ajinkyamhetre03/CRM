import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    Settings,
    Users,
    Globe,
    Target,
    Zap,
    Shield,
    Award,
    Clock,
    CheckCircle,
    ArrowRight,
    MapPin,
    Mail,
    Phone
} from 'lucide-react';

// Device detection hook
const useDeviceDetection = () => {
    const [deviceInfo, setDeviceInfo] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1200
    });

    useEffect(() => {
        const updateDeviceInfo = () => {
            const width = window.innerWidth;
            setDeviceInfo({
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1024,
                isDesktop: width >= 1024,
                width
            });
        };

        updateDeviceInfo();
        window.addEventListener('resize', updateDeviceInfo);
        return () => window.removeEventListener('resize', updateDeviceInfo);
    }, []);

    return deviceInfo;
};

// Optimized animated button component
const AnimatedButton = memo(({ children, className, onClick, ...props }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={className}
        onClick={onClick}
        {...props}
    >
        {children}
    </motion.button>
));

// Optimized scroll reveal component
const ScrollReveal = memo(({ children, delay = 0, direction = 'up' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing once visible
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    const directionVariants = {
        up: { opacity: 0, y: 30 },
        down: { opacity: 0, y: -30 },
        left: { opacity: 0, x: -30 },
        right: { opacity: 0, x: 30 }
    };

    return (
        <motion.div
            ref={ref}
            initial={directionVariants[direction]}
            animate={isVisible ? { opacity: 1, y: 0, x: 0 } : {}}
            transition={{ duration: 0.6, delay }}
        >
            {children}
        </motion.div>
    );
});

// Floating animation component
const FloatingElement = memo(({ children, delay = 0 }) => (
    <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-10, 10, -10] }}
        transition={{
            duration: 6,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        {children}
    </motion.div>
));

// Counter animation component
const AnimatedCounter = memo(({ end, duration = 2, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            
            const currentCount = Math.floor(progress * (typeof end === 'string' ? parseInt(end) : end));
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return (
        <span ref={ref}>
            {typeof end === 'string' && end.includes('/') ? end : count}
            {suffix}
        </span>
    );
});

const AboutPage = () => {
    const deviceInfo = useDeviceDetection();

    // Memoized data arrays
    const companyFeatures = useMemo(() => [
        { icon: <Target className="w-6 h-6 text-emerald-600" />, text: "Innovation-driven approach" },
        { icon: <Users className="w-6 h-6 text-blue-600" />, text: "Customer-centric solutions" },
        { icon: <Shield className="w-6 h-6 text-purple-600" />, text: "Quality assurance guarantee" },
        { icon: <CheckCircle className="w-6 h-6 text-green-600" />, text: "Proven track record" }
    ], []);

    const coreValues = useMemo(() => [
        { 
            icon: <Zap className="w-8 h-8 sm:w-12 sm:h-12" />, 
            title: 'Innovation First', 
            description: 'Constantly exploring new technologies and methodologies',
            color: 'blue',
            bgColor: 'bg-blue-50'
        },
        { 
            icon: <Users className="w-8 h-8 sm:w-12 sm:h-12" />, 
            title: 'Customer-Centric', 
            description: 'Every solution is tailored to client needs and goals',
            color: 'emerald',
            bgColor: 'bg-emerald-50'
        },
        { 
            icon: <Shield className="w-8 h-8 sm:w-12 sm:h-12" />, 
            title: 'Quality Assurance', 
            description: 'Rigorous testing and quality control processes',
            color: 'purple',
            bgColor: 'bg-purple-50'
        },
        { 
            icon: <Globe className="w-8 h-8 sm:w-12 sm:h-12" />, 
            title: 'Transparency', 
            description: 'Open communication and honest project management',
            color: 'orange',
            bgColor: 'bg-orange-50'
        }
    ], []);

    const achievements = useMemo(() => [
        { number: "100+", label: "Projects Delivered", icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" /> },
        { number: "50+", label: "Happy Clients", icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" /> },
        { number: "5+", label: "Years Experience", icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8" /> },
        { number: "24/7", label: "Support Available", icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" /> }
    ], []);

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900 text-white py-16 sm:py-20 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80"
                    alt="About Us Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                
                {/* Animated background elements */}
                {deviceInfo.isDesktop && (
                    <>
                        <FloatingElement delay={0}>
                            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"></div>
                        </FloatingElement>
                        <FloatingElement delay={2}>
                            <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-400/20 rounded-full backdrop-blur-sm"></div>
                        </FloatingElement>
                        <FloatingElement delay={4}>
                            <div className="absolute bottom-40 left-20 w-12 h-12 bg-blue-300/20 rounded-full backdrop-blur-sm"></div>
                        </FloatingElement>
                    </>
                )}

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg"
                    >
                        About <span className="bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">Zyntarix Technologies</span>
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-lg sm:text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
                    >
                        Pioneering innovation in IoT and software development since 2020, transforming businesses across India with cutting-edge technology solutions.
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <AnimatedButton className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg shadow-lg transition-all duration-300 flex items-center justify-center">
                            Our Story
                            <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
                        </AnimatedButton>
                        <AnimatedButton className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg transition-all">
                            Contact Us
                        </AnimatedButton>
                    </motion.div>
                </div>
            </section>

            {/* Company Story */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <ScrollReveal direction="left">
                            <div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                    Our <span className="text-blue-600">Journey</span>
                                </h2>
                                <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
                                    Founded with a vision to democratize technology and make smart solutions accessible to businesses
                                    of all sizes, Zyntarix Technologies has been at the forefront of IoT and software innovation.
                                </p>
                                <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed">
                                    Our mission is to bridge the gap between cutting-edge technology and practical business applications,
                                    delivering solutions that drive real value and measurable results.
                                </p>
                                <div className="space-y-4">
                                    {companyFeatures.map((item, i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: i * 0.1 }}
                                            className="flex items-center"
                                        >
                                            {item.icon}
                                            <span className="text-gray-700 text-sm sm:text-lg ml-3">{item.text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                        
                        <ScrollReveal direction="right">
                            <div className="relative">
                                <motion.img 
                                    src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80" 
                                    alt="Company workspace" 
                                    className='w-full h-80 sm:h-96 rounded-2xl object-cover shadow-lg'
                                    whileHover={deviceInfo.isDesktop ? { scale: 1.02 } : {}}
                                    transition={{ duration: 0.3 }}
                                />
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Award className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-xl sm:text-2xl font-bold text-gray-900">
                                                <AnimatedCounter end={5} suffix="+" />
                                            </div>
                                            <div className="text-gray-600 text-xs sm:text-sm">Years of Excellence</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Founder Profile */}
            <section className="py-16 sm:py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                                <div className="lg:col-span-1 text-center">
                                    <motion.div 
                                        className="relative inline-block"
                                        whileHover={deviceInfo.isDesktop ? { scale: 1.05 } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img 
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" 
                                            alt="Ajinkya Mhetre" 
                                            className='h-48 w-48 sm:h-64 sm:w-64 rounded-2xl object-cover shadow-lg mx-auto'
                                        />
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-blue-600 text-white p-2 sm:p-3 rounded-xl shadow-lg"
                                        >
                                            <Target className="w-4 h-4 sm:w-6 sm:h-6" />
                                        </motion.div>
                                    </motion.div>
                                </div>
                                <div className="lg:col-span-2">
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6 }}
                                        className="mb-4"
                                    >
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">Founder & CEO</span>
                                    </motion.div>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Meet Our Founder</h2>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-4 sm:mb-6">Ajinkya Mhetre</h3>
                                    <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                                        With over 5 years of experience in IoT and software development, Ajinkya founded Zyntarix Technologies
                                        with a vision to make advanced technology accessible to businesses across India. His expertise spans
                                        from embedded systems to cloud architectures.
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                                        Ajinkya's technical background combined with his business acumen has helped numerous clients
                                        transform their operations through strategic technology implementations.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <motion.div 
                                            whileHover={deviceInfo.isDesktop ? { y: -5 } : {}}
                                            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6"
                                        >
                                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                                                Expertise
                                            </h4>
                                            <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
                                                <li className="flex items-center"><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />IoT Architecture</li>
                                                <li className="flex items-center"><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />Software Development</li>
                                                <li className="flex items-center"><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />System Integration</li>
                                            </ul>
                                        </motion.div>
                                        <motion.div 
                                            whileHover={deviceInfo.isDesktop ? { y: -5 } : {}}
                                            className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 sm:p-6"
                                        >
                                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mr-2" />
                                                Education
                                            </h4>
                                            <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
                                                <li className="flex items-center"><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />B.Tech in Electronics</li>
                                                <li className="flex items-center"><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />IoT Certifications</li>
                                                <li className="flex items-center"><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />Cloud Architecture</li>
                                            </ul>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Company Values */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Our Core <span className="text-blue-600">Values</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                                Principles that guide everything we do and shape our company culture
                            </p>
                        </div>
                    </ScrollReveal>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {coreValues.map((value, index) => (
                            <ScrollReveal key={index} delay={index * 0.2}>
                                <motion.div 
                                    whileHover={deviceInfo.isDesktop ? { y: -10, scale: 1.02 } : {}}
                                    className="text-center group transition-all duration-300"
                                >
                                    <div className={`${value.bgColor} rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow`}>
                                        <motion.div 
                                            whileHover={deviceInfo.isDesktop ? { rotate: 360 } : {}}
                                            transition={{ duration: 0.6 }}
                                            className={`text-${value.color}-600 mb-4 sm:mb-6 flex justify-center`}
                                        >
                                            {value.icon}
                                        </motion.div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{value.description}</p>
                                    </div>
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
                {/* Animated background elements */}
                {deviceInfo.isDesktop && (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute top-10 right-10 w-32 h-32 border border-white/20 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-10 left-10 w-24 h-24 border border-emerald-300/20 rounded-full"
                        />
                    </>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal>
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Our Achievements</h2>
                            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
                                Milestones that reflect our commitment to excellence and client satisfaction
                            </p>
                        </div>
                    </ScrollReveal>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {achievements.map((achievement, index) => (
                            <ScrollReveal key={index} delay={index * 0.2}>
                                <motion.div 
                                    whileHover={deviceInfo.isDesktop ? { scale: 1.05, y: -5 } : {}}
                                    className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all"
                                >
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="text-blue-300 mb-4 flex justify-center"
                                    >
                                        {achievement.icon}
                                    </motion.div>
                                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                                        <AnimatedCounter end={achievement.number} />
                                    </div>
                                    <div className="text-blue-100 text-sm sm:text-lg">{achievement.label}</div>
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 sm:py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <motion.div 
                            whileHover={deviceInfo.isDesktop ? { y: -5 } : {}}
                            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-center"
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Ready to Work Together?
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Let's discuss how we can help transform your business with innovative technology solutions.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <AnimatedButton className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg shadow-lg transition-all duration-300 flex items-center justify-center">
                                    <Mail className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
                                    Get In Touch
                                </AnimatedButton>
                                <AnimatedButton className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg transition-all flex items-center justify-center">
                                    <Phone className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
                                    Schedule Call
                                </AnimatedButton>
                            </div>
                        </motion.div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    )
}

export default memo(AboutPage);
