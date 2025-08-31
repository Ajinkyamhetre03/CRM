import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../../../Context/AuthContext'
import { FourSquare } from 'react-loading-indicators'
import {
  Eye,
  Edit,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  GraduationCap,
  Briefcase,
  Award,
  Link,
  MessageSquare,
  X,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Users,
  AlertCircle,
  Trash2
} from 'lucide-react'
import { toast } from 'react-toastify'

const Recruitment = () => {
  const base_Url = import.meta.env.VITE_BASE_URL
  const { token } = useAuth()

  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')

  const [showViewModal, setShowViewModal] = useState(false)
  const [viewApplication, setViewApplication] = useState(null)

  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [statusComments, setStatusComments] = useState('')

  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const statuses = [
    {
      value: 'pending',
      label: 'Pending',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      icon: Clock
    },
    {
      value: 'under_review',
      label: 'Under Review',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      icon: Eye
    },
    {
      value: 'shortlisted',
      label: 'Shortlisted',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      icon: UserCheck
    },
    {
      value: 'interview_scheduled',
      label: 'Interview Scheduled',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      icon: Calendar
    },
    {
      value: 'hired',
      label: 'Hired',
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      icon: CheckCircle
    },
    {
      value: 'rejected',
      label: 'Rejected',
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      icon: XCircle
    },

    // ✅ New statuses
    {
      value: 'candidate_confirmed',
      label: 'Candidate Confirmed',
      color: 'text-teal-500',
      bgColor: 'bg-teal-100 dark:bg-teal-900/20',
      icon: User
    },
    {
      value: 'payment_pending',
      label: 'Payment Pending',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      icon: Clock
    },
    {
      value: 'payment_submitted',
      label: 'Payment Submitted',
      color: 'text-pink-500',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20',
      icon: DollarSign
    },
    {
      value: 'payment_verified',
      label: 'Payment Verified',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      icon: CheckCircle
    },
    {
      value: 'employee_created',
      label: 'Employee Created',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      icon: Users
    }
  ]

  const departments = ['hr', 'iot', 'software', 'financial', 'business']

  // Fetch applications
  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${base_Url}/api/hr/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setApplications(res.data.data)
    } catch (err) {
      console.error(err)
      setApplications([])
      toast.error('Failed to fetch applications')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [base_Url, token])

  // Update application status
  const handleUpdateStatus = async e => {
    e.preventDefault()
    try {
      await axios.put(
        `${base_Url}/api/hr/applications/${selectedApplication._id}/status`,
        {
          status: newStatus,
          comments: statusComments
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      toast.success('Application status updated successfully!')
      setShowStatusModal(false)
      setSelectedApplication(null)
      setNewStatus('')
      setStatusComments('')
      fetchApplications()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to update status!')
    }
  }

  // Delete application
  const handleDeleteApplication = async () => {
    setIsDeleting(true)
    try {
      await axios.delete(
        `${base_Url}/api/hr/applications/${applicationToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      toast.success('Application deleted successfully!')
      setShowDeleteModal(false)
      setApplicationToDelete(null)
      fetchApplications()
    } catch (err) {
      console.error(err)
      toast.error(
        err.response?.data?.message || 'Failed to delete application!'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewApplication = async applicationId => {
    try {
      const res = await axios.get(
        `${base_Url}/api/hr/applications/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setViewApplication(res.data.data)
      setShowViewModal(true)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch application details')
    }
  }

  const handleStatusUpdate = application => {
    setSelectedApplication(application)
    setNewStatus(application.status)
    setShowStatusModal(true)
  }

  const handleDeleteConfirm = application => {
    setApplicationToDelete(application)
    setShowDeleteModal(true)
  }

  const getStatusInfo = status => {
    return statuses.find(s => s.value === status) || statuses[0]
  }

  const filteredApplications = Array.isArray(applications)
    ? applications.filter(app => {
        const matchesText =
          app.fullName?.toLowerCase().includes(filter.toLowerCase()) ||
          app.email?.toLowerCase().includes(filter.toLowerCase()) ||
          app.jobId?.jobTitle?.toLowerCase().includes(filter.toLowerCase())

        const matchesStatus = !statusFilter || app.status === statusFilter
        const matchesDepartment =
          !departmentFilter || app.jobId?.department === departmentFilter

        return matchesText && matchesStatus && matchesDepartment
      })
    : []

  // Get statistics
  const getStats = () => {
    const total = applications.length
    const pending = applications.filter(app => app.status === 'pending').length
    const underReview = applications.filter(
      app => app.status === 'under_review'
    ).length
    const shortlisted = applications.filter(
      app => app.status === 'shortlisted'
    ).length
    const interview_scheduled = applications.filter(
      app => app.status === 'interview_scheduled'
    ).length
    const rejected = applications.filter(
      app => app.status === 'rejected'
    ).length
    const hired = applications.filter(app => app.status === 'hired').length

    // ✅ New ones
    const candidateConfirmed = applications.filter(
      app => app.status === 'candidate_confirmed'
    ).length
    const paymentPending = applications.filter(
      app => app.status === 'payment_pending'
    ).length
    const paymentSubmitted = applications.filter(
      app => app.status === 'payment_submitted'
    ).length
    const paymentVerified = applications.filter(
      app => app.status === 'payment_verified'
    ).length
    const employeeCreated = applications.filter(
      app => app.status === 'employee_created'
    ).length

    return {
      total,
      pending,
      underReview,
      shortlisted,
      interview_scheduled,
      rejected,
      hired,
      candidateConfirmed,
      paymentPending,
      paymentSubmitted,
      paymentVerified,
      employeeCreated
    }
  }

  const stats = getStats()

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
        <FourSquare
          color='#acadac'
          size='medium'
          text='Loading...'
          textColor='#acadac'
        />
      </div>
    )
  }

  return (
    <div className='bg-gray-100 dark:bg-gray-900 min-h-screen p-4'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
            Applications ({applications.length})
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Manage job applications and candidate recruitment
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6'>
        {/* Total */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Total
              </p>
              <p className='text-xl font-bold text-gray-900 dark:text-white'>
                {stats.total || '0'}
              </p>
            </div>
            <Users className='h-6 w-6 text-blue-500' />
          </div>
        </div>

        {/* Pending */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Pending
              </p>
              <p className='text-xl font-bold text-yellow-600'>
                {stats.pending || '0'}
              </p>
            </div>
            <Clock className='h-6 w-6 text-yellow-500' />
          </div>
        </div>

        {/* Under Review */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Under Review
              </p>
              <p className='text-xl font-bold text-blue-600'>
                {stats.underReview || '0'}
              </p>
            </div>
            <Eye className='h-6 w-6 text-blue-500' />
          </div>
        </div>

        {/* Shortlisted */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Shortlisted
              </p>
              <p className='text-xl font-bold text-purple-600'>
                {stats.shortlisted || '0'}
              </p>
            </div>
            <UserCheck className='h-6 w-6 text-purple-500' />
          </div>
        </div>

        {/* Interview Scheduled */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Interview
              </p>
              <p className='text-xl font-bold text-indigo-600'>
                {stats.interview_scheduled || '0'}
              </p>
            </div>
            <Calendar className='h-6 w-6 text-indigo-500' />
          </div>
        </div>

        {/* Rejected */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Rejected
              </p>
              <p className='text-xl font-bold text-red-600'>
                {stats.rejected || '0'}
              </p>
            </div>
            <XCircle className='h-6 w-6 text-red-500' />
          </div>
        </div>

        {/* Hired */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Hired
              </p>
              <p className='text-xl font-bold text-green-600'>
                {stats.hired || '0'}
              </p>
            </div>
            <CheckCircle className='h-6 w-6 text-green-500' />
          </div>
        </div>

        {/* Candidate Confirmed */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Candidate Confirmed
              </p>
              <p className='text-xl font-bold text-teal-600'>
                {stats.candidateConfirmed || '0'}
              </p>
            </div>
            <User className='h-6 w-6 text-teal-500' />
          </div>
        </div>

        {/* Payment Pending */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Payment Pending
              </p>
              <p className='text-xl font-bold text-orange-600'>
                {stats.paymentPending || '0'}
              </p>
            </div>
            <Clock className='h-6 w-6 text-orange-500' />
          </div>
        </div>

        {/* Payment Submitted */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Payment Submitted
              </p>
              <p className='text-xl font-bold text-pink-600'>
                {stats.paymentSubmitted || '0'}
              </p>
            </div>
            <DollarSign className='h-6 w-6 text-pink-500' />
          </div>
        </div>

        {/* Payment Verified */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Payment Verified
              </p>
              <p className='text-xl font-bold text-green-600'>
                {stats.paymentVerified || '0'}
              </p>
            </div>
            <CheckCircle className='h-6 w-6 text-green-600' />
          </div>
        </div>

        {/* Employee Created */}
        <div className='bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Employee Created
              </p>
              <p className='text-xl font-bold text-blue-600'>
                {stats.employeeCreated || '0'}
              </p>
            </div>
            <Users className='h-6 w-6 text-blue-600' />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-3 mb-6'>
        <input
          type='text'
          placeholder='Search by name, email, or job title...'
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className='px-4 py-2 w-full sm:w-80 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
        >
          <option value=''>All Statuses</option>
          {statuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={departmentFilter}
          onChange={e => setDepartmentFilter(e.target.value)}
          className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
        >
          <option value=''>All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>
              {dept.charAt(0).toUpperCase() + dept.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Applications Table */}
      <div className='overflow-x-auto rounded-lg shadow-lg'>
        <table className='min-w-full bg-white dark:bg-gray-800 text-xs sm:text-sm'>
          <thead className='bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'>
            <tr>
              <th className='p-3 text-left'>Candidate</th>
              <th className='p-3 text-left'>Job Title</th>
              <th className='p-3 text-left'>Department</th>
              <th className='p-3 text-left'>Experience</th>
              <th className='p-3 text-left'>Expected Salary</th>
              <th className='p-3 text-left'>Status</th>
              <th className='p-3 text-left'>Applied Date</th>
              <th className='p-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map(app => {
                const statusInfo = getStatusInfo(app.status)
                const StatusIcon = statusInfo.icon

                return (
                  <tr
                    key={app._id}
                    className='border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                  >
                    <td className='p-3'>
                      <div className='flex items-center space-x-3'>
                        <div className='flex-shrink-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center'>
                          <User className='w-5 h-5 text-white' />
                        </div>
                        <div>
                          <div className='font-medium text-gray-900 dark:text-white'>
                            {app.fullName}
                          </div>
                          <div className='text-sm text-gray-500 dark:text-gray-400'>
                            {app.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='p-3 text-gray-800 dark:text-gray-200'>
                      {app.jobId?.jobTitle || 'N/A'}
                    </td>
                    <td className='p-3 text-gray-800 dark:text-gray-200'>
                      <span className='px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                        {app.jobId?.department || 'N/A'}
                      </span>
                    </td>
                    <td className='p-3 text-gray-800 dark:text-gray-200'>
                      {app.experience}
                    </td>
                    <td className='p-3 text-gray-800 dark:text-gray-200'>
                      ₹{app.expectedSalary?.toLocaleString() || 'N/A'}
                    </td>
                    <td className='p-3'>
                      <div
                        className={`flex items-center space-x-1 px-2 py-1 rounded-md  text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                      >
                        <StatusIcon className='w-3 h-3' />
                        <span>{statusInfo.label}</span>
                      </div>
                    </td>
                    <td className='p-3 text-gray-800 dark:text-gray-200'>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className='p-3'>
                      <div className='flex justify-center space-x-1'>
                        <button
                          onClick={() => handleViewApplication(app._id)}
                          className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors'
                          title='View Details'
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app)}
                          className='bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors'
                          title='Update Status'
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(app)}
                          className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors'
                          title='Delete Application'
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan='8' className='text-center py-8'>
                  <div className='flex flex-col items-center space-y-2'>
                    <AlertCircle className='w-12 h-12 text-gray-400' />
                    <p className='text-gray-500 dark:text-gray-400'>
                      No applications found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && applicationToDelete && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50'>
          <div className='relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-md'>
            {/* Close Button */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className='absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition'
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center space-x-3'>
                <div className='w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center'>
                  <Trash2 className='w-6 h-6 text-red-600 dark:text-red-400' />
                </div>
                <div>
                  <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
                    Delete Application
                  </h2>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className='p-6'>
              <div className='mb-4'>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>
                  Are you sure you want to delete the application from:
                </p>
                <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-red-500'>
                  <div className='font-semibold text-gray-900 dark:text-white'>
                    {applicationToDelete.fullName}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    {applicationToDelete.email}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    Applied for: {applicationToDelete.jobId?.jobTitle || 'N/A'}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    Application Date:{' '}
                    {new Date(
                      applicationToDelete.createdAt
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4'>
                <div className='flex items-start space-x-2'>
                  <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0' />
                  <div className='text-sm text-red-800 dark:text-red-200'>
                    <p className='font-medium mb-1'>Warning:</p>
                    <ul className='list-disc list-inside space-y-1'>
                      <li>This will permanently delete the application</li>
                      <li>All associated data will be lost</li>
                      <li>The candidate will not be notified</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className='px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50'
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteApplication}
                  disabled={isDeleting}
                  className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2'
                >
                  {isDeleting ? (
                    <>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className='w-4 h-4' />
                      <span>Delete Application</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Application Modal */}
      {showViewModal && viewApplication && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50'>
          <div className='relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
            {/* Close Button */}
            <button
              onClick={() => setShowViewModal(false)}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition z-10'
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className='bg-gray-800 text-white p-6 rounded-t-xl'>
              <div className='flex items-start space-x-4'>
                <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center'>
                  <User className='w-8 h-8' />
                </div>
                <div className='flex-1'>
                  <h2 className='text-2xl font-bold'>
                    {viewApplication.fullName}
                  </h2>
                  <p className='text-blue-100'>
                    {viewApplication.jobId?.jobTitle}
                  </p>
                  <div className='flex items-center space-x-4 mt-2'>
                    <div className='flex items-center space-x-1'>
                      <Mail className='w-4 h-4' />
                      <span className='text-sm'>{viewApplication.email}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Phone className='w-4 h-4' />
                      <span className='text-sm'>{viewApplication.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className='p-6 space-y-6'>
              {/* Job Information */}
              <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center'>
                  <Briefcase className='w-5 h-5 mr-2' />
                  Job Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Position
                    </p>
                    <p className='font-medium text-gray-800 dark:text-gray-200'>
                      {viewApplication.jobId?.jobTitle}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Department
                    </p>
                    <p className='font-medium text-gray-800 dark:text-gray-200'>
                      {viewApplication.jobId?.department}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Location
                    </p>
                    <p className='font-medium text-gray-800 dark:text-gray-200'>
                      {viewApplication.jobId?.jobLocation}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Required Experience
                    </p>
                    <p className='font-medium text-gray-800 dark:text-gray-200'>
                      {viewApplication.jobId?.experience}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center'>
                    <User className='w-5 h-5 mr-2' />
                    Personal Information
                  </h3>
                  <div className='space-y-3'>
                    <div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Date of Birth
                      </p>
                      <p className='font-medium text-gray-800 dark:text-gray-200'>
                        {new Date(
                          viewApplication.dateOfBirth
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Address
                      </p>
                      <p className='font-medium text-gray-800 dark:text-gray-200'>
                        {viewApplication.address?.street},{' '}
                        {viewApplication.address?.city},{' '}
                        {viewApplication.address?.state}{' '}
                        {viewApplication.address?.zipCode}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center'>
                    <DollarSign className='w-5 h-5 mr-2' />
                    Salary & Experience
                  </h3>
                  <div className='space-y-3'>
                    <div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Experience
                      </p>
                      <p className='font-medium text-gray-800 dark:text-gray-200'>
                        {viewApplication.experience}
                      </p>
                    </div>
                    {viewApplication.currentSalary && (
                      <div>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          Current Salary
                        </p>
                        <p className='font-medium text-gray-800 dark:text-gray-200'>
                          ₹{viewApplication.currentSalary.toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Expected Salary
                      </p>
                      <p className='font-medium text-gray-800 dark:text-gray-200'>
                        ₹{viewApplication.expectedSalary.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Notice Period
                      </p>
                      <p className='font-medium text-gray-800 dark:text-gray-200'>
                        {viewApplication.noticePeriod}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center'>
                  <GraduationCap className='w-5 h-5 mr-2' />
                  Education
                </h3>
                <div className='space-y-3'>
                  {viewApplication.education?.map((edu, index) => (
                    <div
                      key={index}
                      className='bg-gray-50 dark:bg-gray-800 p-3 rounded-lg'
                    >
                      <h4 className='font-medium text-gray-800 dark:text-gray-200'>
                        {edu.degree}
                      </h4>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {edu.institution} • {edu.year} • {edu.percentage}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center'>
                  <Award className='w-5 h-5 mr-2' />
                  Skills
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {viewApplication.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className='px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Previous Experience */}
              {viewApplication.previousExperience &&
                viewApplication.previousExperience.length > 0 && (
                  <div>
                    <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center'>
                      <Briefcase className='w-5 h-5 mr-2' />
                      Previous Experience
                    </h3>
                    <div className='space-y-3'>
                      {viewApplication.previousExperience.map((exp, index) => (
                        <div
                          key={index}
                          className='bg-gray-50 dark:bg-gray-800 p-3 rounded-lg'
                        >
                          <h4 className='font-medium text-gray-800 dark:text-gray-200'>
                            {exp.position}
                          </h4>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {exp.company} • {exp.duration}
                          </p>
                          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                            {exp.responsibilities}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Additional Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center'>
                    <MessageSquare className='w-5 h-5 mr-2' />
                    Cover Letter
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg'>
                    {viewApplication.coverLetter}
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center'>
                    <MessageSquare className='w-5 h-5 mr-2' />
                    Why Interested
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg'>
                    {viewApplication.whyInterested}
                  </p>
                </div>
              </div>

              {/* Links */}
              <div>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center'>
                  <Link className='w-5 h-5 mr-2' />
                  Links & Documents
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {viewApplication.resumeUrl && (
                    <a
                      href={viewApplication.resumeUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center space-x-2 p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition'
                    >
                      <FileText className='w-4 h-4' />
                      <span className='text-sm font-medium'>Resume</span>
                    </a>
                  )}
                  {viewApplication.portfolioUrl && (
                    <a
                      href={viewApplication.portfolioUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center space-x-2 p-3 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition'
                    >
                      <Link className='w-4 h-4' />
                      <span className='text-sm font-medium'>Portfolio</span>
                    </a>
                  )}
                  {viewApplication.linkedinProfile && (
                    <a
                      href={viewApplication.linkedinProfile}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center space-x-2 p-3 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition'
                    >
                      <Link className='w-4 h-4' />
                      <span className='text-sm font-medium'>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Status Information */}
              <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>
                  Application Status
                </h3>
                <div className='flex items-center space-x-4'>
                  <div
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
                      getStatusInfo(viewApplication.status).bgColor
                    } ${getStatusInfo(viewApplication.status).color}`}
                  >
                    {React.createElement(
                      getStatusInfo(viewApplication.status).icon,
                      { className: 'w-4 h-4' }
                    )}
                    <span className='font-medium'>
                      {getStatusInfo(viewApplication.status).label}
                    </span>
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    Applied on{' '}
                    {new Date(viewApplication.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
                <button
                  onClick={() => handleDeleteConfirm(viewApplication)}
                  className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2'
                >
                  <Trash2 className='w-4 h-4' />
                  <span>Delete Application</span>
                </button>
                <button
                  onClick={() => handleStatusUpdate(viewApplication)}
                  className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors'
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedApplication && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50'>
          <div className='relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-md'>
            {/* Close Button */}
            <button
              onClick={() => setShowStatusModal(false)}
              className='absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition'
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
                Update Application Status
              </h2>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                {selectedApplication.fullName} -{' '}
                {selectedApplication.jobId?.jobTitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateStatus} className='p-6 space-y-4'>
              <div>
                <label className='block mb-2 font-medium text-gray-600 dark:text-gray-300'>
                  Status <span className='text-red-500'>*</span>
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  required
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500'
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block mb-2 font-medium text-gray-600 dark:text-gray-300'>
                  Comments
                </label>
                <textarea
                  value={statusComments}
                  onChange={e => setStatusComments(e.target.value)}
                  placeholder='Add any comments about this status update...'
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 h-20 resize-none'
                />
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowStatusModal(false)}
                  className='px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors'
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Recruitment
