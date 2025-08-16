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
    Loader2
} from 'lucide-react';

const ContactPage = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch(`${BASE_URL}/api/public/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactForm)
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                setStatusMessage(data.message || 'Thank you for your message! We will get back to you soon.');
                setContactForm({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                throw new Error(data.message || 'Failed to send message');
            }
        } catch (error) {
            setSubmitStatus('error');
            setStatusMessage(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setContactForm({
            ...contactForm,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Get In Touch
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Ready to transform your business with smart technology solutions? Let's discuss your project requirements.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                <span>500+ Projects Delivered</span>
                            </div>
                            <div className="flex items-center">
                                <Globe className="w-4 h-4 mr-2" />
                                <span>Global Presence</span>
                            </div>
                            <div className="flex items-center">
                                <Building2 className="w-4 h-4 mr-2" />
                                <span>Fortune 500 Clients</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-semibold text-gray-900">Phone</p>
                                        <p className="text-blue-600 font-medium">+91 98765 43210</p>
                                        <p className="text-sm text-gray-500">Mon-Sat, 9AM-7PM IST</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-semibold text-gray-900">Email</p>
                                        <p className="text-green-600 font-medium">info@smarttechsolutions.com</p>
                                        <p className="text-sm text-gray-500">24/7 Email Support</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-semibold text-gray-900">Office Address</p>
                                        <p className="text-gray-600">Smart Tech Solutions</p>
                                        <p className="text-sm text-gray-500">Technology Park, Pimpri</p>
                                        <p className="text-sm text-gray-500">Maharashtra, India</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MessageCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-semibold text-gray-900">WhatsApp</p>
                                        <p className="text-green-600 font-medium">+91 98765 43210</p>
                                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm mt-2 flex items-center transition-colors">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Chat on WhatsApp
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center mb-4">
                                    <Clock className="w-5 h-5 text-gray-600 mr-2" />
                                    <h3 className="font-bold text-gray-900">Business Hours</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Monday - Friday</span>
                                        <span className="font-medium text-gray-900">9:00 AM - 7:00 PM</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Saturday</span>
                                        <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Sunday</span>
                                        <span className="font-medium text-gray-900">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                    <span className="text-green-800">{statusMessage}</span>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                                    <span className="text-red-800">{statusMessage}</span>
                                </div>
                            )}

                            <div className="space-y-6">
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="your.email@company.com"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select subject</option>
                                            <option value="Smart Home Automation">Smart Home Automation</option>
                                            <option value="Software Development">Software Development</option>
                                            <option value="Industry 4.0 Solutions">Industry 4.0 Solutions</option>
                                            <option value="AI & Machine Learning">AI & Machine Learning</option>
                                            <option value="Cloud Solutions">Cloud Solutions</option>
                                            <option value="Consultation">Free Consultation</option>
                                            <option value="Partnership Inquiry">Partnership Inquiry</option>
                                            <option value="Career Opportunities">Career Opportunities</option>
                                            <option value="Internship Programs">Internship Programs</option>
                                            <option value="Other">Other</option>
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        placeholder="Tell us about your project requirements, timeline, budget, and any specific needs..."
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
                                        I agree to the <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Privacy Policy</span> and
                                        <span className="text-blue-600 hover:text-blue-800 cursor-pointer"> Terms of Service</span>.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
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
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors">
                                <Calendar className="w-6 h-6 mx-auto mb-2" />
                                <div className="font-semibold">Book Consultation</div>
                                <div className="text-sm text-green-100">Free 30-min call</div>
                            </button>

                            <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center transition-colors">
                                <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                                <div className="font-semibold">Get Quote</div>
                                <div className="text-sm text-orange-100">Project estimate</div>
                            </button>

                            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors">
                                <Building2 className="w-6 h-6 mx-auto mb-2" />
                                <div className="font-semibold">Schedule Demo</div>
                                <div className="text-sm text-purple-100">Live solution walkthrough</div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <section className="mt-16">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Visit Our Office</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="w-full h-80 rounded-lg overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30233.80096103006!2d73.84032425428647!3d18.698736825474352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c8393fe0bf8d%3A0x8cff23ce6f229fa3!2sChimbali%2C%20Maharashtra%20412105!5e0!3m2!1sen!2sin!4v1753683138635!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Smart Tech Solutions Location"
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                                        <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                                        Complete Address
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Smart Tech Solutions<br />
                                        Innovation Tower, Technology Park<br />
                                        Chimbali, Pimpri-Chinchwad<br />
                                        Maharashtra 412105<br />
                                        India
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3">Transportation</h3>
                                    <ul className="text-gray-600 space-y-2">
                                        <li className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                            Pimpri Railway Station - 2.5 km
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                            Chimbali Bus Stop - 500m
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                            Pune Airport - 25 km
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3">Nearby Landmarks</h3>
                                    <ul className="text-gray-600 space-y-2">
                                        <li className="flex items-center">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                            Phoenix MarketCity - 3 km
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                            Rajiv Gandhi Infotech Park - 5 km
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                                            PCMC Building - 4 km
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ContactPage;