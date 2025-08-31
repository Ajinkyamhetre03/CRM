import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../../Context/AuthContext";
import { FourSquare } from "react-loading-indicators";
import {
  Eye, CheckCircle, XCircle, User, AlertCircle, X,
  Search, Filter, DollarSign,
  Clock, Send, UserPlus, RefreshCw
} from "lucide-react";
import { toast } from "react-toastify";

const PaymentVerification = () => {
  const base_Url = import.meta.env.VITE_BASE_URL;
  const { token } = useAuth();

  // Main data states
  const [paymentsData, setPaymentsData] = useState({
    summary: {},
    candidates: { all: [], pendingVerification: [], verifiedPayments: [], rejectedPayments: [] }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter and view states
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Verification form states
  const [isValid, setIsValid] = useState(true);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Employee creation form states
  const [employeeForm, setEmployeeForm] = useState({
    temporaryPassword: "",
    joiningDate: "",
    salary: "",
    additionalDetails: ""
  });

  // Email tracking modal states
  const [trackingData, setTrackingData] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  // Fetch candidates with payments
  const fetchPaymentsData = async () => {
    try {
      const res = await axios.get(`${base_Url}/api/hr/candidates-with-payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPaymentsData(res.data.data);
      } else {
        throw new Error(res.data.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Fetch payments error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch payment data");
    }
  };

  // Fetch email tracking details for a specific application
  const fetchTrackingData = async (applicationId) => {
    try {
      const res = await axios.get(`${base_Url}/api/hr/email-tracking/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setTrackingData(res.data.data);
        setShowTrackingModal(true);
      } else {
        throw new Error(res.data.message || "Failed to fetch email tracking details");
      }
    } catch (err) {
      console.error("Fetch email tracking error:", err);
      toast.error("Failed to fetch email tracking details");
    }
  };

  // Initial data load
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await fetchPaymentsData();
    } catch (err) {
      console.error("Load data error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    await loadAllData();
    setIsRefreshing(false);
    toast.success("Data refreshed successfully");
  };

  useEffect(() => {
    loadAllData();
  }, [base_Url, token]);

  // Handle payment verification
  const handleVerifyPayment = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;

    setIsProcessing(true);
    try {
      const payload = {
        isValid,
        verificationNotes,
        ...((!isValid && rejectionReason) && { rejectionReason })
      };

      const res = await axios.post(
        `${base_Url}/api/hr/applications/${selectedApplication._id}/verify-payment`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setShowVerifyModal(false);
        resetVerificationForm();
        await loadAllData();
        // After verification, fetch email tracking details
        await fetchTrackingData(selectedApplication._id);
      }
    } catch (err) {
      console.error("Verify payment error:", err);
      toast.error(err.response?.data?.message || "Failed to verify payment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle employee creation
  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;

    setIsProcessing(true);
    try {
      const res = await axios.post(
        `${base_Url}/api/hr/applications/${selectedApplication._id}/create-employee`,
        employeeForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Employee created successfully!");
        setShowCreateModal(false);
        resetEmployeeForm();
        await loadAllData();
        // Optionally, show tracking modal after employee creation too
        await fetchTrackingData(selectedApplication._id);
      }
    } catch (err) {
      console.error("Create employee error:", err);
      toast.error(err.response?.data?.message || "Failed to create employee");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset forms
  const resetVerificationForm = () => {
    setSelectedApplication(null);
    setIsValid(true);
    setVerificationNotes("");
    setRejectionReason("");
  };

  const resetEmployeeForm = () => {
    setSelectedApplication(null);
    setEmployeeForm({
      temporaryPassword: "",
      joiningDate: "",
      salary: "",
      additionalDetails: ""
    });
  };

  // Get filtered candidates based on status and search
  const getFilteredCandidates = () => {
    let candidates = [];

    switch (statusFilter) {
      case "pending":
        candidates = paymentsData.candidates.pendingVerification || [];
        break;
      case "verified":
        candidates = paymentsData.candidates.verifiedPayments || [];
        break;
      case "rejected":
        candidates = paymentsData.candidates.rejectedPayments || [];
        break;
      default:
        candidates = paymentsData.candidates.all || [];
    }

    if (filter) {
      candidates = candidates.filter((c) =>
        c.fullName?.toLowerCase().includes(filter.toLowerCase()) ||
        c.email?.toLowerCase().includes(filter.toLowerCase()) ||
        c.jobId?.jobTitle?.toLowerCase().includes(filter.toLowerCase()) ||
        c.paymentTransactionId?.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return candidates;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Get status badge component
  const getStatusBadge = (application) => {
    if (application.employeeCreated) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          <UserPlus className="w-3 h-3 mr-1" />
          Employee Created
        </span>
      );
    } else if (application.paymentVerified === true) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    } else if (application.paymentVerified === false) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <FourSquare
          color="#3B82F6"
          size="medium"
          text="Loading Payment Data..."
          textColor="#6B7280"
        />
      </div>
    );
  }

  const filteredCandidates = getFilteredCandidates();

  // Email Tracking Modal
  const TrackingModal = () => {
    if (!showTrackingModal || !trackingData) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex justify-center items-center p-4 z-50">
        <div className="relative bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 w-full max-w-sm text-center text-gray-900 dark:text-white">
          <h2 className="text-xl font-semibold mb-4">Email Tracking Details</h2>
          <p><strong>Name:</strong> {trackingData.fullName}</p>
          <p><strong>Email:</strong> {trackingData.email}</p>
          <p><strong>Total Emails Sent:</strong> {trackingData.totalEmailsSent}</p>
          <p><strong>Candidate Confirmed:</strong> {trackingData.candidateConfirmed ? "Yes" : "No"}</p>
          <p><strong>Payment Completed:</strong> {trackingData.paymentCompleted ? "Yes" : "No"}</p>
          <p><strong>Payment Verified:</strong> {trackingData.paymentVerified ? "Yes" : "No"}</p>
          <p><strong>Employee Created:</strong> {trackingData.employeeCreated ? "Yes" : "No"}</p>
          <button
            className="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              setShowTrackingModal(false);
              setTrackingData(null);
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

 return (
  <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-10">
    {/* Container to limit max width and center */}
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white leading-tight">
            Payment Verification Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 max-w-md">
            Manage candidate payments and employee creation with ease.
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, job title, or transaction ID..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none w-full text-sm sm:text-base"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Verification</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm sm:text-base">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide whitespace-nowrap">
                Candidate
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide whitespace-nowrap">
                Job Details
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide whitespace-nowrap">
                Payment Info
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide whitespace-nowrap">
                Status
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap max-w-[200px]">
                    <div className="flex items-center space-x-3 truncate">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="truncate">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {app.fullName}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 truncate">
                          {app.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-[180px] truncate">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {app.jobId?.jobTitle || "N/A"}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 truncate">
                      {app.jobId?.department || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-[140px] truncate">
                    <div className="text-gray-900 dark:text-white">
                      ₹{app.paymentAmount || 1000}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 truncate">
                      {app.paymentTransactionId ? `ID: ${app.paymentTransactionId.slice(0, 10)}...` : "No Transaction ID"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(app.paymentDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-[120px]">
                    {getStatusBadge(app)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-[220px]">
                    <div className="flex flex-wrap gap-2">
                      {/* Verify Button */}
                      <button
                        onClick={() => {
                          setSelectedApplication(app);
                          setIsValid(true);
                          setVerificationNotes("");
                          setRejectionReason("");
                          setShowVerifyModal(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-xs sm:text-sm"
                      >
                        <Eye size={14} />
                        <span>Verify</span>
                      </button>

                      {/* Create Employee Button */}
                      {app.paymentVerified && !app.employeeCreated && (
                        <button
                          onClick={() => {
                            setSelectedApplication(app);
                            setEmployeeForm({
                              temporaryPassword: "",
                              joiningDate: "",
                              salary: app.expectedSalary || "",
                              additionalDetails: ""
                            });
                            setShowCreateModal(true);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-xs sm:text-sm"
                        >
                          <UserPlus size={14} />
                          <span>Create Employee</span>
                        </button>
                      )}

                      {/* Track Email Button */}
                      <button
                        onClick={() => fetchTrackingData(app._id)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-xs sm:text-sm"
                      >
                        <Send size={14} />
                        <span>Track Email</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <AlertCircle className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">No candidates found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Verify Payment Modal */}
    {showVerifyModal && selectedApplication && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white truncate">
            Verify Payment: {selectedApplication.fullName}
          </h2>
          <form onSubmit={handleVerifyPayment} className="space-y-4 text-sm sm:text-base">
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer text-gray-900 dark:text-white">
                <input
                  type="radio"
                  checked={isValid}
                  onChange={() => setIsValid(true)}
                  className="form-radio text-blue-600"
                />
                <span>Valid Payment</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-gray-900 dark:text-white">
                <input
                  type="radio"
                  checked={!isValid}
                  onChange={() => setIsValid(false)}
                  className="form-radio text-red-600"
                />
                <span>Reject Payment</span>
              </label>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-900 dark:text-white">
                Verification Notes (optional)
              </label>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
              />
            </div>
            {!isValid && (
              <div>
                <label className="block mb-1 font-medium text-gray-900 dark:text-white">
                  Rejection Reason
                </label>
                <textarea
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full rounded border border-red-500 dark:border-red-700 p-2 dark:bg-gray-700 dark:text-white resize-none"
                  rows={2}
                />
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowVerifyModal(false);
                  resetVerificationForm();
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 text-sm sm:text-base"
              >
                {isProcessing ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Create Employee Modal */}
    {showCreateModal && selectedApplication && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 max-w-md w-full overflow-auto max-h-[90vh]">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white truncate">
            Create Employee: {selectedApplication.fullName}
          </h2>
          <form onSubmit={handleCreateEmployee} className="space-y-4 text-sm sm:text-base">
            <div>
              <label className="block mb-1 font-medium text-gray-900 dark:text-white">
                Temporary Password
              </label>
              <input
                type="text"
                value={employeeForm.temporaryPassword}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, temporaryPassword: e.target.value })
                }
                className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-900 dark:text-white">
                Joining Date
              </label>
              <input
                type="date"
                value={employeeForm.joiningDate}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, joiningDate: e.target.value })
                }
                className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-900 dark:text-white">
                Salary
              </label>
              <input
                type="number"
                value={employeeForm.salary}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, salary: e.target.value })
                }
                className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-700 dark:text-white"
                required
                min={0}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-900 dark:text-white">
                Additional Details (optional)
              </label>
              <textarea
                value={employeeForm.additionalDetails}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, additionalDetails: e.target.value })
                }
                className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  resetEmployeeForm();
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 text-sm sm:text-base"
              >
                {isProcessing ? "Creating..." : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Email Tracking Modal */}
    <TrackingModal />
  </div>
);

};

export default PaymentVerification;
