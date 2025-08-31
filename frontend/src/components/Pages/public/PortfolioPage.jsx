
import React, { useState } from 'react';
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
    TrendingUp,
    ChevronRight,
    ExternalLink,
    Download,
    Filter,
    Search,
    Send,
    MessageCircle,
    Calendar,
    Eye,
    ThumbsUp
} from 'lucide-react';

const PortfolioPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

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
            image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
            description: 'Real-time production monitoring system with predictive analytics and automated quality control',
            technologies: ['React', 'Node.js', 'MongoDB', 'MQTT', 'IoT Sensors'],
            results: '30% increase in production efficiency',
            duration: '3 months',
            featured: true
        },
        {
            id: 2,
            title: 'Residential Smart Home System',
            category: 'smart-home',
            client: 'Private Residence',
            image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
            description: 'Complete home automation with voice control and mobile app integration',
            technologies: ['IoT Sensors', 'Arduino', 'React Native', 'Firebase'],
            results: '40% reduction in energy consumption',
            duration: '2 months'
        },
        {
            id: 3,
            title: 'Hospital Management System',
            category: 'software',
            client: 'City General Hospital',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
            description: 'Comprehensive hospital management with patient tracking and appointment scheduling',
            technologies: ['React', 'Express.js', 'PostgreSQL', 'WebSocket'],
            results: '50% improvement in patient flow management',
            duration: '4 months'
        },
        {
            id: 4,
            title: 'Smart Parking Solution',
            category: 'commercial',
            client: 'Metro Mall Complex',
            image: 'https://images.unsplash.com/photo-1424746219973-8fe3bd07d8e9?auto=format&fit=crop&w=400&q=80',
            description: 'Automated parking management with real-time availability and mobile payments',
            technologies: ['IoT Sensors', 'Python', 'React', 'AWS'],
            results: '60% increase in parking utilization',
            duration: '2.5 months'
        },
        {
            id: 5,
            title: 'E-commerce Platform',
            category: 'software',
            client: 'Fashion Retailer',
            image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=400&q=80',
            description: 'Modern e-commerce platform with AI-powered recommendations',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
            results: '200% increase in online sales',
            duration: '3.5 months'
        },
        {
            id: 6,
            title: 'Industrial Monitoring System',
            category: 'industrial',
            client: 'Steel Manufacturing',
            image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80',
            description: 'Real-time monitoring of industrial equipment with predictive maintenance',
            technologies: ['PLC', 'SCADA', 'React', 'InfluxDB'],
            results: '45% reduction in downtime',
            duration: '5 months'
        }
    ];

    const testimonials = [
        {
            name: 'Rajesh Sharma',
            company: 'Sharma Industries',
            rating: 5,
            text: 'Smart Tech Solutions transformed our factory with their Industry 4.0 implementation. Production efficiency increased by 35%.',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            position: 'CEO'
        },
        {
            name: 'Priya Patel',
            company: 'Modern Homes',
            rating: 5,
            text: 'The smart home system they installed is amazing. Complete control through mobile app and significant energy savings.',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
            position: 'Homeowner'
        },
        {
            name: 'Dr. Amit Kumar',
            company: 'Kumar Clinic',
            rating: 5,
            text: 'Their custom software solution streamlined our clinic operations. Patient management is now seamless and efficient.',
            image: 'https://randomuser.me/api/portraits/men/54.jpg',
            position: 'Medical Director'
        }
    ];

    const stats = [
        { number: '50+', label: 'Projects Completed', icon: <Award className="w-8 h-8" /> },
        { number: '30+', label: 'Happy Clients', icon: <Users className="w-8 h-8" /> },
        { number: '5+', label: 'Years Experience', icon: <Clock className="w-8 h-8" /> },
        { number: '100%', label: 'Success Rate', icon: <Target className="w-8 h-8" /> }
    ];

    const filteredProjects = selectedCategory === 'all'
        ? projects
        : projects.filter(project => project.category === selectedCategory);

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80"
                    alt="Portfolio Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                        Our <span className="bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">Portfolio</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                        Showcasing our successful projects across various industries and cutting-edge technologies
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center">
                            View Projects
                            <ArrowRight className="ml-2 w-6 h-6" />
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center">
                            <Download className="mr-2 w-6 h-6" />
                            Download Portfolio
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100 p-6 transition-transform duration-300 hover:-translate-y-1">
                                <div className="text-blue-600 mb-4 flex justify-center">{stat.icon}</div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filter Buttons */}
            <section className="py-12 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Featured <span className="text-blue-600">Projects</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explore our diverse portfolio of successful implementations
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {[
                            { key: 'all', label: 'All Projects', icon: <Target className="w-4 h-4" /> },
                            { key: 'smart-home', label: 'Smart Home', icon: <Home className="w-4 h-4" /> },
                            { key: 'industrial', label: 'Industrial', icon: <Factory className="w-4 h-4" /> },
                            { key: 'software', label: 'Software', icon: <Settings className="w-4 h-4" /> },
                            { key: 'commercial', label: 'Commercial', icon: <Users className="w-4 h-4" /> }
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setSelectedCategory(filter.key)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                    selectedCategory === filter.key
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                                }`}
                            >
                                {filter.icon}
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={project.image} 
                                        alt={project.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {project.featured && (
                                        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Featured
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                                        <ExternalLink className="w-4 h-4 text-gray-600" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                                            {project.category.replace('-', ' ')}
                                        </span>
                                        <span className="text-gray-500 text-sm flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {project.duration}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2 font-medium">Client: {project.client}</p>
                                    <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.slice(0, 3).map((tech, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
                                                +{project.technologies.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-green-600 font-semibold mb-3 flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                            {project.results}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center text-sm group">
                                                View Details 
                                                <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                            <div className="flex gap-2">
                                                <button className="text-gray-500 hover:text-blue-600 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="text-gray-500 hover:text-green-600 transition-colors">
                                                    <ThumbsUp className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Case Study */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12 border border-blue-100">
                        <div className="text-center mb-12">
                            <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                Featured Case Study
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Smart Manufacturing Transformation</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Deep dive into our most impactful Industry 4.0 implementation
                            </p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <img 
                                    src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" 
                                    alt="Smart Manufacturing"
                                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Digital Transformation</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Complete digital transformation of a traditional manufacturing unit into a smart,
                                    connected factory with real-time monitoring and predictive analytics.
                                </p>
                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl p-6 shadow-md">
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                            <Target className="w-5 h-5 text-red-500 mr-2" />
                                            Challenge
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Manual processes, lack of real-time visibility, frequent equipment breakdowns,
                                            and inefficient resource utilization.
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl p-6 shadow-md">
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                            <Zap className="w-5 h-5 text-blue-500 mr-2" />
                                            Solution
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Implemented IoT sensors, real-time dashboard, predictive maintenance system,
                                            and automated quality control with mobile app integration.
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl p-6 shadow-md">
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                                            Results
                                        </h4>
                                        <ul className="text-gray-600 text-sm space-y-1">
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />35% increase in production efficiency</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />50% reduction in equipment downtime</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />25% decrease in operational costs</li>
                                            <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Real-time visibility across all processes</li>
                                        </ul>
                                    </div>
                                </div>
                                <button className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center">
                                    <Download className="mr-2 w-5 h-5" />
                                    Download Full Case Study
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Project Details */}
            <section className="py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                <Settings className="w-6 h-6 text-blue-600 mr-2" />
                                Technologies Used
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['IoT Sensors', 'MQTT', 'React Dashboard', 'Node.js', 'MongoDB', 'AWS Cloud', 'Machine Learning', 'REST APIs'].map((tech) => (
                                    <span key={tech} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                <Clock className="w-6 h-6 text-green-600 mr-2" />
                                Project Timeline
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { phase: 'Planning & Design', duration: '2 weeks' },
                                    { phase: 'Hardware Installation', duration: '3 weeks' },
                                    { phase: 'Software Development', duration: '4 weeks' },
                                    { phase: 'Testing & Deployment', duration: '2 weeks' }
                                ].map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700 font-medium">{item.phase}</span>
                                        <span className="text-blue-600 font-semibold">{item.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                <MessageCircle className="w-6 h-6 text-purple-600 mr-2" />
                                Client Testimonial
                            </h4>
                            <p className="text-gray-600 text-sm italic mb-4 leading-relaxed">
                                "The transformation has been remarkable. We now have complete visibility
                                of our operations and can make data-driven decisions in real-time."
                            </p>
                            <div className="flex items-center">
                                <img 
                                    src="https://randomuser.me/api/portraits/men/45.jpg" 
                                    alt="Client"
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <p className="text-gray-900 font-semibold text-sm">Rajesh Kumar</p>
                                    <p className="text-gray-500 text-xs">Manufacturing Director</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Client Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            What Our Clients Say
                        </h2>
                        <p className="text-xl text-gray-600">
                            Success stories from our satisfied clients
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                                <div className="flex items-center">
                                    <img src={testimonial.image} alt="Client" className="w-12 h-12 object-cover rounded-full border-2 border-blue-100 shadow mr-4" />
                                    <div>
                                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                        <div className="text-gray-500 text-sm">{testimonial.position}</div>
                                        <div className="text-blue-600 text-sm font-medium">{testimonial.company}</div>
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
                        Ready to Start Your Project?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                        Let's discuss how we can bring your vision to life with our proven expertise
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center">
                            <Send className="mr-2 w-6 h-6" />
                            Start Your Project
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center">
                            <Phone className="mr-2 w-6 h-6" />
                            Schedule Consultation
                        </button>
                    </div>
                </div>
            </section> */}
        </div>
    );
}

export default PortfolioPage;
