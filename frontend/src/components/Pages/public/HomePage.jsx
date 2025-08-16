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
    FileText
} from 'lucide-react';

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
const HomePage = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL

    // State for API data
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplications: 0,
        totalCompletedInternships: 0,
        totalCertificates: 0,
        companyInfo: {
            name: "Smart Tech Solutions",
            description: "Leading technology solutions provider with industry-focused programs and hands-on learning experiences",
            established: "2020",
            email: "info@smarttechsolutions.com",
            phone: "+91-9876543210"
        }
    });

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch stats
                const statsResponse = await fetch(`${BASE_URL}/api/public/stats`);
                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setStats(statsData);
                }

                // Fetch departments
                const departmentsResponse = await fetch(`${BASE_URL}/api/public/departments`);
                if (departmentsResponse.ok) {
                    const departmentsData = await departmentsResponse.json();
                    setDepartments(departmentsData.departments || []);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [BASE_URL]);

    const services = [
        {
            id: 'iot',
            title: 'Smart Home & IoT Solutions',
            icon: <Home className="w-8 h-8" />,
            description: 'Complete smart home automation with mobile app control',
            features: ['Lighting Control', 'Climate Management', 'Security Systems', 'Energy Monitoring']
        },
        {
            id: 'software',
            title: 'Custom Software Development',
            icon: <Settings className="w-8 h-8" />,
            description: 'Enterprise solutions and web/mobile applications',
            features: ['Web Applications', 'Mobile Apps', 'CRM Systems', 'ERP Solutions']
        },
        {
            id: 'industry40',
            title: 'Industry 4.0 & Factory Automation',
            icon: <Factory className="w-8 h-8" />,
            description: 'Industrial automation and data analytics solutions',
            features: ['PLC Programming', 'Process Automation', 'Real-time Monitoring', 'Predictive Maintenance']
        }
    ];

    const projects = [
        {
            id: 1,
            title: 'Smart Manufacturing Dashboard',
            category: 'industrial',
            client: 'ABC Manufacturing Ltd.',
            image: '/HomePage/Smart Manufacturing Dashboard.jpg',
            description: 'Real-time production monitoring system with predictive analytics',
            technologies: ['React', 'Node.js', 'MongoDB', 'MQTT'],
            results: '30% increase in production efficiency'
        },
        {
            id: 2,
            title: 'Residential Smart Home System',
            category: 'smart-home',
            client: 'Private Residence',
            image: '/HomePage/Residential Smart Home System.jpg',
            description: 'Complete home automation with voice control and mobile app',
            technologies: ['IoT Sensors', 'Arduino', 'React Native', 'Firebase'],
            results: '40% reduction in energy consumption'
        },
        {
            id: 3,
            title: 'Hospital Management System',
            category: 'software',
            client: 'City General Hospital',
            image: '/HomePage/Hospital Management System.jpg',
            description: 'Comprehensive hospital management with patient tracking',
            technologies: ['React', 'Express.js', 'PostgreSQL', 'WebSocket'],
            results: '50% improvement in patient flow management'
        },
        {
            id: 4,
            title: 'Smart Parking Solution',
            category: 'commercial',
            client: 'Metro Mall Complex',
            image: '/HomePage/Smart Parking Solution.jpg',
            description: 'Automated parking management with real-time availability',
            technologies: ['IoT Sensors', 'Python', 'React', 'AWS'],
            results: '60% increase in parking utilization'
        }
    ];

    const testimonials = [
        {
            name: 'Rajesh Sharma',
            company: 'Sharma Industries',
            rating: 5,
            text: 'Smart Tech Solutions transformed our factory with their Industry 4.0 implementation. Production efficiency increased by 35%.',
            image: '/api/placeholder/100/100'
        },
        {
            name: 'Priya Patel',
            company: 'Modern Homes',
            rating: 5,
            text: 'The smart home system they installed is amazing. Complete control through mobile app and significant energy savings.',
            image: '/api/placeholder/100/100'
        },
        {
            name: 'Dr. Amit Kumar',
            company: 'Kumar Clinic',
            rating: 5,
            text: 'Their custom software solution streamlined our clinic operations. Patient management is now seamless and efficient.',
            image: '/api/placeholder/100/100'
        }
    ];



    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                                Transform Your Business with Smart IoT & Software Solutions
                            </h1>
                            <p className="text-xl mb-8 text-blue-100">
                                {stats.companyInfo.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/contact">
                                    <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center">
                                        Get Free Consultation
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </button>
                                </Link>
                                <Link to="/contact">
                                    <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center">
                                        <Play className="mr-2 w-5 h-5" />
                                        Watch Demo
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/20 rounded-lg p-4 text-center">
                                        <Home className="w-8 h-8 mx-auto mb-2" />
                                        <div className="text-sm">Smart Homes</div>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-4 text-center">
                                        <Factory className="w-8 h-8 mx-auto mb-2" />
                                        <div className="text-sm">Industry 4.0</div>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-4 text-center">
                                        <Smartphone className="w-8 h-8 mx-auto mb-2" />
                                        <div className="text-sm">Mobile Apps</div>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-4 text-center">
                                        <Globe className="w-8 h-8 mx-auto mb-2" />
                                        <div className="text-sm">Web Solutions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-50 rounded-lg p-6">
                                <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-3xl font-bold text-blue-600 mb-1">
                                    {loading ? '...' : stats.totalJobs}
                                </div>
                                <div className="text-gray-600 text-sm">Active Projects</div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-50 rounded-lg p-6">
                                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <div className="text-3xl font-bold text-green-600 mb-1">
                                    {loading ? '...' : stats.totalApplications}
                                </div>
                                <div className="text-gray-600 text-sm">Client Applications</div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-orange-50 rounded-lg p-6">
                                <GraduationCap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                <div className="text-3xl font-bold text-orange-600 mb-1">
                                    {loading ? '...' : stats.totalCompletedInternships}
                                </div>
                                <div className="text-gray-600 text-sm">Completed Projects</div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-50 rounded-lg p-6">
                                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <div className="text-3xl font-bold text-purple-600 mb-1">
                                    {loading ? '...' : stats.totalCertificates}
                                </div>
                                <div className="text-gray-600 text-sm">Certifications</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Overview */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Core Services
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprehensive technology solutions tailored to transform your business operations
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8">
                                <div className="text-blue-600 mb-4">{service.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                <p className="text-gray-600 mb-6">{service.description}</p>
                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-green-500 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                {/* <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center">
                                    Learn More <ArrowRight className="ml-1 w-4 h-4" />
                                </button> */}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Departments Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Expertise Areas
                        </h2>
                        <p className="text-xl text-gray-600">
                            Specialized departments delivering cutting-edge solutions
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {departments.map((department) => (
                                <div key={department._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{department.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{department.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                                Why Choose {stats.companyInfo.name}?
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { icon: <Target className="w-6 h-6" />, text: 'End-to-end solutions from hardware to mobile apps' },
                                    { icon: <Shield className="w-6 h-6" />, text: 'Affordable pricing with lifetime support' },
                                    { icon: <MapPin className="w-6 h-6" />, text: 'Local presence with global technology standards' },
                                    { icon: <Award className="w-6 h-6" />, text: `${stats.totalJobs}+ successful projects completed` },
                                    { icon: <Clock className="w-6 h-6" />, text: 'Real-time monitoring and control systems' }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="text-green-600 mr-4 mt-1">{item.icon}</div>
                                        <span className="text-gray-700 text-lg">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {loading ? '...' : stats.totalJobs}+
                                </div>
                                <div className="text-gray-600">Projects Completed</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-6 text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {loading ? '...' : Math.floor(stats.totalApplications / 3)}+
                                </div>
                                <div className="text-gray-600">Happy Clients</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-6 text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                                <div className="text-gray-600">Support Available</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-6 text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {new Date().getFullYear() - parseInt(stats.companyInfo.established)}+
                                </div>
                                <div className="text-gray-600">Years Experience</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Featured Projects
                        </h2>
                        <p className="text-xl text-gray-600">
                            Showcasing our latest successful implementations
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.slice(0, 3).map((project) => (
                            <div key={project.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                    <p className="text-gray-600 mb-4">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.slice(0, 2).map((tech, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    {/* <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center">
                                        View Details <ArrowRight className="ml-1 w-4 h-4" />
                                    </button> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Client Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Our Clients Say
                        </h2>
                        <p className="text-xl text-gray-600">
                            Trusted by businesses across various industries
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md p-8">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-gray-500 text-sm">Photo</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                        <div className="text-gray-500 text-sm">{testimonial.company}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Start Your Project?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Get a free consultation and project estimate today
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/contact">
                            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                                Get Free Consultation
                            </button>
                        </Link>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                            Call Now: {stats.companyInfo.phone}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage