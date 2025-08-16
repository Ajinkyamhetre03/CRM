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

const ResourcesPage = () => {

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



    return (
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Resources & Insights</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Stay updated with the latest trends, tutorials, and insights in IoT and software development
                    </p>
                </div>

                {/* Featured Article */}
                <section className="mb-16">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 lg:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">Featured Article</span>
                                <h2 className="text-3xl font-bold mt-4 mb-4">
                                    The Future of Smart Manufacturing in India
                                </h2>
                                <p className="text-blue-100 mb-6">
                                    Exploring how Industry 4.0 technologies are revolutionizing manufacturing
                                    processes and creating new opportunities for businesses across India.
                                </p>
                                <div className="flex items-center text-blue-100 text-sm mb-6">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>December 20, 2024</span>
                                    <span className="mx-2">•</span>
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>10 min read</span>
                                </div>
                                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
                                    Read Full Article
                                </button>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg h-64 flex items-center justify-center">
                                <span className="text-white/60">Featured Article Image</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Article Categories */}
                <section className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-green-50 rounded-xl p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Settings className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Tutorials</h3>
                            <p className="text-gray-600 mb-4">Step-by-step guides and implementation tutorials</p>
                            <span className="text-green-600 font-semibold">12 Articles</span>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Industry Insights</h3>
                            <p className="text-gray-600 mb-4">Latest trends and market analysis</p>
                            <span className="text-blue-600 font-semibold">8 Articles</span>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-6 text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Award className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Case Studies</h3>
                            <p className="text-gray-600 mb-4">Detailed project breakdowns and success stories</p>
                            <span className="text-purple-600 font-semibold">15 Articles</span>
                        </div>
                    </div>
                </section>

                {/* Recent Articles */}
                <section className="mb-16">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Articles</h2>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>All Categories</option>
                                <option>Technical</option>
                                <option>Industry</option>
                                <option>Case Studies</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">Article Image</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                                            {post.category}
                                        </span>
                                        <span className="text-gray-500 text-sm">{post.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {new Date(post.date).toLocaleDateString()}
                                        </div>
                                        <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center">
                                            Read More <ArrowRight className="ml-1 w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Newsletter Signup */}
                <section className="bg-gray-900 text-white rounded-2xl p-8 lg:p-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                        <p className="text-gray-300 mb-8">
                            Subscribe to our newsletter and get the latest insights on IoT, Industry 4.0,
                            and software development delivered to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm mt-4">
                            No spam, unsubscribe at any time. We respect your privacy.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ResourcesPage