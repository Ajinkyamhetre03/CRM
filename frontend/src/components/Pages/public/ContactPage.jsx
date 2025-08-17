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
        setStatusMessage("Thanks! Your message has been recorded locally.");
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

    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
          {/* Hero Section */}
          <div className="bg-gray-800 border-b border-gray-700">
              <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                  <div className="text-center">
                      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                          Get In Touch
                      </h1>
                      <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                          Ready to transform your business with smart technology solutions? Let's discuss your project requirements.
                      </p>
                      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                          <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2 text-blue-400" />
                              <span>500+ Projects Delivered</span>
                          </div>
                          <div className="flex items-center">
                              <Globe className="w-4 h-4 mr-2 text-green-400" />
                              <span>Global Presence</span>
                          </div>
                          <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-2 text-purple-400" />
                              <span>Fortune 500 Clients</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Main Section */}
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Contact Information */}
                  <div className="lg:col-span-1">
                      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
                          <h2 className="text-2xl font-bold mb-6 text-white">Contact Information</h2>

                          <div className="space-y-6">
                              <div className="flex items-start">
                                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Phone className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="ml-4">
                                      <p className="font-semibold text-white">Phone</p>
                                      <p className="text-blue-400 font-medium">+91 98765 43210</p>
                                      <p className="text-sm text-gray-400">Mon-Sat, 9AM-7PM IST</p>
                                  </div>
                              </div>

                              <div className="flex items-start">
                                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Mail className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="ml-4">
                                      <p className="font-semibold text-white">Email</p>
                                      <p className="text-green-400 font-medium">info@smarttechsolutions.com</p>
                                      <p className="text-sm text-gray-400">24/7 Email Support</p>
                                  </div>
                              </div>

                              <div className="flex items-start">
                                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <MapPin className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="ml-4">
                                      <p className="font-semibold text-white">Office Address</p>
                                      <p className="text-gray-300">Smart Tech Solutions</p>
                                      <p className="text-sm text-gray-400">Technology Park, Pimpri</p>
                                      <p className="text-sm text-gray-400">Maharashtra, India</p>
                                  </div>
                              </div>

                              <div className="flex items-start">
                                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <MessageCircle className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="ml-4">
                                      <p className="font-semibold text-white">WhatsApp</p>
                                      <p className="text-green-400 font-medium">+91 98765 43210</p>
                                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm mt-2 flex items-center transition-colors">
                                          <MessageCircle className="w-4 h-4 mr-2" />
                                          Chat on WhatsApp
                                      </button>
                                  </div>
                              </div>
                          </div>

                          <div className="mt-8 pt-6 border-t border-gray-700">
                              <div className="flex items-center mb-4">
                                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                                  <h3 className="font-bold text-white">Business Hours</h3>
                              </div>
                              <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                      <span className="text-gray-400">Monday - Friday</span>
                                      <span className="font-medium text-white">9:00 AM - 7:00 PM</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-gray-400">Saturday</span>
                                      <span className="font-medium text-white">10:00 AM - 4:00 PM</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-gray-400">Sunday</span>
                                      <span className="font-medium text-white">Closed</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Contact Form */}
                  <div className="lg:col-span-2">
                      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
                          <h2 className="text-2xl font-bold mb-6 text-white">Send us a Message</h2>

                          {/* Status */}
                          {submitStatus === 'success' && (
                              <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg flex items-center">
                                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                  <span className="text-green-200">{statusMessage}</span>
                              </div>
                          )}

                          {submitStatus === 'error' && (
                              <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center">
                                  <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                                  <span className="text-red-200">{statusMessage}</span>
                              </div>
                          )}

                          <form onSubmit={handleSubmit} className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                          Full Name *
                                      </label>
                                      <input
                                          type="text"
                                          id="name"
                                          name="name"
                                          required
                                          value={contactForm.name}
                                          onChange={handleInputChange}
                                          className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Enter your full name"
                                      />
                                  </div>

                                  <div>
                                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                          Email Address *
                                      </label>
                                      <input
                                          type="email"
                                          id="email"
                                          name="email"
                                          required
                                          value={contactForm.email}
                                          onChange={handleInputChange}
                                          className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="you@example.com"
                                      />
                                  </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                          Phone Number
                                      </label>
                                      <input
                                          type="tel"
                                          id="phone"
                                          name="phone"
                                          value={contactForm.phone}
                                          onChange={handleInputChange}
                                          className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="+91-9876543210"
                                      />
                                  </div>

                                  <div>
                                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                          Subject *
                                      </label>
                                      <select
                                          id="subject"
                                          name="subject"
                                          required
                                          value={contactForm.subject}
                                          onChange={handleInputChange}
                                          className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                      Project Description *
                                  </label>
                                  <textarea
                                      id="message"
                                      name="message"
                                      required
                                      rows={6}
                                      value={contactForm.message}
                                      onChange={handleInputChange}
                                      className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                      placeholder="Tell us about your project..."
                                  />
                              </div>

                              <div className="flex items-start">
                                  <input
                                      type="checkbox"
                                      id="agree"
                                      required
                                      className="w-4 h-4 text-blue-500 border-gray-600 rounded bg-gray-900"
                                  />
                                  <label htmlFor="agree" className="ml-3 text-sm text-gray-400">
                                      I agree to the <span className="text-blue-400 cursor-pointer">Privacy Policy</span> and
                                      <span className="text-blue-400 cursor-pointer"> Terms of Service</span>.
                                  </label>
                              </div>

                              <button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
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
                          </form>
                      </div>
                  </div>
              </div>

              {/* Map Section */}
              <section className="mt-16">
                  <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
                      <h2 className="text-2xl font-bold mb-6 text-center text-white">Visit Our Office</h2>
                      <div className="w-full h-80 rounded-lg overflow-hidden">
                          <iframe
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30233.80096103006!2d73.84032425428647!3d18.698736825474352"
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
              </section>
          </div>
      </div>
  );
};

export default ContactPage;
