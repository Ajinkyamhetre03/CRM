import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Calendar, Users, Filter, ExternalLink, Star, Building2, Briefcase, GraduationCap, TrendingUp, ChevronDown, X } from 'lucide-react';

const CareersPage = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // State management
    const [jobs, setJobs] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedWorkMode, setSelectedWorkMode] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch jobs, departments, and stats in parallel
                const [jobsResponse, departmentsResponse, statsResponse] = await Promise.all([
                    fetch(`${BASE_URL}/api/public/jobs`),
                    fetch(`${BASE_URL}/api/public/departments`),
                    fetch(`${BASE_URL}/api/public/stats`)
                ]);

                if (!jobsResponse.ok || !departmentsResponse.ok || !statsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [jobsData, departmentsData, statsData] = await Promise.all([
                    jobsResponse.json(),
                    departmentsResponse.json(),
                    statsResponse.json()
                ]);

                setJobs(jobsData.jobs || []);
                setDepartments(departmentsData.departments || []);
                setStats(statsData);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [BASE_URL]);

    // Filter jobs based on search and filters
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = !selectedDepartment || job.department.name === selectedDepartment;
        const matchesWorkMode = !selectedWorkMode || job.workMode === selectedWorkMode;
        const matchesLocation = !selectedLocation || job.location.includes(selectedLocation);

        return matchesSearch && matchesDepartment && matchesWorkMode && matchesLocation;
    });

    // Get unique locations and work modes for filters
    const uniqueLocations = [...new Set(jobs.map(job => job.location.split(', ')[1] || job.location))];
    const uniqueWorkModes = [...new Set(jobs.map(job => job.workMode))];

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Calculate days remaining
    const getDaysRemaining = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedDepartment('');
        setSelectedWorkMode('');
        setSelectedLocation('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading career opportunities...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Launch Your Career with Us
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            {stats?.companyInfo?.description || "Join our internship programs and gain hands-on experience with industry leaders"}
                        </p>
                        <button
                            onClick={() => window.location.href = '/track-application'}
                            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white mb-6"
                        >
                            Track Our Application
                        </button>

                        {/* Stats */}
                        {stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                                <div className="bg-white/10 rounded-lg p-4">
                                    <div className="flex items-center justify-center mb-2">
                                        <Briefcase className="h-6 w-6 text-blue-200" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.totalJobs}</div>
                                    <div className="text-blue-200 text-sm">Open Positions</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-4">
                                    <div className="flex items-center justify-center mb-2">
                                        <Users className="h-6 w-6 text-green-300" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.totalApplications}</div>
                                    <div className="text-blue-200 text-sm">Applications</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-4">
                                    <div className="flex items-center justify-center mb-2">
                                        <GraduationCap className="h-6 w-6 text-orange-300" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.totalCompletedInternships}</div>
                                    <div className="text-blue-200 text-sm">Completed</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-4">
                                    <div className="flex items-center justify-center mb-2">
                                        <Star className="h-6 w-6 text-yellow-400" />
                                    </div>
                                    <div className="text-2xl font-bold">{stats.totalCertificates}</div>
                                    <div className="text-blue-200 text-sm">Certificates</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search for internships..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Filter className="h-5 w-5 mr-2" />
                            Filters
                        </button>

                        {/* Desktop Filters */}
                        <div className="hidden lg:flex gap-3">
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept.name}>{dept.name}</option>
                                ))}
                            </select>

                            <select
                                value={selectedWorkMode}
                                onChange={(e) => setSelectedWorkMode(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Work Mode</option>
                                {uniqueWorkModes.map(mode => (
                                    <option key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</option>
                                ))}
                            </select>

                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Location</option>
                                {uniqueLocations.map(location => (
                                    <option key={location} value={location}>{location}</option>
                                ))}
                            </select>

                            {(selectedDepartment || selectedWorkMode || selectedLocation || searchTerm) && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-3 text-gray-600 hover:text-gray-800 flex items-center"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    {showFilters && (
                        <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept.name}>{dept.name}</option>
                                ))}
                            </select>

                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={selectedWorkMode}
                                    onChange={(e) => setSelectedWorkMode(e.target.value)}
                                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Work Mode</option>
                                    {uniqueWorkModes.map(mode => (
                                        <option key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Location</option>
                                    {uniqueLocations.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>

                            {(selectedDepartment || selectedWorkMode || selectedLocation || searchTerm) && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-4 py-3 text-gray-600 hover:text-gray-800 flex items-center justify-center border border-gray-200 rounded-lg"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Available Positions ({filteredJobs.length})
                    </h2>
                </div>

                {filteredJobs.length === 0 ? (
                    <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredJobs.map((job) => {
                            const daysRemaining = getDaysRemaining(job.applicationDeadline);
                            const spotsRemaining = job.maxApplications - job.currentApplications;

                            return (
                                <div
                                    key={job._id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                        {job.title}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                                        <Building2 className="h-4 w-4 mr-1" />
                                                        {job.department.name}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {daysRemaining <= 7 && (
                                                        <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                                                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                                                        </span>
                                                    )}
                                                    {spotsRemaining <= 5 && spotsRemaining > 0 && (
                                                        <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                                                            {spotsRemaining} spots left
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-4 line-clamp-2">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {job.duration}
                                                </div>
                                                <div className="flex items-center">
                                                    <TrendingUp className="h-4 w-4 mr-1" />
                                                    ₹{job.stipend.toLocaleString()}/month
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    {job.currentApplications}/{job.maxApplications} applied
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    Apply by {formatDate(job.applicationDeadline)}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.workMode === 'remote'
                                                        ? 'bg-green-50 text-green-600'
                                                        : job.workMode === 'hybrid'
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'bg-gray-50 text-gray-600'
                                                        }`}>
                                                        {job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)}
                                                    </span>
                                                    <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                                        {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => window.location.href = `/jobs/${job._id}`}
                                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                                >
                                                    View Details
                                                    <ExternalLink className="h-4 w-4 ml-2" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareersPage; 