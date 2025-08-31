import {
    Home,
    Settings,
    MapPin,
    ArrowRight,
    Check,
    Star,
    Play,
    Award,
    Users,
    Globe,
    Smartphone,
    Factory,
    Shield,
    Clock,
    Target,
    GraduationCap,
    Briefcase,
    FileText,
    Cloud,
    ArrowDown,
    X
} from 'lucide-react'
import React, { useState, useEffect, useRef, lazy, Suspense, memo, useMemo } from 'react'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Lazy load heavy components
const ParticleBackground = lazy(() => import('../../Animations/ParticleBackground'));
const NeuralNetwork = lazy(() => import('../../Animations/NeuralNetwork'));
const Tech3DIcon = lazy(() => import('../../Animations/Tech3DIcon'));

// Memoized constants
const DEPARTMENT_ICONS = {
    ai: <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-violet-500" />,
    cloud: <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />,
    iot: <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
};

// Lightweight loading placeholder for 3D icons
const IconPlaceholder = memo(() => (
    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center animate-pulse">
        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-blue-400 rounded opacity-60"></div>
    </div>
));

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

// Optimized scroll reveal component with Intersection Observer
const ScrollReveal = memo(({ children, delay = 0 }) => {
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

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
        >
            {children}
        </motion.div>
    );
});

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

const HomePage = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const contentRef = useRef(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const deviceInfo = useDeviceDetection();
    
    // Memoized state to prevent unnecessary re-renders
    const [stats, setStats] = useState(() => ({
        totalJobs: 12,
        totalApplications: 83,
        totalCompletedInternships: 37,
        totalCertificates: 22,
        companyInfo: {
            name: "Zyntarix Technologies",
            description: "Transforming Technology, Empowering Business",
            established: "2020",
            email: "info@zyntarix.com",
            phone: "+91-9876543210"
        }
    }));

    const [departments, setDepartments] = useState(() => ([
        { _id: "ai", name: "AI & Data Science", description: "Advanced analytics, ML, and data engineering" },
        { _id: "cloud", name: "Cloud Solutions", description: "Deployment and scalable cloud infrastructure" },
        { _id: "iot", name: "IoT Development", description: "Device firmware, automation, sensor technology" }
    ]));

    const [loading, setLoading] = useState(false);

    const scrollToContent = () => {
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const openVideoModal = () => setShowVideoModal(true);
    const closeVideoModal = () => setShowVideoModal(false);

    // Close modal on escape key press
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeVideoModal();
            }
        };

        if (showVideoModal) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [showVideoModal]);

    // Optimized data fetching
    useEffect(() => {
        const fetchData = async () => {
            if (!BASE_URL) return;
            
            try {
                setLoading(true);
                const [statsResponse, departmentsResponse] = await Promise.all([
                    fetch(`${BASE_URL}/api/public/stats`),
                    fetch(`${BASE_URL}/api/public/departments`)
                ]);

                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setStats(statsData);
                }

                if (departmentsResponse.ok) {
                    const departmentsData = await departmentsResponse.json();
                    setDepartments(departmentsData.departments || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [BASE_URL]);

    // Memoized data arrays to prevent re-renders
    const services = useMemo(() => [
        {
            id: 'iot',
            title: 'Smart Home & IoT Solutions',
            icon: <Home className="w-8 h-8 sm:w-12 sm:h-12" />,
            description: 'Complete smart home automation with mobile app control.',
            features: ['Lighting Control', 'Climate Management', 'Security Systems', 'Energy Monitoring'],
            image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'software',
            title: 'Custom Software Development',
            icon: <Settings className="w-8 h-8 sm:w-12 sm:h-12" />,
            description: 'Enterprise solutions and web/mobile apps.',
            features: ['Web Applications', 'Mobile Apps', 'CRM Systems', 'ERP Solutions'],
            image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'industry40',
            title: 'Industry 4.0 & Factory Automation',
            icon: <Factory className="w-8 h-8 sm:w-12 sm:h-12" />,
            description: 'Industrial automation and analytics.',
            features: ['PLC Programming', 'Process Automation', 'Monitoring', 'Predictive Maintenance'],
            image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80'
        }
    ], []);

    const projects = useMemo(() => [
        {
            id: 1,
            title: 'Enterprise CRM Integration',
            category: 'software',
            client: 'TechCorp Industries',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
            description: 'Customer relationship management system with advanced analytics.',
            technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
            results: '45% increase in sales conversion rate'
        },
        {
            id: 2,
            title: 'Smart Inventory Management',
            category: 'iot',
            client: 'RetailMax Solutions',
            image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
            description: 'IoT-enabled real-time stock monitoring and automated reordering.',
            technologies: ['IoT Sensors', 'Python', 'React', 'MongoDB'],
            results: '60% reduction in stock-outs'
        },
        {
            id: 3,
            title: 'Hospital Patient Portal',
            category: 'healthcare',
            client: 'Metro Hospitals',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
            description: 'Comprehensive patient portal and appointment management.',
            technologies: ['React', 'GraphQL', 'Firebase'],
            results: '50% higher patient engagement'
        }
    ], []);

    const testimonials = useMemo(() => [
        {
            name: 'Rajesh Sharma',
            company: 'Sharma Industries',
            rating: 5,
            text: 'Zyntarix Technologies transformed our factory with Industry 4.0. Efficiency up 35%.',
            image: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            name: 'Priya Patel',
            company: 'Modern Homes',
            rating: 5,
            text: 'The smart home system is excellent. Full mobile control and big energy savings.',
            image: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
            name: 'Dr. Amit Kumar',
            company: 'Kumar Clinic',
            rating: 5,
            text: 'Clinic operations are seamless after their custom software deployment.',
            image: 'https://randomuser.me/api/portraits/men/54.jpg'
        }
    ], []);

    const metrics = useMemo(() => [
        {
            label: "Active Projects",
            value: stats.totalJobs,
            icon: Briefcase,
            trend: 12,
            color: "blue"
        },
        {
            label: "Client Applications",
            value: stats.totalApplications,
            icon: Users,
            trend: 6,
            color: "emerald"
        },
        {
            label: "Completed Projects",
            value: stats.totalCompletedInternships,
            icon: GraduationCap,
            trend: 7,
            color: "orange"
        },
        {
            label: "Certifications",
            value: stats.totalCertificates,
            icon: FileText,
            trend: 3,
            color: "purple"
        }
    ], [stats]);

    // Service showcase items for hero section
    const showcaseItems = useMemo(() => [
        { name: 'Smart Homes', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80' },
        { name: 'Industry 4.0', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=100&q=80' },
        { name: 'Mobile Apps', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=100&q=80' },
        { name: 'Web Solutions', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80' }
    ], []);

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            {/* Fixed Navigation */}
            <nav className="fixed w-full z-30 top-0 left-0 bg-gray-900/95 backdrop-blur-md text-white shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-2 sm:space-x-3"
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm sm:text-lg">Z</span>
                        </div>
                        <div>
                            <span className="text-lg sm:text-xl font-bold text-blue-400 leading-tight">
                                {deviceInfo.isMobile ? 'Zyntarix' : stats.companyInfo.name}
                            </span>
                            {!deviceInfo.isMobile && (
                                <div className="text-xs text-gray-300 font-medium">Technologies</div>
                            )}
                        </div>
                    </motion.div>
                    
                    <div className="hidden md:flex space-x-4 lg:space-x-8 text-sm lg:text-lg font-medium">
                        {["Home", "About", "Service", "Portfolio", "Resources", "Contact", "Careers"].map((link, index) => (
                            <motion.a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                className="hover:text-blue-300 transition-colors relative"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -2 }}
                            >
                                {link}
                            </motion.a>
                        ))}
                    </div>
                    
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-6 py-2 rounded-lg font-semibold ml-2 sm:ml-6 transition-colors text-sm sm:text-base"
                    >
                        Login
                    </motion.button>
                </div>
            </nav>

            {/* Video Modal */}
            {showVideoModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-xs sm:max-w-2xl lg:max-w-4xl mx-4 bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeVideoModal}
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 sm:p-3 backdrop-blur-sm transition-all hover:scale-110"
                        >
                            <X className="w-4 h-4 sm:w-6 sm:h-6" />
                        </button>
                        
                        {/* Video */}
                        <div className="relative" style={{ paddingBottom: '56.25%' }}>
                            <video
                                className="absolute inset-0 w-full h-full"
                                controls
                                autoPlay
                                muted
                                playsInline
                                poster="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
                            >
                                <source src="/demo video.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        
                        {/* Video Info */}
                        <div className="p-3 sm:p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                            <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Zyntarix Technologies</h3>
                            <p className="text-blue-100 italic text-sm sm:text-base">
                                "{stats.companyInfo.description}"
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Full Screen Hero */}
            <section 
                id="home"
                className="relative min-h-screen flex flex-col justify-center items-center text-white overflow-hidden"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                {/* Animations - Only show on desktop for performance */}
                {deviceInfo.isDesktop && (
                    <Suspense fallback={null}>
                        <NeuralNetwork />
                    </Suspense>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/70 to-purple-900/60"></div>
                
                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-4 sm:mb-6 drop-shadow-2xl"
                            >
                                Transform Your Business<br />
                                with <span className="bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">Smart IoT & Software Solutions</span>
                            </motion.h1>
                            
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-2xl"
                            >
                                {stats.companyInfo.description}
                            </motion.p>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                            >
                                <Link to="/contact">
                                    <AnimatedButton className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg shadow-lg transition-all duration-300 flex items-center justify-center">
                                        Get Free Consultation
                                        <ArrowRight className="ml-2 w-4 h-4 sm:w-6 sm:h-6" />
                                    </AnimatedButton>
                                </Link>
                                
                                <AnimatedButton
                                    onClick={openVideoModal}
                                    className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg transition-all flex items-center justify-center group"
                                >
                                    <div className="relative mr-2 sm:mr-3">
                                        <Play className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                                    </div>
                                    Watch Demo
                                </AnimatedButton>
                            </motion.div>
                        </div>
                        
                        {/* Hero Showcase - Hidden on mobile for better performance */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="hidden lg:block flex-1"
                        >
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 lg:p-10 shadow-2xl border border-white/20">
                                <div className="grid grid-cols-2 gap-4 lg:gap-6">
                                    {showcaseItems.map((item, index) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                                            className="bg-white/20 rounded-xl p-4 lg:p-6 text-center hover:bg-white/30 transition-all cursor-pointer"
                                        >
                                            <div className="flex flex-col items-center">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="mx-auto mb-2 w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-blue-100" 
                                                    loading="lazy"
                                                />
                                                <div className="text-sm lg:text-base font-semibold">{item.name}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                
                {/* Scroll Down Indicator */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    onClick={scrollToContent}
                    className="absolute left-1/2 transform -translate-x-1/2 bottom-4 sm:bottom-8 z-10 flex flex-col items-center focus:outline-none group"
                    aria-label="Scroll down"
                >
                    <span className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors text-sm sm:text-base">Scroll Down</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300 group-hover:text-white transition-colors" />
                    </motion.div>
                </motion.button>
            </section>

            {/* Rest of the Content */}
            <div ref={contentRef}>
                {/* Metrics */}
                <section className="py-12 sm:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
                            {metrics.map((metric, index) => (
                                <ScrollReveal key={index} delay={index * 0.1}>
                                    <motion.div
                                        whileHover={deviceInfo.isDesktop ? { y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" } : {}}
                                        className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 p-4 sm:p-6 transition-transform duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                                            <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center`}
                                                style={{background: `linear-gradient(to bottom right, var(--tw-color-${metric.color}-100, #E0F2FE), var(--tw-color-${metric.color}-200, #C7D2FE))`}}>
                                                <metric.icon className={`w-4 h-4 sm:w-7 sm:h-7 text-${metric.color}-600`} />
                                            </div>
                                            <div className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full ${metric.trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {metric.trend > 0 ? '+' : ''}{metric.trend}%
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{loading ? '...' : metric.value}</div>
                                            <div className="text-gray-600 text-xs sm:text-base">{metric.label}</div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-3 sm:mt-4">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${70 + metric.trend}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className={`bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 h-1.5 sm:h-2 rounded-full`}
                                            />
                                        </div>
                                    </motion.div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section id="service" className="py-12 sm:py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="text-center mb-12 sm:mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 sm:mb-6">
                                    Our Core Services
                                </h2>
                                <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                                    Comprehensive tech solutions tailored for business transformation
                                </p>
                            </div>
                        </ScrollReveal>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {services.map((service, index) => (
                                <ScrollReveal key={service.id} delay={index * 0.2}>
                                    <motion.div
                                        whileHover={deviceInfo.isDesktop ? { y: -10, scale: 1.02 } : {}}
                                        className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-500 p-6 sm:p-8"
                                    >
                                        <img 
                                            src={service.image} 
                                            alt={service.title} 
                                            className="rounded-xl w-full h-32 sm:h-40 object-cover mb-4 sm:mb-6 shadow-md" 
                                            loading="lazy"
                                        />
                                        <div className="text-blue-600 mb-4 sm:mb-6">{service.icon}</div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{service.title}</h3>
                                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{service.description}</p>
                                        <ul className="space-y-2 mb-4 sm:mb-6">
                                            {service.features.map((feature, i) => (
                                                <li key={i} className="flex items-center text-xs sm:text-sm text-gray-700">
                                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Departments */}
                <section id="about" className="py-12 sm:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="text-center mb-12 sm:mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                    Our Expertise Areas
                                </h2>
                                <p className="text-lg sm:text-xl text-gray-600">
                                    Specialized departments delivering cutting-edge solutions
                                </p>
                            </div>
                        </ScrollReveal>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                                        <div className="h-4 sm:h-5 bg-gray-100 rounded mb-3 sm:mb-4"></div>
                                        <div className="h-3 sm:h-4 bg-gray-100 rounded mb-2"></div>
                                        <div className="h-3 sm:h-4 bg-gray-100 rounded"></div>
                                    </div>
                                ))
                            ) : (
                                departments.map((department, index) => (
                                    <ScrollReveal key={department._id} delay={index * 0.1}>
                                        <motion.div
                                            whileHover={deviceInfo.isDesktop ? { scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
                                            className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-shadow p-6 flex flex-col gap-2"
                                        >
                                            <div className="mb-2">{DEPARTMENT_ICONS[department._id]}</div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">{department.name}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{department.description}</p>
                                        </motion.div>
                                    </ScrollReveal>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-12 sm:py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                            <ScrollReveal>
                                <div>
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
                                        Why Choose {deviceInfo.isMobile ? 'Zyntarix?' : `${stats.companyInfo.name}?`}
                                    </h2>
                                    <div className="space-y-4 sm:space-y-6">
                                        {[
                                            { icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />, text: 'End-to-end solutions: hardware, cloud and mobile' },
                                            { icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />, text: 'Affordable pricing & lifetime support' },
                                            { icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />, text: 'Local presence, global standards' },
                                            { icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />, text: `${stats.totalJobs}+ successful projects completed` },
                                            { icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />, text: 'Real-time monitoring & control systems' }
                                        ].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                                className="flex items-start"
                                            >
                                                <div className="text-green-600 mr-3 sm:mr-4 mt-1 flex-shrink-0">{item.icon}</div>
                                                <span className="text-gray-700 text-sm sm:text-lg">{item.text}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                            
                            <ScrollReveal delay={0.3}>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    {[
                                        { value: stats.totalJobs + '+', label: 'Projects Completed', color: 'blue' },
                                        { value: Math.floor(stats.totalApplications / 3) + '+', label: 'Happy Clients', color: 'green' },
                                        { value: '24/7', label: 'Support Available', color: 'orange' },
                                        { value: new Date().getFullYear() - parseInt(stats.companyInfo.established) + '+', label: 'Years Experience', color: 'purple' }
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                            whileHover={deviceInfo.isDesktop ? { scale: 1.05 } : {}}
                                            className={`bg-${stat.color}-50 rounded-lg p-4 sm:p-6 text-center`}
                                        >
                                            <div className={`text-2xl sm:text-4xl font-bold text-${stat.color}-600 mb-1 sm:mb-2`}>
                                                {loading ? '...' : stat.value}
                                            </div>
                                            <div className="text-gray-500 text-xs sm:text-base">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Projects */}
                <section id="portfolio" className="py-12 sm:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="text-center mb-12 sm:mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                    Featured Projects
                                </h2>
                                <p className="text-lg sm:text-xl text-gray-600">
                                    Showcasing our latest successful implementations
                                </p>
                            </div>
                        </ScrollReveal>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {projects.map((project, index) => (
                                <ScrollReveal key={project.id} delay={index * 0.2}>
                                    <motion.div
                                        whileHover={deviceInfo.isDesktop ? { y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" } : {}}
                                        className="bg-white/90 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden"
                                    >
                                        <div className="h-40 sm:h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                            <motion.img 
                                                src={project.image} 
                                                alt={project.title} 
                                                className="w-full h-full object-cover"
                                                whileHover={deviceInfo.isDesktop ? { scale: 1.1 } : {}}
                                                transition={{ duration: 0.3 }}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="p-4 sm:p-6">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{project.description}</p>
                                            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                                                {project.technologies.slice(0, 2).map((tech, i) => (
                                                    <span key={i} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs sm:text-sm">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="text-green-600 text-xs sm:text-sm font-semibold">{project.results}</div>
                                        </div>
                                    </motion.div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Client Testimonials */}
                <section className="py-12 sm:py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="text-center mb-12 sm:mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                    What Our Clients Say
                                </h2>
                                <p className="text-lg sm:text-xl text-gray-600">
                                    Trusted by businesses across various industries
                                </p>
                            </div>
                        </ScrollReveal>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {testimonials.map((testimonial, index) => (
                                <ScrollReveal key={index} delay={index * 0.2}>
                                    <motion.div
                                        whileHover={deviceInfo.isDesktop ? { y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
                                        className="bg-white rounded-xl sm:rounded-2xl shadow-md p-6 sm:p-8 flex flex-col gap-4"
                                    >
                                        <div className="flex items-center mb-2">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                                >
                                                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                                                </motion.div>
                                            ))}
                                        </div>
                                        <p className="text-gray-700 mb-3 italic text-sm sm:text-base">"{testimonial.text}"</p>
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <img 
                                                src={testimonial.image} 
                                                alt="Client" 
                                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-blue-100 shadow" 
                                                loading="lazy"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                                                <div className="text-gray-500 text-xs sm:text-sm">{testimonial.company}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default memo(HomePage);
