import React from 'react'
import {
    Home,
    User,
    Settings,
    Phone,
    Mail,
    MapPin,
    Menu,
    X,
    ArrowRight,
    Check,
    Star,
    Play,
    Calendar,
    Award,
    Users,
    Globe,
    Smartphone,
    Factory,
    Zap,
    Shield,
    Clock,
    Target,
    TrendingUp,
    ChevronRight,
    ExternalLink,
    Download,
    Filter,
    Search,
    Send,
    MessageCircle
} from 'lucide-react';


const ServicePage = () => {
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
            image: '/api/placeholder/400/300',
            description: 'Real-time production monitoring system with predictive analytics',
            technologies: ['React', 'Node.js', 'MongoDB', 'MQTT'],
            results: '30% increase in production efficiency'
        },
        {
            id: 2,
            title: 'Residential Smart Home System',
            category: 'smart-home',
            client: 'Private Residence',
            image: '/api/placeholder/400/300',
            description: 'Complete home automation with voice control and mobile app',
            technologies: ['IoT Sensors', 'Arduino', 'React Native', 'Firebase'],
            results: '40% reduction in energy consumption'
        },
        {
            id: 3,
            title: 'Hospital Management System',
            category: 'software',
            client: 'City General Hospital',
            image: '/api/placeholder/400/300',
            description: 'Comprehensive hospital management with patient tracking',
            technologies: ['React', 'Express.js', 'PostgreSQL', 'WebSocket'],
            results: '50% improvement in patient flow management'
        },
        {
            id: 4,
            title: 'Smart Parking Solution',
            category: 'commercial',
            client: 'Metro Mall Complex',
            image: '/api/placeholder/400/300',
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

    const blogPosts = [
        {
            id: 1,
            title: 'Getting Started with Smart Home Automation',
            excerpt: 'A comprehensive guide to implementing smart home solutions for modern living.',
            date: '2024-12-15',
            category: 'Smart Home',
            readTime: '5 min read'
        },
        {
            id: 2,
            title: 'Industry 4.0: The Future of Manufacturing',
            excerpt: 'How IoT and automation are revolutionizing the manufacturing industry.',
            date: '2024-12-10',
            category: 'Industry 4.0',
            readTime: '8 min read'
        },
        {
            id: 3,
            title: 'IoT Security Best Practices',
            excerpt: 'Essential security measures for IoT implementations in business environments.',
            date: '2024-12-05',
            category: 'Security',
            readTime: '6 min read'
        }
    ];
    return (
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Comprehensive technology solutions designed to transform your business operations and drive growth
                    </p>
                </div>

                {/* IoT & Smart Solutions */}
                <section className="mb-20">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 lg:p-12">
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
                            <div className="bg-white rounded-lg p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">IoT Pricing</h3>
                                <div className="space-y-4">
                                    <div className="border-b pb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Basic Smart Home</span>
                                            <span className="font-bold text-blue-600">₹25,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b pb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Commercial IoT</span>
                                            <span className="font-bold text-blue-600">₹50,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b pb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Health Tech Solutions</span>
                                            <span className="font-bold text-blue-600">₹35,000+</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setCurrentPage('contact')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mt-6"
                                >
                                    Request Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Software Development */}
                <section className="mb-20">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 lg:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="bg-white rounded-lg p-6 shadow-lg order-2 lg:order-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Software Pricing</h3>
                                <div className="space-y-4">
                                    <div className="border-b pb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Basic Website</span>
                                            <span className="font-bold text-green-600">₹15,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b pb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Custom CRM/ERP</span>
                                            <span className="font-bold text-green-600">₹75,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b pb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Mobile App</span>
                                            <span className="font-bold text-green-600">₹50,000+</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setCurrentPage('contact')}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold mt-6"
                                >
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
                </section>

                {/* Industry 4.0 */}
                <section className="mb-20">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-8 lg:p-12">
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
                                            <span key={protocol} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
                                                {protocol}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Industry 4.0 Pricing</h3>
                                <div className="space-y-4">
                                    <div className="border-b pb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Basic Automation</span>
                                            <span className="font-bold text-purple-600">₹1,00,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b pb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Complete Factory Setup</span>
                                            <span className="font-bold text-purple-600">₹5,00,000+</span>
                                        </div>
                                    </div>
                                    <div className="border-b pb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Analytics Dashboard</span>
                                            <span className="font-bold text-purple-600">₹75,000+</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setCurrentPage('contact')}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold mt-6"
                                >
                                    Request Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Service Comparison */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Comparison</h2>
                        <p className="text-xl text-gray-600">Choose the right solution for your needs</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Feature</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase">IoT Solutions</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase">Software Dev</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase">Industry 4.0</th>
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
                                    <tr key={index}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                                        <td className="px-6 py-4 text-center">
                                            {row.iot ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {row.software ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {row.industry ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ServicePage