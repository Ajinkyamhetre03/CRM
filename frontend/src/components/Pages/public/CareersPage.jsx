
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FourSquare } from "react-loading-indicators";
import { toast } from "react-toastify";
import {
    MapPin,
    Calendar,
    Users,
    Building2,
    ExternalLink,
    Briefcase,
    X,
    Filter,
    Search,
    Eye,
    Plus,
    Trash2, 
    Mail, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    ArrowRight,
    Download,
    Star,
    TrendingUp,
    Target,
    Award,
    Globe,
    User,
    Send
} from "lucide-react";

const base_Url = import.meta.env.VITE_BASE_URL;

// Application Form Modal
const JobApplicationModal = ({ job, onClose, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "India"
        },
        dateOfBirth: "",
        experience: "",
        currentSalary: "",
        expectedSalary: "",
        noticePeriod: "",
        education: [
            {
                degree: "",
                institution: "",
                year: "",
                percentage: ""
            }
        ],
        skills: [""],
        previousExperience: [
            {
                company: "",
                position: "",
                duration: "",
                responsibilities: ""
            }
        ],
        resumeUrl: "",
        coverLetter: "",
        portfolioUrl: "",
        linkedinProfile: "",
        whyInterested: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [addressField]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...formData.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        setFormData(prev => ({ ...prev, education: newEducation }));
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...formData.previousExperience];
        newExperience[index] = { ...newExperience[index], [field]: value };
        setFormData(prev => ({ ...prev, previousExperience: newExperience }));
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...formData.skills];
        newSkills[index] = value;
        setFormData(prev => ({ ...prev, skills: newSkills }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { degree: "", institution: "", year: "", percentage: "" }]
        }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            previousExperience: [...prev.previousExperience, { company: "", position: "", duration: "", responsibilities: "" }]
        }));
    };

    const addSkill = () => {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, ""] }));
    };

    const removeEducation = (index) => {
        if (formData.education.length > 1) {
            const newEducation = formData.education.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, education: newEducation }));
        }
    };

    const removeExperience = (index) => {
        if (formData.previousExperience.length > 1) {
            const newExperience = formData.previousExperience.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, previousExperience: newExperience }));
        }
    };

    const removeSkill = (index) => {
        if (formData.skills.length > 1) {
            const newSkills = formData.skills.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, skills: newSkills }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clean up skills array
        const cleanedData = {
            ...formData,
            skills: formData.skills.filter(skill => skill.trim() !== ""),
            currentSalary: parseInt(formData.currentSalary),
            expectedSalary: parseInt(formData.expectedSalary),
            education: formData.education.map(edu => ({
                ...edu,
                year: parseInt(edu.year),
                percentage: parseFloat(edu.percentage)
            }))
        };

        onSubmit(cleanedData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative bg-white/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl w-full max-w-3xl h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Apply for {job.jobTitle}</h2>
                        <p className="text-sm text-gray-600">{job.department} • {job.jobLocation}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Date of Birth *</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">Address</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Street *</label>
                                    <input
                                        type="text"
                                        name="address.street"
                                        value={formData.address.street}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">City *</label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">State *</label>
                                    <input
                                        type="text"
                                        name="address.state"
                                        value={formData.address.state}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">ZIP Code *</label>
                                    <input
                                        type="text"
                                        name="address.zipCode"
                                        value={formData.address.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Country *</label>
                                    <input
                                        type="text"
                                        name="address.country"
                                        value={formData.address.country}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Experience *</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 3 years"
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Notice Period *</label>
                                <input
                                    type="text"
                                    name="noticePeriod"
                                    value={formData.noticePeriod}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 30 days"
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Current Salary (₹) *</label>
                                <input
                                    type="number"
                                    name="currentSalary"
                                    value={formData.currentSalary}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Expected Salary (₹) *</label>
                                <input
                                    type="number"
                                    name="expectedSalary"
                                    value={formData.expectedSalary}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                            <button
                                type="button"
                                onClick={addEducation}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Add Education
                            </button>
                        </div>
                        {formData.education.map((edu, index) => (
                            <div key={index} className="p-6 border border-gray-200 rounded-xl space-y-3 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                                    {formData.education.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeEducation(index)}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">Degree *</label>
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">Institution *</label>
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">Year *</label>
                                        <input
                                            type="number"
                                            value={edu.year}
                                            onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">Percentage *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={edu.percentage}
                                            onChange={(e) => handleEducationChange(index, 'percentage', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                            <button
                                type="button"
                                onClick={addSkill}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Add Skill
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.skills.map((skill, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={skill}
                                        onChange={(e) => handleSkillChange(index, e.target.value)}
                                        placeholder="Enter skill"
                                        className="flex-1 p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                    {formData.skills.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(index)}
                                            className="p-3 text-red-500 hover:text-red-700 rounded-xl hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Previous Experience */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Previous Experience</h3>
                            <button
                                type="button"
                                onClick={addExperience}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Add Experience
                            </button>
                        </div>
                        {formData.previousExperience.map((exp, index) => (
                            <div key={index} className="p-6 border border-gray-200 rounded-xl space-y-3 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                                    {formData.previousExperience.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeExperience(index)}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">Company *</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">Position *</label>
                                        <input
                                            type="text"
                                            value={exp.position}
                                            onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">Duration *</label>
                                        <input
                                            type="text"
                                            value={exp.duration}
                                            onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                            placeholder="e.g., 2 years"
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1 text-gray-700">Responsibilities *</label>
                                        <textarea
                                            value={exp.responsibilities}
                                            onChange={(e) => handleExperienceChange(index, 'responsibilities', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            rows="3"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Resume URL *</label>
                                <input
                                    type="url"
                                    name="resumeUrl"
                                    value={formData.resumeUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://drive.google.com/file/d/..."
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Portfolio URL</label>
                                <input
                                    type="url"
                                    name="portfolioUrl"
                                    value={formData.portfolioUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://yourportfolio.com"
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">LinkedIn Profile *</label>
                                <input
                                    type="url"
                                    name="linkedinProfile"
                                    value={formData.linkedinProfile}
                                    onChange={handleInputChange}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Cover Letter *</label>
                                <textarea
                                    name="coverLetter"
                                    value={formData.coverLetter}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Why are you interested in this role? *</label>
                                <textarea
                                    name="whyInterested"
                                    value={formData.whyInterested}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    rows="4"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold transition-all hover:scale-105"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Submit Application
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Job Details Modal
const JobDetailsModal = ({ job, onClose, onApply }) => {
    if (!job) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative bg-white/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-gray-900">{job.jobTitle}</h2>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center">
                                <Building2 className="h-4 w-4 mr-1" />
                                Department: {job.department?.toUpperCase()}
                            </span>
                            <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {job.jobLocation}
                            </span>
                            <span>Experience: <span className="font-medium">{job.experience}</span></span>
                            <span>Shift: {job.shift}</span>
                        </div>
                    </div>
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={onClose}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-xl">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700">Apply by {new Date(job.applicationDeadline).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            })}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 p-3 rounded-xl">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="text-gray-700">{job.currentApplications}/{job.maxApplications} Applied</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">Job Description</h3>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{job.jobDescription}</p>
                    </div>

                    {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Key Responsibilities</h3>
                            <ul className="list-disc ml-5 text-gray-700 space-y-2 bg-gray-50 p-4 rounded-xl">
                                {job.keyResponsibilities.map((kr, idx) => (
                                    <li key={idx}>{kr}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.requiredSkills.map((skill, idx) => (
                                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={onApply}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2"
                    >
                        <Send className="h-4 w-4" />
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

const CareersPage = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackEmail, setTrackEmail] = useState("");
    const [applications, setApplications] = useState([]);
    const [isTrackingLoading, setIsTrackingLoading] = useState(false);
    const [showApplicationsModal, setShowApplicationsModal] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [experienceFilter, setExperienceFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const token = localStorage.getItem("token"); // Get token from localStorage

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${base_Url}/api/candidate/jobs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(res.data.data || []);
            setFilteredJobs(res.data.data || []);
        } catch (err) {
            setJobs([]);
            setFilteredJobs([]);
            toast.error("Failed to fetch jobs");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchJobDetails = async (id) => {
        setDetailsLoading(true);
        try {
            const res = await axios.get(`${base_Url}/api/candidate/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobDetails(res.data.data);
        } catch (err) {
            setJobDetails(null);
            toast.error("Failed to load job details");
        } finally {
            setDetailsLoading(false);
        }
    };

    const submitApplication = async (applicationData) => {
        setIsSubmittingApplication(true);
        try {
            const res = await axios.post(
                `${base_Url}/api/candidate/jobs/${selectedJobId}/apply`,
                applicationData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            toast.success("Application submitted successfully!");
            setShowApplicationForm(false);
            setSelectedJobId(null);
            setJobDetails(null);

            // Refresh jobs to update application count
            fetchJobs();
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to submit application";
            toast.error(errorMessage);
        } finally {
            setIsSubmittingApplication(false);
        }
    };

    // Filter logic
    const applyFilters = () => {
        let filtered = jobs;

        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.jobDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.department?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (departmentFilter) {
            filtered = filtered.filter(job => job.department === departmentFilter);
        }

        if (locationFilter) {
            filtered = filtered.filter(job => job.jobLocation === locationFilter);
        }

        if (experienceFilter) {
            filtered = filtered.filter(job => job.experience === experienceFilter);
        }

        setFilteredJobs(filtered);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setDepartmentFilter("");
        setLocationFilter("");
        setExperienceFilter("");
        setFilteredJobs(jobs);
    };

    // Get unique values for filter dropdowns
    const uniqueDepartments = [...new Set(jobs.map(job => job.department))].filter(Boolean);
    const uniqueLocations = [...new Set(jobs.map(job => job.jobLocation))].filter(Boolean);
    const uniqueExperiences = [...new Set(jobs.map(job => job.experience))].filter(Boolean);

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (selectedJobId) {
            fetchJobDetails(selectedJobId);
        }
    }, [selectedJobId]);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, departmentFilter, locationFilter, experienceFilter, jobs]);

    const handleJobClick = (jobId) => {
        setSelectedJobId(jobId);
    };

    const handleApplyClick = () => {
        setShowApplicationForm(true);
    };

    const closeModals = () => {
        setSelectedJobId(null);
        setJobDetails(null);
        setShowApplicationForm(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const calculateDaysLeft = (deadline) => {
        return Math.max(
            Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)),
            0
        );
    };

    const trackApplications = async (email) => {
        setIsTrackingLoading(true);
        try {
            const res = await axios.post(
                `${base_Url}/api/candidate/applications/myapplication`,
                { email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            setApplications(res.data.applications || []);
            setShowTrackModal(false);
            setShowApplicationsModal(true);
            setTrackEmail("");

            if (res.data.applications.length === 0) {
                toast.info("No applications found for this email address");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to fetch applications";
            toast.error(errorMessage);
            setApplications([]);
        } finally {
            setIsTrackingLoading(false);
        }
    };

    const handleTrackSubmit = (e) => {
        e.preventDefault();
        if (trackEmail.trim()) {
            trackApplications(trackEmail.trim());
        }
    };

    const closeTrackingModals = () => {
        setShowTrackModal(false);
        setShowApplicationsModal(false);
        setTrackEmail("");
        setApplications([]);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'hired':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'interview':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'hired':
                return <CheckCircle className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            case 'interview':
                return <AlertCircle className="h-4 w-4" />;
            case 'pending':
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const stats = [
        { number: '50+', label: 'Open Positions', icon: <Briefcase className="w-8 h-8" /> },
        { number: '200+', label: 'Team Members', icon: <Users className="w-8 h-8" /> },
        { number: '15+', label: 'Departments', icon: <Building2 className="w-8 h-8" /> },
        { number: '5+', label: 'Office Locations', icon: <MapPin className="w-8 h-8" /> }
    ];

    const benefits = [
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Growth Opportunities",
            description: "Clear career progression paths and professional development programs"
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Recognition & Rewards",
            description: "Performance-based incentives and achievement recognition programs"
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Work-Life Balance",
            description: "Flexible working hours, remote work options, and wellness programs"
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Learning & Development",
            description: "Continuous learning opportunities, certifications, and skill development"
        }
    ];

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80"
                    alt="Careers Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                        Join Our <span className="bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">Team</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                        Be part of an innovative team that's shaping the future of technology and making a real impact
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => document.getElementById('jobs-section').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
                        >
                            Explore Jobs
                            <ArrowRight className="ml-2 w-6 h-6" />
                        </button>
                        <button
                            onClick={() => setShowTrackModal(true)}
                            className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center"
                        >
                            <Mail className="mr-2 w-6 h-6" />
                            Track Application
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

            {/* Benefits Section */}
            <section className="py-20 bg-gradient-to-tr from-slate-50 via-blue-100 to-indigo-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Why Work With <span className="text-blue-600">Us?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We believe in creating an environment where talent thrives and innovation flourishes
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 hover:-translate-y-2 p-8 text-center">
                                <div className="text-blue-600 mb-6 flex justify-center">{benefit.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Jobs Section */}
            <section id="jobs-section" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Open Positions
                        </h2>
                        <p className="text-xl text-gray-600">
                            Find your perfect role and start your journey with us
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-8 space-y-4">
                        {/* Search Bar */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search jobs, departments, or keywords..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                                >
                                    <Filter className="h-5 w-5" />
                                    Filters
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-md space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">Department</label>
                                        <select
                                            value={departmentFilter}
                                            onChange={(e) => setDepartmentFilter(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">All Departments</option>
                                            {uniqueDepartments.map(dept => (
                                                <option key={dept} value={dept}>{dept.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">Location</label>
                                        <select
                                            value={locationFilter}
                                            onChange={(e) => setLocationFilter(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">All Locations</option>
                                            {uniqueLocations.map(location => (
                                                <option key={location} value={location}>{location}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">Experience</label>
                                        <select
                                            value={experienceFilter}
                                            onChange={(e) => setExperienceFilter(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">All Experience Levels</option>
                                            {uniqueExperiences.map(exp => (
                                                <option key={exp} value={exp}>{exp}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={clearFilters}
                                            className="w-full px-4 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Jobs Count */}
                    <div className="mb-8 text-lg font-semibold text-gray-900">
                        {filteredJobs.length} of {jobs.length} jobs
                        {(searchTerm || departmentFilter || locationFilter || experienceFilter) && (
                            <span className="text-sm font-normal text-gray-600 ml-2">
                                (filtered)
                            </span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-24">
                            <FourSquare
                                color="#3b82f6"
                                size="large"
                                text="Loading jobs..."
                                textColor="#6b7280"
                            />
                        </div>
                    ) : (
                        <>
                            {/* Jobs Table */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left p-6 font-semibold text-gray-900">Job Title</th>
                                                <th className="text-left p-6 font-semibold text-gray-900 hidden md:table-cell">Department</th>
                                                <th className="text-left p-6 font-semibold text-gray-900 hidden lg:table-cell">Location</th>
                                                <th className="text-left p-6 font-semibold text-gray-900 hidden xl:table-cell">Experience</th>
                                                <th className="text-left p-6 font-semibold text-gray-900 hidden sm:table-cell">Applications</th>
                                                <th className="text-left p-6 font-semibold text-gray-900 hidden lg:table-cell">Deadline</th>
                                                <th className="text-left p-6 font-semibold text-gray-900 w-32">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredJobs.map((job) => {
                                                const spotsLeft = job.maxApplications - job.currentApplications;
                                                const daysLeft = calculateDaysLeft(job.applicationDeadline);

                                                return (
                                                    <tr
                                                        key={job._id}
                                                        className="hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <td className="p-6">
                                                            <div>
                                                                <div className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                                    {job.jobTitle}
                                                                </div>
                                                                <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                                                                    {job.jobDescription}
                                                                </div>
                                                                {/* Mobile-only info */}
                                                                <div className="md:hidden mt-2 space-y-1">
                                                                    <div className="text-xs text-gray-500">
                                                                        <Building2 className="h-3 w-3 inline mr-1" />
                                                                        {job.department?.toUpperCase()}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        <MapPin className="h-3 w-3 inline mr-1" />
                                                                        {job.jobLocation}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-6 text-sm hidden md:table-cell">
                                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                                {job.department?.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="p-6 text-sm hidden lg:table-cell">
                                                            <div className="flex items-center">
                                                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                                                {job.jobLocation}
                                                            </div>
                                                        </td>
                                                        <td className="p-6 text-sm hidden xl:table-cell">
                                                            <span className="font-medium text-gray-900">{job.experience}</span>
                                                        </td>
                                                        <td className="p-6 text-sm hidden sm:table-cell">
                                                            <div>
                                                                <div className="flex items-center gap-1 mb-1">
                                                                    <Users className="h-4 w-4 text-gray-400" />
                                                                    <span className="font-medium">{job.currentApplications}/{job.maxApplications}</span>
                                                                </div>
                                                                {spotsLeft <= 5 && spotsLeft > 0 && (
                                                                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                                                        {spotsLeft} spots left
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-6 text-sm hidden lg:table-cell">
                                                            <div>
                                                                <div className="font-medium mb-1">{formatDate(job.applicationDeadline)}</div>
                                                                {daysLeft > 0 ? (
                                                                    <span className="text-xs bg-green-100 text-green-800 py-1 rounded-full px-3">
                                                                        {daysLeft} days left
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs bg-red-100 text-red-800 py-1 rounded-full px-3">
                                                                        Closed
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-6">
                                                            <button
                                                                onClick={() => handleJobClick(job._id)}
                                                                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                <span className="hidden sm:inline">View Details</span>
                                                                <span className="sm:hidden">View</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {filteredJobs.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg mb-2">No jobs found matching your criteria</p>
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 text-blue-600 hover:text-blue-700 underline"
                                        >
                                            Clear filters to see all jobs
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Job Details Modal */}
                    {selectedJobId && jobDetails && !showApplicationForm && (
                        <JobDetailsModal
                            job={jobDetails}
                            onClose={closeModals}
                            onApply={handleApplyClick}
                        />
                    )}

                    {/* Application Form Modal */}
                    {showApplicationForm && jobDetails && (
                        <JobApplicationModal
                            job={jobDetails}
                            onClose={closeModals}
                            onSubmit={submitApplication}
                            isSubmitting={isSubmittingApplication}
                        />
                    )}

                    {/* Loading Modal */}
                    {selectedJobId && detailsLoading && (
                        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <FourSquare
                                color="#3b82f6"
                                size="medium"
                                text="Loading job details..."
                                textColor="#6b7280"
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Track Applications Modal */}
            {showTrackModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="relative bg-white/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Track Your Applications</h2>
                            <button
                                onClick={closeTrackingModals}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleTrackSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Enter your email address to track applications
                                </label>
                                <input
                                    type="email"
                                    value={trackEmail}
                                    onChange={(e) => setTrackEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeTrackingModals}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                    disabled={isTrackingLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isTrackingLoading}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold transition-all hover:scale-105"
                                >
                                    {isTrackingLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Tracking...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="h-4 w-4" />
                                            Track Applications
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Applications Modal */}
            {showApplicationsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="relative bg-white/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                                <p className="text-sm text-gray-600">
                                    Found {applications.length} application{applications.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <button
                                onClick={closeTrackingModals}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {applications.length === 0 ? (
                                <div className="text-center py-12">
                                    <Mail className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium mb-2">No Applications Found</h3>
                                    <p className="text-gray-600">
                                        No applications were found for the provided email address.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {applications.map((app, index) => (
                                        <div
                                            key={app.id || index}
                                            className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{app.fullName}</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-600">Department:</span>
                                                            <span className="ml-2 font-medium">{app.department?.toUpperCase()}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Email:</span>
                                                            <span className="ml-2">{app.email}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Applied Date:</span>
                                                            <span className="ml-2">
                                                                {new Date(app.appliedDate).toLocaleDateString("en-IN", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Last Updated:</span>
                                                            <span className="ml-2">
                                                                {new Date(app.lastUpdated).toLocaleDateString("en-IN", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                                                        {getStatusIcon(app.status)}
                                                        {app.statusInfo?.stage || app.status}
                                                    </div>
                                                </div>
                                            </div>

                                            {app.statusInfo?.description && (
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-sm text-gray-700">
                                                        <strong>Status Update:</strong> {app.statusInfo.description}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Additional status indicators */}
                                            {app.status === 'hired' && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                                    <div className={`flex items-center gap-1 ${app.candidateConfirmed ? 'text-green-600' : 'text-gray-400'}`}>
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span>Confirmed</span>
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${app.paymentRequired ? 'text-blue-600' : 'text-gray-400'}`}>
                                                        <AlertCircle className="h-3 w-3" />
                                                        <span>Payment Req.</span>
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${app.paymentCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span>Payment Done</span>
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${app.employeeCreated ? 'text-green-600' : 'text-gray-400'}`}>
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span>Employee Created</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
                            <button
                                onClick={closeTrackingModals}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all hover:scale-105"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Ready to Make an Impact?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                        Join our team of innovators and help us build the future of technology
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => document.getElementById('jobs-section').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center"
                        >
                            <Send className="mr-2 w-6 h-6" />
                            Apply Now
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center">
                            <Download className="mr-2 w-6 h-6" />
                            Company Brochure
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;
