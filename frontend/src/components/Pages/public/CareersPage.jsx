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
    Trash2
} from "lucide-react";

const base_Url = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

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
            <div className="relative bg-white dark:bg-gray-900 backdrop-blur-lg border text-gray-800 dark:text-gray-300 border-white/20 rounded-2xl shadow-xl w-full max-w-3xl h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold">Apply for {job.jobTitle}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.department} • {job.jobLocation}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-4">
                            <h4 className="font-medium">Address</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Street *</label>
                                    <input
                                        type="text"
                                        name="address.street"
                                        value={formData.address.street}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">City *</label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">State *</label>
                                    <input
                                        type="text"
                                        name="address.state"
                                        value={formData.address.state}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                                    <input
                                        type="text"
                                        name="address.zipCode"
                                        value={formData.address.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Country *</label>
                                    <input
                                        type="text"
                                        name="address.country"
                                        value={formData.address.country}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Professional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Experience *</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 3 years"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Notice Period *</label>
                                <input
                                    type="text"
                                    name="noticePeriod"
                                    value={formData.noticePeriod}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 30 days"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Current Salary (₹) *</label>
                                <input
                                    type="number"
                                    name="currentSalary"
                                    value={formData.currentSalary}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Expected Salary (₹) *</label>
                                <input
                                    type="number"
                                    name="expectedSalary"
                                    value={formData.expectedSalary}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Education</h3>
                            <button
                                type="button"
                                onClick={addEducation}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add Education
                            </button>
                        </div>
                        {formData.education.map((edu, index) => (
                            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">Education {index + 1}</h4>
                                    {formData.education.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeEducation(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Degree *</label>
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Institution *</label>
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Year *</label>
                                        <input
                                            type="number"
                                            value={edu.year}
                                            onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Percentage *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={edu.percentage}
                                            onChange={(e) => handleEducationChange(index, 'percentage', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            <h3 className="text-lg font-semibold">Skills</h3>
                            <button
                                type="button"
                                onClick={addSkill}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {formData.skills.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(index)}
                                            className="p-3 text-red-500 hover:text-red-700"
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
                            <h3 className="text-lg font-semibold">Previous Experience</h3>
                            <button
                                type="button"
                                onClick={addExperience}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add Experience
                            </button>
                        </div>
                        {formData.previousExperience.map((exp, index) => (
                            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">Experience {index + 1}</h4>
                                    {formData.previousExperience.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeExperience(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Company *</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Position *</label>
                                        <input
                                            type="text"
                                            value={exp.position}
                                            onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Duration *</label>
                                        <input
                                            type="text"
                                            value={exp.duration}
                                            onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                            placeholder="e.g., 2 years"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1">Responsibilities *</label>
                                        <textarea
                                            value={exp.responsibilities}
                                            onChange={(e) => handleExperienceChange(index, 'responsibilities', e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <h3 className="text-lg font-semibold">Additional Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Resume URL *</label>
                                <input
                                    type="url"
                                    name="resumeUrl"
                                    value={formData.resumeUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://drive.google.com/file/d/..."
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Portfolio URL</label>
                                <input
                                    type="url"
                                    name="portfolioUrl"
                                    value={formData.portfolioUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://yourportfolio.com"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">LinkedIn Profile *</label>
                                <input
                                    type="url"
                                    name="linkedinProfile"
                                    value={formData.linkedinProfile}
                                    onChange={handleInputChange}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Cover Letter *</label>
                                <textarea
                                    name="coverLetter"
                                    value={formData.coverLetter}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Why are you interested in this role? *</label>
                                <textarea
                                    name="whyInterested"
                                    value={formData.whyInterested}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="4"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                            </>
                        ) : (
                            "Submit Application"
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
            <div className="relative bg-white dark:bg-gray-900 backdrop-blur-lg border text-gray-800 dark:text-gray-300 border-white/20 rounded-2xl shadow-xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{job.jobTitle}</h2>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
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
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        onClick={onClose}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Apply by {new Date(job.applicationDeadline).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            })}
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {job.currentApplications}/{job.maxApplications} Applied
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{job.jobDescription}</p>
                    </div>

                    {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
                            <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-2">
                                {job.keyResponsibilities.map((kr, idx) => (
                                    <li key={idx}>{kr}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                            <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-2">
                                {job.requiredSkills.map((skill, idx) => (
                                    <li key={idx}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        Close
                    </button>
                    <button
                        onClick={onApply}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
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

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [experienceFilter, setExperienceFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"

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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-24">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">
                        Explore & Apply to Open Roles
                    </h1>
                    <p className="text-blue-100 text-center text-lg max-w-2xl mx-auto">
                        Find your next career opportunity with us
                    </p>
                </div>
            </div>

            <div className=" px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="mb-6 space-y-4">
                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search jobs, departments, or keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                <Filter className="h-5 w-5" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Department</label>
                                    <select
                                        value={departmentFilter}
                                        onChange={(e) => setDepartmentFilter(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                                    >
                                        <option value="">All Departments</option>
                                        {uniqueDepartments.map(dept => (
                                            <option key={dept} value={dept}>{dept.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Location</label>
                                    <select
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                                    >
                                        <option value="">All Locations</option>
                                        {uniqueLocations.map(location => (
                                            <option key={location} value={location}>{location}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Experience</label>
                                    <select
                                        value={experienceFilter}
                                        onChange={(e) => setExperienceFilter(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
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
                                        className="w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Jobs Count */}
                <div className="mb-6 text-lg font-semibold">
                    {filteredJobs.length} of {jobs.length} jobs
                    {(searchTerm || departmentFilter || locationFilter || experienceFilter) && (
                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
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
                            {/* Jobs Table - Primary View */}
                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-sm">Job Title</th>
                                                <th className="text-left p-4 font-semibold text-sm hidden md:table-cell">Department</th>
                                                <th className="text-left p-4 font-semibold text-sm hidden lg:table-cell">Location</th>
                                                <th className="text-left p-4 font-semibold text-sm hidden xl:table-cell">Experience</th>
                                                <th className="text-left p-4 font-semibold text-sm hidden sm:table-cell">Applications</th>
                                                <th className="text-left p-4 font-semibold text-sm hidden lg:table-cell">Deadline</th>
                                                <th className="text-left p-4 font-semibold text-sm w-32">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredJobs.map((job) => {
                                                const spotsLeft = job.maxApplications - job.currentApplications;
                                                const daysLeft = calculateDaysLeft(job.applicationDeadline);

                                                return (
                                                    <tr
                                                        key={job._id}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                    >
                                                        <td className="p-4">
                                                            <div>
                                                                <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                                    {job.jobTitle}
                                                                </div>
                                                                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xs">
                                                                    {job.jobDescription}
                                                                </div>
                                                                {/* Mobile-only info */}
                                                                <div className="md:hidden mt-2 space-y-1">
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        <Building2 className="h-3 w-3 inline mr-1" />
                                                                        {job.department?.toUpperCase()}
                                            </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        <MapPin className="h-3 w-3 inline mr-1" />
                                                                        {job.jobLocation}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm hidden md:table-cell">
                                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md px-3 text-xs font-medium">
                                                                {job.department?.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-sm hidden lg:table-cell">
                                                            <div className="flex items-center">
                                                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                                                {job.jobLocation}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm hidden xl:table-cell">
                                                            <span className="font-medium">{job.experience}</span>
                                                        </td>
                                                        <td className="p-4 text-sm hidden sm:table-cell">
                                                            <div>
                                                                <div className="flex items-center gap-1 mb-1">
                                                                    <Users className="h-4 w-4 text-gray-400" />
                                                                    <span className="font-medium">{job.currentApplications}/{job.maxApplications}</span>
                                                                </div>
                                                                {spotsLeft <= 5 && spotsLeft > 0 && (
                                                                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                                                                        {spotsLeft} spots left
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm hidden lg:table-cell">
                                                            <div>
                                                                <div className="font-medium mb-1">{formatDate(job.applicationDeadline)}</div>
                                                                {daysLeft > 0 ? (
                                                                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-1 rounded-md px-3">
                                                                        {daysLeft} days left
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 py-1 rounded-md px-3">
                                                                        Closed
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <button
                                                                onClick={() => handleJobClick(job._id)}
                                                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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
                                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
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
        </div>
    );
};

export default CareersPage;