


import React, { useState } from 'react';
import {
    Home,
    Settings,
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
    MessageCircle,
    BookOpen,
    FileText,
    Video,
    Headphones,
    Eye,
    User,
    ThumbsUp,
    Share2
} from 'lucide-react';

const ResourcesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const resourceCategories = [
        {
            id: 'tutorials',
            title: 'Technical Tutorials',
            description: 'Step-by-step guides and implementation tutorials',
            icon: <Settings className="w-8 h-8" />,
            count: 12,
            color: 'green',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            id: 'insights',
            title: 'Industry Insights',
            description: 'Latest trends and market analysis',
            icon: <TrendingUp className="w-8 h-8" />,
            count: 8,
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            textColor: 'text-blue-600'
        },
        {
            id: 'case-studies',
            title: 'Case Studies',
            description: 'Detailed project breakdowns and success stories',
            icon: <Award className="w-8 h-8" />,
            count: 15,
            color: 'purple',
            bgColor: 'bg-purple-50',
            iconBg: 'bg-purple-100',
            textColor: 'text-purple-600'
        },
        {
            id: 'whitepapers',
            title: 'Whitepapers',
            description: 'In-depth research and technical documentation',
            icon: <FileText className="w-8 h-8" />,
            count: 6,
            color: 'orange',
            bgColor: 'bg-orange-50',
            iconBg: 'bg-orange-100',
            textColor: 'text-orange-600'
        }
    ];

    const featuredResources = [
        {
            id: 1,
            type: 'article',
            title: 'Complete Guide to IoT Implementation',
            excerpt: 'Everything you need to know about implementing IoT solutions in your business.',
            category: 'Technical Guide',
            readTime: '12 min read',
            date: '2025-01-15',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
            featured: true,
            views: 2540,
            likes: 89
        },
        {
            id: 2,
            type: 'video',
            title: 'Industry 4.0 Transformation Webinar',
            excerpt: 'Watch our expert panel discuss the future of manufacturing.',
            category: 'Webinar',
            readTime: '45 min watch',
            date: '2025-01-10',
            image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80',
            featured: false,
            views: 1890,
            likes: 156
        },
        {
            id: 3,
            type: 'whitepaper',
            title: 'Smart Manufacturing ROI Analysis',
            excerpt: 'Comprehensive analysis of ROI in smart manufacturing implementations.',
            category: 'Research',
            readTime: '20 min read',
            date: '2025-01-05',
            image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
            featured: false,
            views: 3201,
            likes: 234
        }
    ];

    const blogPosts = [
        {
            id: 1,
            title: 'Getting Started with Smart Home Automation',
            excerpt: 'A comprehensive guide to implementing smart home solutions for modern living.',
            date: '2025-01-15',
            category: 'Smart Home',
            readTime: '5 min read',
            image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
            author: 'Rajesh Kumar',
            views: 1245,
            type: 'article'
        },
        {
            id: 2,
            title: 'Industry 4.0: The Future of Manufacturing',
            excerpt: 'How IoT and automation are revolutionizing the manufacturing industry.',
            date: '2025-01-10',
            category: 'Industry 4.0',
            readTime: '8 min read',
            image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80',
            author: 'Priya Sharma',
            views: 2156,
            type: 'article'
        },
        {
            id: 3,
            title: 'IoT Security Best Practices',
            excerpt: 'Essential security measures for IoT implementations in business environments.',
            date: '2025-01-05',
            category: 'Security',
            readTime: '6 min read',
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80',
            author: 'Amit Patel',
            views: 1789,
            type: 'article'
        },
        {
            id: 4,
            title: 'Smart Manufacturing Success Stories',
            excerpt: 'Real-world case studies of successful smart manufacturing implementations.',
            date: '2024-12-28',
            category: 'Case Study',
            readTime: '10 min read',
            image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
            author: 'Sunil Reddy',
            views: 987,
            type: 'case-study'
        },
        {
            id: 5,
            title: 'Building Scalable IoT Architectures',
            excerpt: 'Technical deep-dive into designing scalable IoT systems.',
            date: '2024-12-22',
            category: 'Technical',
            readTime: '15 min read',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
            author: 'Kavya Singh',
            views: 1543,
            type: 'tutorial'
        },
        {
            id: 6,
            title: 'AI in Manufacturing: Current Trends',
            excerpt: 'Exploring how AI is transforming modern manufacturing processes.',
            date: '2024-12-18',
            category: 'AI & ML',
            readTime: '12 min read',
            image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
            author: 'Arjun Mehta',
            views: 2087,
            type: 'insight'
        }
    ];

    const getResourceIcon = (type) => {
        switch (type) {
            case 'video': return <Video className="w-5 h-5" />;
            case 'whitepaper': return <FileText className="w-5 h-5" />;
            case 'podcast': return <Headphones className="w-5 h-5" />;
            default: return <BookOpen className="w-5 h-5" />;
        }
    };

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || post.type === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1800&q=80"
                    alt="Resources Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                        Resources & <span className="bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">Insights</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                        Stay updated with the latest trends, tutorials, and insights in IoT, AI, and digital transformation
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center">
                            Explore Resources
                            <ArrowRight className="ml-2 w-6 h-6" />
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center">
                            <Download className="mr-2 w-6 h-6" />
                            Download Guides
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12 border border-blue-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                    Featured Article
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                    The Future of Smart Manufacturing in India
                                </h2>
                                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                                    Exploring how Industry 4.0 technologies are revolutionizing manufacturing
                                    processes and creating new opportunities for businesses across India.
                                </p>
                                <div className="flex items-center text-gray-500 text-sm mb-6 space-x-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>January 20, 2025</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>10 min read</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Eye className="w-4 h-4 mr-2" />
                                        <span>2.5k views</span>
                                    </div>
                                </div>
                                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center">
                                    Read Full Article
                                    <ArrowRight className="ml-2 w-6 h-6" />
                                </button>
                            </div>
                            <div className="relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" 
                                    alt="Smart Manufacturing"
                                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                                    <Play className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resource Categories */}
            <section className="py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Explore by <span className="text-blue-600">Category</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Find exactly what you're looking for with our organized resource categories
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {resourceCategories.map((category) => (
                            <div key={category.id} className={`${category.bgColor} rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer group`}>
                                <div className={`w-16 h-16 ${category.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                                    <div className={category.textColor}>{category.icon}</div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                                <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                                <div className={`${category.textColor} font-bold text-lg`}>
                                    {category.count} Resources
                                </div>
                                <button className="mt-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center mx-auto group-hover:translate-x-1 transition-transform">
                                    Explore <ChevronRight className="ml-1 w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Search and Filter */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Latest Resources</h2>
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                                />
                            </div>
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="border border-gray-300 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                                <option value="all">All Categories</option>
                                <option value="article">Articles</option>
                                <option value="tutorial">Tutorials</option>
                                <option value="case-study">Case Studies</option>
                                <option value="insight">Insights</option>
                            </select>
                        </div>
                    </div>

                    {/* Resources Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article key={post.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                                        {getResourceIcon(post.type)}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {post.readTime}
                                            </div>
                                            <div className="flex items-center">
                                                <Eye className="w-4 h-4 mr-1" />
                                                {post.views}
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{post.author}</div>
                                                <div className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                                <ThumbsUp className="w-4 h-4" />
                                            </button>
                                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center">
                                                Read <ChevronRight className="ml-1 w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-12">
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105">
                            Load More Resources
                        </button>
                    </div>
                </div>
            </section>

            {/* Newsletter Signup */}
            <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay Updated</h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Subscribe to our newsletter and get the latest insights on IoT, Industry 4.0,
                            and software development delivered to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            <button className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-semibold whitespace-nowrap transition-all hover:scale-105 flex items-center justify-center">
                                <Send className="mr-2 w-5 h-5" />
                                Subscribe
                            </button>
                        </div>
                        <p className="text-blue-200 text-sm mt-6">
                            🔒 No spam, unsubscribe at any time. We respect your privacy.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ResourcesPage;
