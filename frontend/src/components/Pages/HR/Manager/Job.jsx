import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../../Context/AuthContext";
import { FourSquare } from "react-loading-indicators";
import { Pencil, Trash2, Eye, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

const Job = () => {
  const base_Url = import.meta.env.VITE_BASE_URL;
  const { token } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(true);
  const [filter, setFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editJobId, setEditJobId] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewJob, setViewJob] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const departments = ["hr", "iot", "software", "financial", "business"];
  const statuses = ["active", "inactive", "closed"];

  const initialJob = {
    jobTitle: "",
    jobLocation: "",
    experience: "",
    shift: "",
    department: "",
    jobDescription: "",
    keyResponsibilities: [],
    requiredSkills: [],
    status: "active",
    applicationDeadline: "",
    maxApplications: 100,
  };

  const [newJob, setNewJob] = useState(initialJob);

  // Fetch jobs
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${base_Url}/api/hr/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data.data);
      setIsError(false)
    } catch (err) {
      console.log(err);
      setIsError(err.message)
      setJobs([]);
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [base_Url, token]);

  // Add / Edit job
  const handleAddOrEditJob = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`${base_Url}/api/hr/jobs/${editJobId}`, newJob, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Job updated successfully!");
      } else {
        await axios.post(`${base_Url}/api/hr/jobs`, newJob, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Job created successfully!");
      }
      setShowForm(false);
      setNewJob(initialJob);
      setIsEditMode(false);
      setEditJobId(null);
      fetchJobs();
      setIsError(false)
    } catch (err) {
      console.log(err);
      setIsError(err.message)
      toast.error(err.response?.data?.message || "Failed to save job!");
    }
  };

  const handleEdit = (job) => {
    setNewJob({
      ...job,
      applicationDeadline: job.applicationDeadline
        ? new Date(job.applicationDeadline).toISOString().split("T")[0]
        : "",
    });
    setIsEditMode(true);
    setEditJobId(job._id);
    setShowForm(true);
  };

  const handleDeleteClick = (jobId) => {
    setSelectedJobId(jobId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${base_Url}/api/hr/jobs/${selectedJobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job deleted successfully!");
      fetchJobs();
      setIsError(false)
    } catch (err) {
      console.log(err);
      setIsError(err.message)
      toast.error(err.response?.data?.message || "Failed to delete job!");
    } finally {
      setShowConfirm(false);
      setSelectedJobId(null);
    }
  };

  const handleView = (job) => {
    setViewJob(job);
    setShowViewModal(true);
  };

  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter(
        (job) =>
          job.jobTitle?.toLowerCase().includes(filter.toLowerCase()) ||
          job.department?.toLowerCase().includes(filter.toLowerCase()) ||
          job.jobLocation?.toLowerCase().includes(filter.toLowerCase())
      )
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <FourSquare
          color="#acadac"
          size="medium"
          text="Loading..."
          textColor="#acadac"
        />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] bg-gray-100 dark:bg-gray-900 overflow-hidden">
        {/* Error Icon */}
        <div className="bg-red-100 dark:bg-red-900 p-6 rounded-full mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-600 dark:text-red-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M12 19c-3.866 
               0-7-3.134-7-7s3.134-7 
               7-7 7 3.134 7 7-3.134 7-7 7z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 text-center">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
          {isError || "An unexpected error occurred. Please try again later."}
        </p>

        {/* Action Button */}
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
        >
          Refresh Page
        </button>
      </div>
    );
  }





  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Jobs ({jobs.length})
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by title, location or department"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 w-full sm:w-80 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditMode(false);
              setNewJob(initialJob);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <Plus className="w-5 h-5" /> Add Job
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-gray-800 text-xs sm:text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Location</th>
              <th className="p-2">Department</th>
              <th className="p-2">Experience</th>
              <th className="p-2">Status</th>
              <th className="p-2">Deadline</th>
              <th className="p-2">Applications</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b dark:border-gray-700 text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-center"
                >
                  <td className="p-2">{job.jobTitle}</td>
                  <td className="p-2">{job.jobLocation}</td>
                  <td className="p-2">{job.department}</td>
                  <td className="p-2">{job.experience}</td>
                  <td
                    className={`p-2 ${
                      job.status === "active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {job.status}
                  </td>
                  <td className="p-2">
                    {job.applicationDeadline
                      ? new Date(job.applicationDeadline).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2">
                    {job.currentApplications ?? 0}/{job.maxApplications}
                  </td>
                  <td className="p-2 text-center space-x-1">
                    <button
                      onClick={() => handleView(job)}
                      className="bg-blue-500 text-white p-1 rounded"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="bg-green-500 text-white p-1 rounded"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(job._id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Job Modal */}
{showForm && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
    <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      
      {/* Close Button */}
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <X size={20} />
      </button>

      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {isEditMode ? "Edit Job" : "Add New Job"}
      </h2>

      {/* Form */}
      <form onSubmit={handleAddOrEditJob} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        
        {/* Job Title */}
        <div>
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input type="text" value={newJob.jobTitle}
            onChange={(e) => setNewJob({ ...newJob, jobTitle: e.target.value })} required
            className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
            Location <span className="text-red-500">*</span>
          </label>
          <input type="text" value={newJob.jobLocation}
            onChange={(e) => setNewJob({ ...newJob, jobLocation: e.target.value })} required
            className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Experience */}
        <div>
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
            Experience <span className="text-red-500">*</span>
          </label>
          <input type="text" value={newJob.experience}
            onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })} required
            className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Shift */}
        <div>
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
            Shift <span className="text-red-500">*</span>
          </label>
          <input type="text" value={newJob.shift}
            onChange={(e) => setNewJob({ ...newJob, shift: e.target.value })} required
            className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Department */}
        <div>
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
            Department <span className="text-red-500">*</span>
          </label>
          <select value={newJob.department}
            onChange={(e) => setNewJob({ ...newJob, department: e.target.value })} required
            className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
            Status <span className="text-red-500">*</span>
          </label>
          <select value={newJob.status}
            onChange={(e) => setNewJob({ ...newJob, status: e.target.value })} required
            className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500">
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Job Description */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea value={newJob.jobDescription}
            onChange={(e) => setNewJob({ ...newJob, jobDescription: e.target.value })} required
            className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 h-20" />
        </div>

        {/* Key Responsibilities */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
            Key Responsibilities <span className="text-red-500">*</span>
          </label>
          <textarea value={newJob.keyResponsibilities.join("\n")}
            onChange={(e) => setNewJob({ ...newJob, keyResponsibilities: e.target.value.split("\n").map(r => r.trim()).filter(Boolean) })}
            required className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 h-20" />
        </div>

        {/* Required Skills */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
            Required Skills <span className="text-red-500">*</span>
          </label>
          <textarea value={newJob.requiredSkills.join("\n")}
            onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
            required className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 h-20" />
        </div>

        {/* Application Deadline */}
        <div>
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
            Application Deadline <span className="text-red-500">*</span>
          </label>
          <input type="date" value={newJob.applicationDeadline}
            onChange={(e) => setNewJob({ ...newJob, applicationDeadline: e.target.value })} required
            className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Max Applications */}
        <div>
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
            Max Applications <span className="text-red-500">*</span>
          </label>
          <input type="number" min="1" value={newJob.maxApplications}
            onChange={(e) => setNewJob({ ...newJob, maxApplications: e.target.value })} required
            className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end mt-3">
          <button type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-1.5 rounded-md text-sm transition">
            {isEditMode ? "Update Job" : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* View Job Modal */}
      {showViewModal && viewJob && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex justify-center items-center p-4 z-50">
          <div className="relative bg-white dark:bg-gray-900 backdrop-blur-lg border text-gray-800 dark:text-gray-300 border-white/20 rounded-2xl shadow-xl w-full max-w-3xl h-[90vh] flex flex-col">

            {/* Close Button */}
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-300"
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white px-6 pt-6">
              Job Details
            </h2>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 pb-6 space-y-3 break-words">
              <p><b>Title:</b> {viewJob.jobTitle}</p>
              <p><b>Location:</b> {viewJob.jobLocation}</p>
              <p><b>Experience:</b> {viewJob.experience}</p>
              <p><b>Shift:</b> {viewJob.shift}</p>
              <p><b>Department:</b> {viewJob.department}</p>
              <p><b>Status:</b> {viewJob.status}</p>
              <p><b>Description:</b> {viewJob.jobDescription}</p>

              <div>
                <b>Responsibilities:</b>
                <ul className="list-disc ml-6">
                  {viewJob.keyResponsibilities?.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <b>Skills:</b>
                <ul className="list-disc ml-6">
                  {viewJob.requiredSkills?.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>

              <p>
                <b>Deadline:</b>{" "}
                {viewJob.applicationDeadline
                  ? new Date(viewJob.applicationDeadline).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <b>Applications:</b> {viewJob.currentApplications ?? 0}/
                {viewJob.maxApplications}
              </p>

              <div>
                <p><b>CreatedBy:</b> {viewJob.createdBy.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex justify-center items-center p-4 z-50">
          <div className="relative bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this job?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Job;
