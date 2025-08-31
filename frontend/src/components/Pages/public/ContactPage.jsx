import { useState } from 'react';
import {
    Phone,
    Mail,
    MapPin,
    Calendar,
    TrendingUp,
    Send,
    MessageCircle,
    Clock,
    Building2,
    Users,
    Globe,
    CheckCircle,
    AlertCircle,
    Loader2,
    ArrowRight,
    Star,
    Award,
    Shield,
    Headphones,
    ExternalLink,
    Download
} from 'lucide-react';

const ContactPage = () => {
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    // Since no API, we just simulate a submit process
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        setTimeout(() => {
            setSubmitStatus('success');
            setStatusMessage("Thanks! Your message has been recorded. We'll get back to you within 24 hours.");
            setContactForm({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setIsSubmitting(false);
        }, 1500);
    };

    const handleInputChange = (e) => {
        setContactForm({
            ...contactForm,
            [e.target.name]: e.target.value
        });
    };

    const stats = [
        { number: '500+', label: 'Projects Delivered', icon: <Award className="w-6 h-6" /> },
        { number: '100+', label: 'Happy Clients', icon: <Users className="w-6 h-6" /> },
        { number: '24/7', label: 'Support Available', icon: <Headphones className="w-6 h-6" /> },
        { number: '5+', label: 'Years Experience', icon: <Star className="w-6 h-6" /> }
    ];

    const contactMethods = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: 'Phone',
            info: '+91 98765 43210',
            description: 'Mon-Sat, 9AM-7PM IST',
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-600'
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: 'Email',
            info: 'info@zyntarix.com',
            description: '24/7 Email Support',
            color: 'green',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-600'
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            title: 'WhatsApp',
            info: '+91 98765 43210',
            description: 'Quick Support',
            color: 'emerald',
            bgColor: 'bg-emerald-50',
            iconBg: 'bg-emerald-600'
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: 'Office',
            info: 'Technology Park, Pune',
            description: 'Maharashtra, India',
            color: 'purple',
            bgColor: 'bg-purple-50',
            iconBg: 'bg-purple-600'
        }
    ];

    const services = [
        'Smart Home Automation',
        'Software Development', 
        'Industry 4.0 Solutions',
        'AI & Machine Learning',
        'Cloud Solutions',
        'IoT Development',
        'Mobile App Development',
        'Web Development',
        'Consultation',
        'Partnership Inquiry',
        'Career Opportunities',
        'Other'
    ];

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1800&q=80"
                    alt="Contact Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                        Get In <span className="bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                        Ready to transform your business with smart technology solutions? Let's discuss your project requirements.
                    </p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-blue-300 mb-2 flex justify-center">{stat.icon}</div>
                                <div className="text-2xl font-bold mb-1">{stat.number}</div>
                                <div className="text-blue-200 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Multiple Ways to <span className="text-blue-600">Connect</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Choose your preferred method to get in touch with our team
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactMethods.map((method, index) => (
                            <div key={index} className={`${method.bgColor} rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer group`}>
                                <div className={`w-16 h-16 ${method.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-white`}>
                                    {method.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                                <p className={`font-semibold mb-2 text-${method.color}-600 text-lg`}>{method.info}</p>
                                <p className="text-gray-600 text-sm">{method.description}</p>
                                {method.title === 'WhatsApp' && (
                                    <button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center mx-auto">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Chat Now
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Information */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 sticky top-8">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start group">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold text-gray-900">Phone</p>
                                            <p className="text-blue-600 font-medium">+91 98765 43210</p>
                                            <p className="text-sm text-gray-600">Mon-Sat, 9AM-7PM IST</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start group">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold text-gray-900">Email</p>
                                            <p className="text-green-600 font-medium">info@zyntarix.com</p>
                                            <p className="text-sm text-gray-600">24/7 Email Support</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start group">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold text-gray-900">Office Address</p>
                                            <p className="text-gray-700">Zyntarix Technologies</p>
                                            <p className="text-sm text-gray-600">Technology Park, Pune</p>
                                            <p className="text-sm text-gray-600">Maharashtra, India 411057</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex items-center mb-4">
                                        <Clock className="w-5 h-5 text-gray-600 mr-2" />
                                        <h3 className="font-bold text-gray-900">Business Hours</h3>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700">Monday - Friday</span>
                                            <span className="font-medium text-gray-900">9:00 AM - 7:00 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700">Saturday</span>
                                            <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700">Sunday</span>
                                            <span className="font-medium text-red-600">Closed</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-8 space-y-3">
                                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        WhatsApp Us
                                    </button>
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Schedule Call
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
                                <h2 className="text-3xl font-bold mb-6 text-gray-900">Send us a Message</h2>
                                <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>

                                {/* Status Messages */}
                                {submitStatus === 'success' && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                        <span className="text-green-800">{statusMessage}</span>
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                                        <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                                        <span className="text-red-800">{statusMessage}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={contactForm.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={contactForm.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={contactForm.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="+91-9876543210"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                required
                                                value={contactForm.subject}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            >
                                                <option value="">Select subject</option>
                                                {services.map(service => (
                                                    <option key={service} value={service}>{service}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Project Description *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={6}
                                            value={contactForm.message}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                                            placeholder="Tell us about your project requirements, timeline, and budget..."
                                        />
                                    </div>

                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id="agree"
                                            required
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                                        />
                                        <label htmlFor="agree" className="ml-3 text-sm text-gray-600">
                                            I agree to the <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">Privacy Policy</span> and
                                            <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium"> Terms of Service</span>.
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center transition-all hover:scale-105 disabled:hover:scale-100"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Sending Message...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-sm text-gray-600 mt-4">
                                        Or call us directly at <span className="font-semibold text-blue-600">+91 98765 43210</span>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Visit Our <span className="text-blue-600">Office</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Located in the heart of Pune's technology district, easily accessible by all modes of transport
                        </p>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <div className="w-full h-96 lg:h-[500px]">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30233.80096103006!2d73.84032425428647!3d18.698736825474352"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Zyntarix Technologies Location"
                                        className="rounded-l-2xl"
                                    />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Location</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <MapPin className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                                        <div>
                                            <p className="font-semibold text-gray-900">Zyntarix Technologies</p>
                                            <p className="text-gray-600">Technology Park, Pimpri</p>
                                            <p className="text-gray-600">Maharashtra, India 411057</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-blue-600 mr-3" />
                                        <p className="text-gray-700">Open Mon-Sat, 9AM-7PM</p>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="w-5 h-5 text-blue-600 mr-3" />
                                        <p className="text-gray-700">Walk-ins welcome</p>
                                    </div>
                                </div>
                                <button className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Get Directions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {/* <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                        Join hundreds of satisfied clients who have transformed their businesses with our solutions
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center">
                            <Calendar className="mr-2 w-6 h-6" />
                            Book Free Consultation
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center">
                            <Download className="mr-2 w-6 h-6" />
                            Download Brochure
                        </button>
                    </div>
                </div>
            </section> */}
        </div>
    );
};

export default ContactPage;

