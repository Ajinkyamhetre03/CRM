import React from 'react'
import {
    Home,
    Settings,
    Users,
    Globe,
    Target,
    Zap,
    Shield,

} from 'lucide-react';

const AboutPage = () => {

    return (
        <div className="min-h-screen py-20 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Company Story */}
                <section className="mb-20 ">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl font-bold dark:text-gray-200 mb-6">About Smart Tech Solutions</h1>
                            <p className="text-lg dark:text-gray-200 mb-6">
                                Founded with a vision to democratize technology and make smart solutions accessible to businesses
                                of all sizes, Smart Tech Solutions has been at the forefront of IoT and software innovation.
                            </p>
                            <p className="text-lg dark:text-gray-200 mb-6">
                                Our mission is to bridge the gap between cutting-edge technology and practical business applications,
                                delivering solutions that drive real value and measurable results.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Target className="w-6 h-6 text-blue-600 mr-3" />
                                    <span className="dark:text-gray-200">Innovation-driven approach</span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-6 h-6 text-blue-600 mr-3" />
                                    <span className="dark:text-gray-200">Customer-centric solutions</span>
                                </div>
                                <div className="flex items-center">
                                    <Shield className="w-6 h-6 text-blue-600 mr-3" />
                                    <span className="dark:text-gray-200">Quality assurance guarantee</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                            <img src="https://res.cloudinary.com/dpjymq0vc/image/upload/v1750147101/cld-sample-2.jpg" alt="company img" className='w-full h-full rounded-xl' />
                        </div>
                    </div>
                </section>

                {/* Founder Profile */}
                <section className="mb-20 ">
                    <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 dark:bg-gray-700">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                            <div className="lg:col-span-1">
                                <div className="w-64 h-64 mx-auto flex items-center justify-center ">
                                    <img src="https://res.cloudinary.com/dpjymq0vc/image/upload/v1750147101/cld-sample-2.jpg" alt="Ajinkya Photo" className='h-full w-full rounded-xl'/>
                                </div>
                            </div>
                            <div className="lg:col-span-2 ">
                                <h2 className="text-3xl font-bold dark:text-gray-200 mb-4">Meet Our Founder</h2>
                                <h3 className="text-2xl dark:text-gray-200 font-semibold mb-4">Ajinkya Mhetre</h3>
                                <p className="dark:text-gray-200 mb-6">
                                    With over 5 years of experience in IoT and software development, Ajinkya founded Smart Tech Solutions
                                    with a vision to make advanced technology accessible to businesses across India. His expertise spans
                                    from embedded systems to cloud architectures.
                                </p>
                                <p className="dark:text-gray-200 mb-6">
                                    Ajinkya's technical background combined with his business acumen has helped numerous clients
                                    transform their operations through strategic technology implementations.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold dark:text-gray-200 mb-2">Expertise</h4>
                                        <ul className="text-sm dark:text-gray-200 space-y-1">
                                            <li>• IoT Architecture</li>
                                            <li>• Software Development</li>
                                            <li>• System Integration</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold dark:text-gray-200 mb-2">Education</h4>
                                        <ul className="text-sm dark:text-gray-200 space-y-1">
                                            <li>• B.Tech in Electronics</li>
                                            <li>• IoT Certifications</li>
                                            <li>• Cloud Architecture</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Company Values */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold dark:text-gray-200 mb-4">Our Core Values</h2>
                        <p className="text-xl dark:text-gray-200">Principles that guide everything we do</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Zap className="w-8 h-8" />, title: 'Innovation First', description: 'Constantly exploring new technologies and methodologies' },
                            { icon: <Users className="w-8 h-8" />, title: 'Customer-Centric', description: 'Every solution is tailored to client needs and goals' },
                            { icon: <Shield className="w-8 h-8" />, title: 'Quality Assurance', description: 'Rigorous testing and quality control processes' },
                            { icon: <Globe className="w-8 h-8" />, title: 'Transparency', description: 'Open communication and honest project management' }
                        ].map((value, index) => (
                            <div key={index} className="text-center">
                                <div className="text-blue-600 mb-4 flex justify-center">{value.icon}</div>
                                <h3 className="text-xl font-bold dark:text-gray-200 mb-3">{value.title}</h3>
                                <p className="dark:text-gray-200">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Achievements */}
                <section>
                    <div className="bg-blue-600 text-white rounded-2xl p-8 lg:p-12">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
                            <p className="text-xl text-blue-100">Milestones that reflect our commitment to excellence</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">100+</div>
                                <div className="text-blue-100">Projects Delivered</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">50+</div>
                                <div className="text-blue-100">Happy Clients</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">5+</div>
                                <div className="text-blue-100">Years Experience</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">24/7</div>
                                <div className="text-blue-100">Support Available</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AboutPage