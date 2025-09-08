import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../Context/AuthContext'
import { FourSquare } from 'react-loading-indicators'
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Send,
  Users,
  Search,
  X,
  Key,
  Eye,
  EyeOff,
  Clock,
  LogIn,
  LogOut,
  Calendar,
  Timer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { toast } from 'react-toastify'
const Profile = () => {
  const base_url = import.meta.env.VITE_BASE_URL
  const { user, token } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Attendance related state
  const [attendanceLoading, setAttendanceLoading] = useState(false)

  const [todayAttendance, setTodayAttendance] = useState(null)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  // Calendar related state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarData, setCalendarData] = useState({})
  const [showDayModal, setShowDayModal] = useState(false)
  const [selectedDayData, setSelectedDayData] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)

  const [isNavigating, setIsNavigating] = useState(false);
  // Fetch today's attendance on component mount
  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchTodayAttendance()
      fetchMonthlyAttendance()
    }
  }, [activeTab, token, currentMonth])

  const resetPassword = async () => {
    setIsLoading(true)
    setMessage({ type: '', text: '' })
    try {
      const response = await fetch(
        `${base_url}/api/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(passwordData)
        }
      )
      const data = await response.json()
      if (response.ok) {
        setMessage({ type: 'success', text: 'Password reset successful!' })
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          setShowResetPasswordModal(false)
          setMessage({ type: '', text: '' })
        }, 2000)
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to reset password'
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPasswordSubmit = e => {
    e.preventDefault()

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setMessage({ type: 'error', text: 'All fields are required' })
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New password and confirm password do not match'
      })
      return
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'New password must be at least 6 characters long'
      })
      return
    }
    resetPassword()
  }

  const togglePasswordVisibility = field => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  // Helper function to check if a date is weekend (Saturday or Sunday)
  const isWeekend = date => {
    const dayOfWeek = date.getDay()
    return dayOfWeek === 0 || dayOfWeek === 6 // 0 = Sunday, 6 = Saturday
  }

  // Helper function to determine status for display
  const getDayStatus = day => {
    if (!day) return null
    // Use currentMonth for the calendar context, not today!
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    const today = new Date()
    const isFuture = date > today
    //if (isFuture) return null

    const dayData = calendarData[day]
    if (dayData) return dayData.status

    // For past dates without data, correctly identify the weekend
    if (isWeekend(date)) return 'weekend'
    return 'absent'
  }

  // Attendance functions
  const fetchTodayAttendance = async () => {
    try {
      const response = await fetch(
        `${base_url}/api/attendance/search`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        setTodayAttendance(data.attendance)
      } else if (response.status === 404) {
        setTodayAttendance(null)
      } else {
        console.error(
          'Attendance fetch failed:',
          response.status,
          response.statusText
        )
        setTodayAttendance(null)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
      setTodayAttendance(null)
    }
  }

  const fetchMonthlyAttendance = async () => {
    try {
      const response = await fetch(
        `${base_url}/api/attendance/search?month=${currentMonth.getMonth() + 1
        }&year=${currentMonth.getFullYear()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        const records = data.records || []

        // Convert array to object with date as key for easy lookup
        const calendarObj = {}
        records.forEach(record => {
          const date = new Date(record.date).getDate()
          calendarObj[date] = record
        })
        setCalendarData(calendarObj)
        setAttendanceHistory(records)
      } else {
        console.error(
          'Monthly attendance fetch failed:',
          response.status,
          response.statusText
        )
        setCalendarData({})
        setAttendanceHistory([])
      }
    } catch (error) {
      console.error('Error fetching monthly attendance:', error)
      setCalendarData({})
      setAttendanceHistory([])
    }
  }

  const handleCheckIn = async () => {
    setAttendanceLoading(true)
    try {
      const response = await fetch(
        `${base_url}/api/attendance/checkin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            deviceInfo: navigator.userAgent,
            source: 'web'
          })
        }
      )

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }
      const data = await response.json()
      if (response.ok) {
        toast.success('Successfully checked in!')
        setTodayAttendance(data.attendance)
        fetchMonthlyAttendance() // Refresh calendar data
      } else {
        toast.error(data.error || 'Failed to check in')
      }
    } catch (error) {
      console.error('Check-in error:', error)
      toast.error(
        'Server error - please check if the attendance API is running'
      )
    } finally {
      setAttendanceLoading(false)
    }
  }

  const handleCheckOut = async () => {
    setAttendanceLoading(true)
    try {
      const response = await fetch(
        `${base_url}/api/attendance/checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }
      const data = await response.json()
      if (response.ok) {
        toast.success('Successfully checked out!')
        setTodayAttendance(data.attendance)
        fetchMonthlyAttendance() // Refresh calendar data
      } else {
        toast.error(data.error || 'Failed to check out')
      }
    } catch (error) {
      console.error('Check-out error:', error)
      toast.error(
        'Server error - please check if the attendance API is running'
      )
    } finally {
      setAttendanceLoading(false)
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'full-day':
        return 'text-green-600'
      case 'half-day':
        return 'text-yellow-600'
      case 'checked-in':
        return 'text-blue-600'
      case 'absent':
        return 'text-red-600'
      case 'remote':
        return 'text-purple-600'
      case 'on-leave':
      case 'paid-leave':
      case 'sick-leave':
        return 'text-gray-600'
      case 'weekend':
        return 'text-indigo-600'
      case 'holiday':
        return 'text-orange-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusBgColor = status => {
    switch (status) {
      case 'full-day':
        return 'bg-green-100 border-green-300'
      case 'half-day':
        return 'bg-yellow-100 border-yellow-300'
      case 'checked-in':
        return 'bg-blue-100 border-blue-300'
      case 'absent':
        return 'bg-red-100 border-red-300'
      case 'remote':
        return 'bg-purple-100 border-purple-300'
      case 'on-leave':
      case 'paid-leave':
      case 'sick-leave':
        return 'bg-gray-100 border-gray-300'
      case 'weekend':
        return 'bg-indigo-100 border-indigo-300'
      case 'holiday':
        return 'bg-orange-100 border-orange-300'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const formatTime = dateString => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Calendar functions
  const getDaysInMonth = date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = date => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth) // returns 0-6 (Sunday-Saturday)
    const days = []

    // Pad empty cells for previous days of week
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add the actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const handleDayClick = day => {
    if (!day) return

    // Compute clickedDate and get today's date
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    const today = new Date()
    const isFuture = clickedDate > today

    const actualData = calendarData[day]
    let status = null

    if (actualData) {
      status = actualData.status
    } else if (!isFuture) {
      status = isWeekend(clickedDate) ? 'weekend' : 'absent'
    }

    // Prevent opening modal for unwanted statuses
    if (
      status === 'absent' ||
      status === 'on-leave' ||
      status === 'paid-leave' ||
      status === 'sick-leave' ||
      status === 'weekend' ||
      status === 'holiday'
    ) {
      // Optionally show a toast notification here
      return
    }

    setSelectedDay(day)
    if (actualData) {
      setSelectedDayData(actualData)
    } else if (!isFuture) {
      setSelectedDayData({
        date: clickedDate,
        status,
        totalHours: 0,
        sessions: []
      })
    } else {
      setSelectedDayData(null)
    }

    setShowDayModal(true)
  }

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const latestMonth = new Date(prev.getFullYear(), prev.getMonth() + direction, 1);
      return latestMonth;
    });
  };


  const isToday = day => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }



  const isCheckedIn =
    todayAttendance &&
    todayAttendance.sessions.length > 0 &&
    !todayAttendance.sessions[todayAttendance.sessions.length - 1].logoutTime

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen text-gray-600'>
        <FourSquare size={40} color='#4A90E2' />
      </div>
    )
  }

  return (
    <>
      <div className='bg-gray-100 dark:bg-gray-900 min-h-[10px]  px-6 flex justify-center overflow-x-hidden'>
        <div className='w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-lg'>
          {/* Tab Navigation */}
          <div className='border-b border-gray-200 dark:border-gray-700'>
            <nav className='flex space-x-8 px-8 '>
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'attendance'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                Attendance
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className='p-8'>
            {activeTab === 'profile' && (
              <div>
                <div className='flex flex-col sm:flex-row items-center sm:items-start mb-8 gap-8'>
                  <img
                    src={user.profileImage}
                    alt='Profile'
                    className='w-28 h-28 rounded-full border shadow'
                  />
                  <div className='flex-1'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                      {user.username}
                    </h1>
                    <button
                      onClick={() => setShowResetPasswordModal(true)}
                      className='flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200'
                    >
                      <Key size={16} />
                      Reset Password
                    </button>
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-gray-700 dark:text-gray-300 text-sm'>
                  <p>
                    <strong>Email:</strong> {user.email || '-'}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role || '-'}
                  </p>
                  <p>
                    <strong>Employee Code:</strong> {user.employeeCode || '-'}
                  </p>
                  <p>
                    <strong>Contact:</strong> {user.contact || '-'}
                  </p>
                  <p>
                    <strong>Salary:</strong>{' '}
                    {user.Salary ? `₹${user.Salary}` : '-'}
                  </p>
                  <p>
                    <strong>Account Type:</strong>{' '}
                    {user.accountType ? 'Corporate' : 'Standard'}
                  </p>
                  <p>
                    <strong>Date of Joining:</strong>{' '}
                    {user.dateOfJoining
                      ? new Date(user.dateOfJoining).toLocaleDateString()
                      : '-'}
                  </p>
                  <p>
                    <strong>Last Seen:</strong>{' '}
                    {user.lastSeen
                      ? new Date(user.lastSeen).toLocaleString()
                      : '-'}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={
                        user.status === 'active'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }
                    >
                      {user.status || '-'}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                  Attendance Management
                </h2>

                {/* Today's Quick Actions */}
                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6'>
                  <div className='flex gap-4'>
                    {todayAttendance && (
                      <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                        <span
                          className={`font-medium ${getStatusColor(
                            todayAttendance.status
                          )}`}
                        >
                          {todayAttendance.status
                            .replace('-', ' ')
                            .toUpperCase()}
                        </span>
                        {todayAttendance.totalHours > 0 && (
                          <span>
                            {todayAttendance.totalHours.toFixed(2)} hrs worked
                          </span>
                        )}
                        <span className='text-sm text-gray-500 dark:text-gray-400'>
                          {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Calendar View */}
                <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                  {/* Calendar Header */}
                  <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                      {currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h3>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => navigateMonth(-1)}
                        className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                      >
                        <ChevronLeft
                          size={20}
                          className='text-gray-600 dark:text-gray-400'
                        />
                      </button>
                      <button
                        onClick={() => setCurrentMonth(new Date())}
                        className='px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'
                      >
                        Today
                      </button>
                      <button
                        onClick={() => navigateMonth(1)}
                        className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                      >
                        <ChevronRight
                          size={20}
                          className='text-gray-600 dark:text-gray-400'
                        />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className='p-6'>
                    {/* Days of week header */}
                    <div className='grid grid-cols-7 gap-2 mb-4'>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                        day => (
                          <div
                            key={day}
                            className='text-center text-xs font-medium text-gray-500 dark:text-gray-400'
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>
                    {/* Calendar Days */}
                    <div className='grid grid-cols-7 gap-2'>
                      {generateCalendarDays().map((day, index) => {
                        if (!day) {
                          return (
                            <div key={index} className='aspect-square'></div>
                          )
                        }

                        const dayStatus = getDayStatus(day)
                        const isCurrentDay = isToday(day)

                        // Check if date is in the future
                        const dayDate = new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day
                        )
                        const today = new Date()
                        const isFuture = dayDate > today

                        // Days to disable - includes future dates and certain statuses
                        const disabledStatuses = [
                          'absent',
                          'on-leave',
                          'paid-leave',
                          'sick-leave',
                          'weekend',
                          'holiday'
                        ]

                        const isDisabled = isFuture || disabledStatuses.includes(dayStatus)

                        return (
                          <button
                            key={day}
                            onClick={() => handleDayClick(day)}
                            disabled={isDisabled}
                            className={`
          aspect-square flex items-center justify-center rounded-md text-xs font-medium
          transition-all duration-200
          ${isCurrentDay ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
          ${getStatusBgColor(dayStatus)}
          ${isDisabled
                                ? 'cursor-not-allowed  hover:scale-100 hover:shadow-none'
                                : 'hover:scale-105 hover:shadow cursor-pointer'
                              }
        `}
                          >
                            <span
                              className={`${isCurrentDay
                                  ? 'text-blue-600 font-bold'
                                  : isDisabled
                                    ? 'text-gray-400'
                                    : getStatusColor(dayStatus)
                                }`}
                            >
                              {day}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Legend */}
                    <div className='mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
                      <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Status Legend:
                      </p>
                      <div className='flex flex-wrap gap-3 text-xs'>
                        <div className='flex items-center gap-1'>
                          <div className='w-3 h-3 rounded bg-green-400'></div>
                          <span className='text-gray-600 dark:text-gray-400'>
                            Full Day
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <div className='w-3 h-3 rounded bg-yellow-400'></div>
                          <span className='text-gray-600 dark:text-gray-400'>
                            Half Day
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <div className='w-3 h-3 rounded bg-blue-400'></div>
                          <span className='text-gray-600 dark:text-gray-400'>
                            Checked In
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <div className='w-3 h-3 rounded bg-red-400'></div>
                          <span className='text-gray-600 dark:text-gray-400'>
                            Absent
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <div className='w-3 h-3 rounded bg-purple-400'></div>
                          <span className='text-gray-600 dark:text-gray-400'>
                            Remote
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <div className='w-3 h-3 rounded bg-gray-400'></div>
                          <span className='text-gray-600 dark:text-gray-400'>
                            On Leave
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <div className='w-3 h-3 rounded bg-indigo-400'></div>
                          <span className='text-gray-600 dark:text-gray-400'>
                            Weekend
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <div className='w-3 h-3 rounded bg-orange-400'></div>
                          <span className='text-gray-600 dark:text-gray-400'>
                            Holiday
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {showDayModal && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                {currentMonth.toLocaleDateString('en-US', { month: 'long' })}{' '}
                {selectedDay}, {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={() => setShowDayModal(false)}
                className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              >
                <X size={20} />
              </button>
            </div>

            {selectedDayData ? (
              <div className='space-y-4'>
                {/* Status Overview */}
                <div
                  className={`p-4 rounded-lg border-2 ${getStatusBgColor(
                    selectedDayData.status
                  )}`}
                >
                  <div className='flex items-center justify-between mb-2'>
                    <span
                      className={`font-medium ${getStatusColor(
                        selectedDayData.status
                      )}`}
                    >
                      {selectedDayData.status.replace('-', ' ').toUpperCase()}
                    </span>
                    {selectedDayData.totalHours > 0 && (
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        Total: {selectedDayData.totalHours.toFixed(2)} hours
                      </span>
                    )}
                  </div>
                </div>

                {/* Sessions Detail */}
                {selectedDayData.sessions &&
                  selectedDayData.sessions.length > 0 && (
                    <div>
                      <h4 className='font-medium text-gray-900 dark:text-white mb-3'>
                        Session Details
                      </h4>
                      <div className='space-y-3'>
                        {selectedDayData.sessions.map((session, index) => (
                          <div
                            key={index}
                            className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'
                          >
                            <div className='flex items-center justify-between mb-2'>
                              <span className='font-medium text-gray-700 dark:text-gray-300'>
                                Session {index + 1}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${session.status === 'active'
                                    ? 'bg-blue-100 text-blue-700'
                                    : session.status === 'closed'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}
                              >
                                {session.status}
                              </span>
                            </div>

                            <div className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                              <div className='flex items-center gap-2'>
                                <LogIn size={14} />
                                <span>
                                  Check In: {formatTime(session.loginTime)}
                                </span>
                              </div>
                              {session.logoutTime && (
                                <div className='flex items-center gap-2'>
                                  <LogOut size={14} />
                                  <span>
                                    Check Out: {formatTime(session.logoutTime)}
                                  </span>
                                </div>
                              )}
                              {session.duration && (
                                <div className='flex items-center gap-2'>
                                  <Timer size={14} />
                                  <span>
                                    Duration: {session.duration.toFixed(2)}{' '}
                                    hours
                                  </span>
                                </div>
                              )}
                            </div>

                            {session.device && (
                              <div className='mt-2 pt-2 border-t border-gray-200 dark:border-gray-600'>
                                <p className='text-xs text-gray-500 dark:text-gray-500'>
                                  Device:{' '}
                                  {session.device.length > 50
                                    ? session.device.substring(0, 50) + '...'
                                    : session.device}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Additional Info */}
                {selectedDayData.notes && (
                  <div>
                    <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                      Notes
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'>
                      {selectedDayData.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className='text-center py-8'>
                <Calendar size={48} className='mx-auto text-gray-400 mb-4' />
                <p className='text-gray-600 dark:text-gray-400 mb-2'>
                  No Attendance Record
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-500'>
                  {isToday(selectedDay)
                    ? "You haven't checked in today yet."
                    : 'No attendance was recorded for this day.'}
                </p>
                {isToday(selectedDay) && (
                  <button
                    onClick={() => {
                      setShowDayModal(false)
                      handleCheckIn()
                    }}
                    className='mt-4 flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 mx-auto'
                  >
                    <LogIn size={16} />
                    Check In Now
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                Reset Password
              </h2>
              <button
                onClick={() => {
                  setShowResetPasswordModal(false)
                  setMessage({ type: '', text: '' })
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  })
                }}
                className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              >
                <X size={20} />
              </button>
            </div>
            {message.text && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
              >
                {message.text}
              </div>
            )}
            <form onSubmit={handleResetPasswordSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Current Password
                </label>
                <div className='relative'>
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={e =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value
                      })
                    }
                    className='w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => togglePasswordVisibility('current')}
                    className='absolute right-3 top-2.5 text-gray-500 hover:text-gray-700'
                  >
                    {showPasswords.current ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  New Password
                </label>
                <div className='relative'>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={e =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value
                      })
                    }
                    className='w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                    required
                    minLength='6'
                  />
                  <button
                    type='button'
                    onClick={() => togglePasswordVisibility('new')}
                    className='absolute right-3 top-2.5 text-gray-500 hover:text-gray-700'
                  >
                    {showPasswords.new ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Confirm New Password
                </label>
                <div className='relative'>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={e =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value
                      })
                    }
                    className='w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                    required
                    minLength='6'
                  />
                  <button
                    type='button'
                    onClick={() => togglePasswordVisibility('confirm')}
                    className='absolute right-3 top-2.5 text-gray-500 hover:text-gray-700'
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
              <div className='flex gap-3 pt-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowResetPasswordModal(false)
                    setMessage({ type: '', text: '' })
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    })
                  }}
                  className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
                >
                  {isLoading ? (
                    <>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile
