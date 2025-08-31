
import React from 'react'
import {
    Home,
    Settings,
    Phone,
    Mail,
    ArrowRight,
    Check,
    Star,
    Award,
    Users,
    Factory,
    Zap,
    Shield,
    Clock,
    Target,
    ChevronRight,
    X
} from 'lucide-react';

const ServicePage = () => {
    const services = [
        {
            id: 'iot',
            title: 'Smart Home & IoT Solutions',
            icon: <Home className="w-12 h-12" />,
            description: 'Complete smart home automation with mobile app control',
            features: ['Lighting Control', 'Climate Management', 'Security Systems', 'Energy Monitoring'],
            image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
            color: 'blue'
        },
        {
            id: 'software',
            title: 'Custom Software Development',
            icon: <Settings className="w-12 h-12" />,
            description: 'Enterprise solutions and web/mobile applications',
            features: ['Web Applications', 'Mobile Apps', 'CRM Systems', 'ERP Solutions'],
            image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
            color: 'green'
        },
        {
            id: 'industry40',
            title: 'Industry 4.0 & Factory Automation',
            icon: <Factory className="w-12 h-12" />,
            description: 'Industrial automation and data analytics solutions',
            features: ['PLC Programming', 'Process Automation', 'Real-time Monitoring', 'Predictive Maintenance'],
            image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80',
            color: 'purple'
        }
    ];

    const projects = [
        {
            id: 1,
            title: 'Smart Manufacturing Dashboard',
            category: 'industrial',
            client: 'ABC Manufacturing Ltd.',
            image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
            description: 'Real-time production monitoring system with predictive analytics',
            technologies: ['React', 'Node.js', 'MongoDB', 'MQTT'],
            results: '30% increase in production efficiency'
        },
        {
            id: 2,
            title: 'Residential Smart Home System',
            category: 'smart-home',
            client: 'Private Residence',
            image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
            description: 'Complete home automation with voice control and mobile app',
            technologies: ['IoT Sensors', 'Arduino', 'React Native', 'Firebase'],
            results: '40% reduction in energy consumption'
        },
        {
            id: 3,
            title: 'Hospital Management System',
            category: 'software',
            client: 'City General Hospital',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
            description: 'Comprehensive hospital management with patient tracking',
            technologies: ['React', 'Express.js', 'PostgreSQL', 'WebSocket'],
            results: '50% improvement in patient flow management'
        },
        {
            id: 4,
            title: 'Smart Parking Solution',
            category: 'commercial',
            client: 'Metro Mall Complex',
            image: 'https://images.unsplash.com/photo-1424746219973-8fe3bd07d8e9?auto=format&fit=crop&w=400&q=80',
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
            image: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            name: 'Priya Patel',
            company: 'Modern Homes',
            rating: 5,
            text: 'The smart home system they installed is amazing. Complete control through mobile app and significant energy savings.',
            image: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
            name: 'Dr. Amit Kumar',
            company: 'Kumar Clinic',
            rating: 5,
            text: 'Their custom software solution streamlined our clinic operations. Patient management is now seamless and efficient.',
            image: 'https://randomuser.me/api/portraits/men/54.jpg'
        }
    ];

    const blogPosts = [
        {
            id: 1,
            title: 'Getting Started with Smart Home Automation',
            excerpt: 'A comprehensive guide to implementing smart home solutions for modern living.',
            date: '2024-12-15',
            category: 'Smart Home',
            readTime: '5 min read',
            image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 2,
            title: 'Industry 4.0: The Future of Manufacturing',
            excerpt: 'How IoT and automation are revolutionizing the manufacturing industry.',
            date: '2024-12-10',
            category: 'Industry 4.0',
            readTime: '8 min read',
            image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 3,
            title: 'IoT Security Best Practices',
            excerpt: 'Essential security measures for IoT implementations in business environments.',
            date: '2024-12-05',
            category: 'Security',
            readTime: '6 min read',
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80'
        }
    ];

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80"
                    alt="Services Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                        Our <span className="bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">Services</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                        Comprehensive technology solutions designed to transform your business operations and drive growth
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center">
                            Explore Services
                            <ArrowRight className="ml-2 w-6 h-6" />
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center">
                            <Phone className="mr-2 w-6 h-6" />
                            Get Quote
                        </button>
                    </div>
                </div>
            </section>

            {/* Service Overview */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                            What We Offer
                        </h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                            End-to-end technology solutions tailored to modernize your business
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-500 hover:-translate-y-2 p-8">
                                <img src={service.image} alt={service.title} className="rounded-xl w-full h-40 object-cover mb-6 shadow-md" />
                                <div className={`text-${service.color}-600 mb-6`}>{service.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                <p className="text-gray-600 mb-6">{service.description}</p>
                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-center text-sm text-gray-700">
                                            <Check className="w-4 h-4 text-green-500 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full bg-gradient-to-r from-${service.color}-600 to-${service.color}-700 hover:from-${service.color}-700 hover:to-${service.color}-800 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105`}>
                                    Learn More
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* IoT & Smart Solutions */}
            <section className="py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 lg:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="flex items-center mb-6">
                                    <Home className="w-10 h-10 text-blue-600 mr-4" />
                                    <h2 className="text-3xl font-bold text-gray-900">IoT & Smart Solutions</h2>
                                </div>
                                <p className="text-lg text-gray-600 mb-8">
                                    Transform your environment with intelligent automation and IoT solutions that provide
                                    real-time control, monitoring, and optimization of your systems.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Home Automation</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Lighting control systems</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Climate control and energy management</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Security and safety systems</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Utility management</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Mobile app integration</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Voice control compatibility</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Health Tech Solutions</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Vital signs monitoring</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Fitness and wellness tracking</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Elderly care systems</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Medical device integration</li>
                                        </ul>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">Commercial IoT</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Smart parking systems</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Asset tracking solutions</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Environmental monitoring</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Energy management systems</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">IoT Pricing</h3>
                                <div className="space-y-4">
                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Basic Smart Home</span>
                                            <span className="font-bold text-blue-600 text-xl">₹25,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Commercial IoT</span>
                                            <span className="font-bold text-blue-600 text-xl">₹50,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Health Tech Solutions</span>
                                            <span className="font-bold text-blue-600 text-xl">₹35,000+</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold mt-8 transition-all hover:scale-105">
                                    Request Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Software Development */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 lg:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="bg-white rounded-2xl p-8 shadow-lg order-2 lg:order-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Software Pricing</h3>
                                <div className="space-y-4">
                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Basic Website</span>
                                            <span className="font-bold text-green-600 text-xl">₹15,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Custom CRM/ERP</span>
                                            <span className="font-bold text-green-600 text-xl">₹75,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Mobile App</span>
                                            <span className="font-bold text-green-600 text-xl">₹50,000+</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-semibold mt-8 transition-all hover:scale-105">
                                    Request Quote
                                </button>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="flex items-center mb-6">
                                    <Settings className="w-10 h-10 text-green-600 mr-4" />
                                    <h2 className="text-3xl font-bold text-gray-900">Custom Software Development</h2>
                                </div>
                                <p className="text-lg text-gray-600 mb-8">
                                    Tailored software solutions that streamline your business processes and enhance productivity
                                    through modern web and mobile applications.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Enterprise Solutions</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Custom CRM systems</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />ERP solutions</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />HR and attendance systems</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Inventory management</li>
                                        </ul>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">System Integration</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />API development</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Database optimization</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Cloud migration</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Third-party integrations</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Web & Mobile Apps</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Business websites</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />E-commerce platforms</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Mobile apps (iOS/Android)</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Progressive Web Apps</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Industry 4.0 */}
            <section className="py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 lg:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="flex items-center mb-6">
                                    <Factory className="w-10 h-10 text-purple-600 mr-4" />
                                    <h2 className="text-3xl font-bold text-gray-900">Industry 4.0 & Factory Automation</h2>
                                </div>
                                <p className="text-lg text-gray-600 mb-8">
                                    Revolutionary industrial automation solutions that transform manufacturing processes
                                    through smart technologies and data-driven insights.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Factory Automation</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />PLC programming</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Machine-to-machine communication</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Process automation</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Quality control systems</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Data Analytics</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Real-time dashboards</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Predictive maintenance</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Production optimization</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Performance analytics</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Communication Protocols</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {['MQTT', 'WebSocket', 'REST API', 'OPC-UA', 'Modbus', 'TCP/IP'].map((protocol) => (
                                            <span key={protocol} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {protocol}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Industry 4.0 Pricing</h3>
                                <div className="space-y-4">
                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Basic Automation</span>
                                            <span className="font-bold text-purple-600 text-xl">₹1,00,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Complete Factory Setup</span>
                                            <span className="font-bold text-purple-600 text-xl">₹5,00,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-200 pb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Analytics Dashboard</span>
                                            <span className="font-bold text-purple-600 text-xl">₹75,000+</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl font-semibold mt-8 transition-all hover:scale-105">
                                    Request Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Comparison */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Service Comparison</h2>
                        <p className="text-xl text-gray-600">Choose the right solution for your needs</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Feature</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">IoT Solutions</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Software Dev</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Industry 4.0</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {[
                                    { feature: 'Hardware Integration', iot: true, software: false, industry: true },
                                    { feature: 'Mobile App', iot: true, software: true, industry: true },
                                    { feature: 'Real-time Monitoring', iot: true, software: false, industry: true },
                                    { feature: 'Data Analytics', iot: true, software: true, industry: true },
                                    { feature: 'Cloud Integration', iot: true, software: true, industry: true },
                                    { feature: 'Custom Development', iot: false, software: true, industry: true },
                                    { feature: 'Industrial Protocols', iot: false, software: false, industry: true },
                                ].map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                                        <td className="px-6 py-4 text-center">
                                            {row.iot ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {row.software ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {row.industry ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Projects Showcase */}
            <section className="py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Featured Projects
                        </h2>
                        <p className="text-xl text-gray-600">
                            Real-world implementations delivering measurable results
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                <div className="h-48 bg-gray-100 flex items-center justify-center">
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                    <p className="text-gray-600 mb-4 text-sm">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.slice(0, 2).map((tech, i) => (
                                            <span key={i} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-green-600 text-sm font-semibold">{project.results}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            What Our Clients Say
                        </h2>
                        <p className="text-xl text-gray-600">
                            Trusted by businesses across various industries
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col gap-4">
                                <div className="flex items-center mb-2">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-3 italic">"{testimonial.text}"</p>
                                <div className="flex items-center gap-4">
                                    <img src={testimonial.image} alt="Client" className="w-12 h-12 object-cover rounded-full border-2 border-blue-100 shadow" />
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

            {/* Blog/Resources */}
            <section className="py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Latest Insights
                        </h2>
                        <p className="text-xl text-gray-600">
                            Stay updated with the latest technology trends and best practices
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <div key={post.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">{post.category}</span>
                                        <span className="text-gray-500 text-sm">{post.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 text-sm">{post.date}</span>
                                        <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
                                            Read More <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            {/* <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Get a free consultation and discover how our solutions can help you grow
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center">
                            <Mail className="mr-2 w-6 h-6" />
                            Get Free Consultation
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center">
                            <Phone className="mr-2 w-6 h-6" />
                            Call Now: +91-9876543210
                        </button>
                    </div>
                </div>
            </section> */}
        </div>
    )
}

export default ServicePage
