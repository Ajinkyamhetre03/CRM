import React, { useState } from 'react';

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

const PortfolioPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Sample data for dynamic content
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



    const filteredProjects = selectedCategory === 'all'
        ? projects
        : projects.filter(project => project.category === selectedCategory);

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Showcasing our successful projects across various industries and technologies
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {[
                        { key: 'all', label: 'All Projects' },
                        { key: 'smart-home', label: 'Smart Home' },
                        { key: 'industrial', label: 'Industrial' },
                        { key: 'software', label: 'Software' },
                        { key: 'commercial', label: 'Commercial' }
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setSelectedCategory(filter.key)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${selectedCategory === filter.key
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Project Image</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm capitalize">
                                        {project.category.replace('-', ' ')}
                                    </span>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">Client: {project.client}</p>
                                <p className="text-gray-600 mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.map((tech, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-sm text-green-600 font-medium mb-3">
                                        <TrendingUp className="w-4 h-4 inline mr-1" />
                                        {project.results}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center text-sm">
                                            View Details <ChevronRight className="ml-1 w-4 h-4" />
                                        </button>
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Featured Case Study */}
                <section className="bg-gray-50 rounded-2xl p-8 lg:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Case Study</h2>
                        <p className="text-xl text-gray-600">Deep dive into our most impactful project</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Manufacturing Transformation</h3>
                            <p className="text-gray-600 mb-6">
                                Complete digital transformation of a traditional manufacturing unit into a smart,
                                connected factory with real-time monitoring and predictive analytics.
                            </p>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
                                    <p className="text-gray-600 text-sm">
                                        Manual processes, lack of real-time visibility, frequent equipment breakdowns,
                                        and inefficient resource utilization.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Solution</h4>
                                    <p className="text-gray-600 text-sm">
                                        Implemented IoT sensors, real-time dashboard, predictive maintenance system,
                                        and automated quality control with mobile app integration.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Results</h4>
                                    <ul className="text-gray-600 text-sm space-y-1">
                                        <li>• 35% increase in production efficiency</li>
                                        <li>• 50% reduction in equipment downtime</li>
                                        <li>• 25% decrease in operational costs</li>
                                        <li>• Real-time visibility across all processes</li>
                                    </ul>
                                </div>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                                Download Full Case Study
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4 shadow">
                                <h4 className="font-semibold text-gray-900 mb-2">Technologies Used</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['IoT Sensors', 'MQTT', 'React Dashboard', 'Node.js', 'MongoDB', 'AWS Cloud'].map((tech) => (
                                        <span key={tech} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow">
                                <h4 className="font-semibold text-gray-900 mb-2">Project Timeline</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Planning & Design</span>
                                        <span>2 weeks</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Hardware Installation</span>
                                        <span>3 weeks</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Software Development</span>
                                        <span>4 weeks</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Testing & Deployment</span>
                                        <span>2 weeks</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow">
                                <h4 className="font-semibold text-gray-900 mb-2">Client Testimonial</h4>
                                <p className="text-gray-600 text-sm italic">
                                    "The transformation has been remarkable. We now have complete visibility
                                    of our operations and can make data-driven decisions in real-time."
                                </p>
                                <p className="text-gray-500 text-xs mt-2">- Manufacturing Director</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default PortfolioPage