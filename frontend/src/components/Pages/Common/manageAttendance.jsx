import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../Api";
import { toast } from "react-toastify";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Calendar,
  Clock,
  Edit,
  Save,
  LogIn,
  LogOut,
  Timer
} from "lucide-react";

const manageAttendance = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openCalenderfrom, setOpenCalenderfrom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calendar and attendance state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [calendarData, setCalendarData] = useState({});
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  
  // Modal state for day details and editing
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: '',
    totalHours: 0,
    remarks: ''
  });

  // Fetch all users
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const usersRes = await apiRequest("GET", "/manager/users");
      setUsers(usersRes?.data || []);
    } catch (err) {
      console.log(err);
      setUsers([]);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch attendance data for selected user and month
  const fetchAttendanceData = async (userId) => {
    if (!userId) return;
    
    setLoadingAttendance(true);
    try {
      const response = await apiRequest("GET", `/manager/users/${userId}?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}`);
      const records = response?.data || [];
      setAttendanceData(records);
      
      // Convert array to object with date as key for easy lookup
      const calendarObj = {};
      records.forEach(record => {
        const date = new Date(record.date).getDate();
        calendarObj[date] = record;
      });
      setCalendarData(calendarObj);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendanceData([]);
      setCalendarData({});
      toast.error("Failed to fetch attendance data");
    } finally {
      setLoadingAttendance(false);
    }
  };

  // Update attendance via PUT API
  const updateAttendance = async (userId, date, attendanceUpdate) => {
    try {
      const response = await apiRequest("PUT", `/manager/users/${userId}`, {
        date: date,
        ...attendanceUpdate
      });
      
      if (response.success) {
        toast.success("Attendance updated successfully");
        // Refresh attendance data
        await fetchAttendanceData(userId);
        return true;
      } else {
        toast.error(response.message || "Failed to update attendance");
        return false;
      }
    } catch (err) {
      console.error("Error updating attendance:", err);
      toast.error("Error updating attendance");
      return false;
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedUser && openCalenderfrom) {
      fetchAttendanceData(selectedUser._id);
    }
  }, [selectedUser, currentMonth, openCalenderfrom]);

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Pad empty cells for previous days of week
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add the actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => 
      new Date(prev.getFullYear(), prev.getMonth() + direction, 1)
    );
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isWeekend = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const getDayStatus = (day) => {
    if (!day) return null;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();


    const dayData = calendarData[day];
    if (dayData) return dayData.status;

    if (isWeekend(date)) return 'weekend';
    return 'absent';
  };

  const getStatusColor = (status) => {
    const colors = {
      'full-day': 'text-green-600',
      'half-day': 'text-yellow-600',
      'checked-in': 'text-blue-600',
      'absent': 'text-red-600',
      'remote': 'text-purple-600',
      'on-leave': 'text-gray-600',
      'paid-leave': 'text-gray-600',
      'sick-leave': 'text-gray-600',
      'weekend': 'text-indigo-600',
      'holiday': 'text-orange-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusBgColor = (status) => {
    const colors = {
      'full-day': 'bg-green-100 border-green-300',
      'half-day': 'bg-yellow-100 border-yellow-300',
      'checked-in': 'bg-blue-100 border-blue-300',
      'absent': 'bg-red-100 border-red-300',
      'remote': 'bg-purple-100 border-purple-300',
      'on-leave': 'bg-gray-100 border-gray-300',
      'paid-leave': 'bg-gray-100 border-gray-300',
      'sick-leave': 'bg-gray-100 border-gray-300',
      'weekend': 'bg-indigo-100 border-indigo-300',
      'holiday': 'bg-orange-100 border-orange-300'
    };
    return colors[status] || 'bg-gray-50 border-gray-200';
  };

  const handleDayClick = (day) => {
    if (!day) return;

    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
  
    
   

    setSelectedDay(day);
    const dayData = calendarData[day];
    
    if (dayData) {
      setSelectedDayData(dayData);
      setEditData({
        status: dayData.status,
        totalHours: dayData.totalHours || 0,
        remarks: dayData.remarks || ''
      });
    } else {
      const status = isWeekend(clickedDate) ? 'weekend' : 'absent';
      setSelectedDayData({
        date: clickedDate,
        status,
        totalHours: 0,
        sessions: []
      });
      setEditData({
        status: status,
        totalHours: 0,
        remarks: ''
      });
    }
    
    setIsEditing(false);
    setShowDayModal(true);
  };

  const handleSaveAttendance = async () => {
    if (!selectedUser || !selectedDay) return;

    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDay);
    const success = await updateAttendance(selectedUser._id, selectedDate.toISOString(), editData);
    
    if (success) {
      setIsEditing(false);
      setShowDayModal(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // const statusOptions = [
  //   'full-day', 'half-day', 'absent', 'remote', 'on-leave', 
  //   'paid-leave', 'sick-leave', 'weekend', 'holiday', 'checked-in'
  // ];
  const statusOptions = [
    'half-day',  'remote', 'on-leave', 
    'paid-leave', 'sick-leave',
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Employee Management
        </h1>
        {openCalenderfrom && (
          <button
            onClick={() => {
              setOpenCalenderfrom(false);
              setSelectedUser(null);
            }}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <X className="inline mr-2" size={16} />
            Close Calendar
          </button>
        )}
      </div>

      {!openCalenderfrom ? (
        // User Table
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-white dark:bg-gray-800 text-xs sm:text-sm">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Joining Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Profile</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  <td className="p-3 font-medium">{user.username}</td>
                  <td className="p-3">{user.department}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {user.dateOfJoining ? user.dateOfJoining.split("T")[0] : "N/A"}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenCalenderfrom(true);
                      }}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs transition-colors"
                    >
                      View Attendance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Attendance Calendar
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {/* Calendar Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Attendance for {selectedUser?.username}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {loadingAttendance ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading attendance...</span>
              </div>
            ) : (
              <>
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarDays().map((day, index) => {
                    if (!day) {
                      return <div key={index} className="aspect-square"></div>;
                    }

                    const dayStatus = getDayStatus(day);
                    const isCurrentDay = isToday(day);
                   
                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        
                        className={`
                          aspect-square flex items-center justify-center rounded-md text-xs font-medium
                          transition-all duration-200
                          ${isCurrentDay ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                          ${dayStatus ? getStatusBgColor(dayStatus) : 'bg-gray-100 dark:bg-gray-700'}
                          
                        `}
                      >
                        <span className={`${
                          isCurrentDay ? 'text-blue-600 font-bold' : 
                          dayStatus ? getStatusColor(dayStatus) : 
                          'text-gray-700 dark:text-gray-300'
                        }`}>
                          {day}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status Legend:
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {[
                      { status: 'full-day', label: 'Full Day', color: 'bg-green-400' },
                      { status: 'half-day', label: 'Half Day', color: 'bg-yellow-400' },
                      { status: 'checked-in', label: 'Checked In', color: 'bg-blue-400' },
                      { status: 'absent', label: 'Absent', color: 'bg-red-400' },
                      { status: 'remote', label: 'Remote', color: 'bg-purple-400' },
                      { status: 'on-leave', label: 'On Leave', color: 'bg-gray-400' },
                      { status: 'weekend', label: 'Weekend', color: 'bg-indigo-400' },
                      { status: 'holiday', label: 'Holiday', color: 'bg-orange-400' }
                    ].map(({ status, label, color }) => (
                      <div key={status} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded ${color}`}></div>
                        <span className="text-gray-600 dark:text-gray-400">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Day Detail Modal */}
      {showDayModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentMonth.toLocaleDateString('en-US', { month: 'long' })} {selectedDay}, {currentMonth.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                )}
                <button
                  onClick={() => setShowDayModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {selectedDayData ? (
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({...editData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status.replace('-', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className={`p-3 rounded-lg border-2 ${getStatusBgColor(selectedDayData.status)}`}>
                      <span className={`font-medium ${getStatusColor(selectedDayData.status)}`}>
                        {selectedDayData.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Hours
                  </label>
                  {/* {isEditing ? (
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={editData.totalHours}
                      onChange={(e) => setEditData({...editData, totalHours: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) 
                  : (
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedDayData.totalHours || 0} hours
                    </p>
                  )} */}
                  <p className="text-gray-600 dark:text-gray-400">
                      {selectedDayData.totalHours || 0} hours
                    </p>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Remarks
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.remarks}
                      onChange={(e) => setEditData({...editData, remarks: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Add remarks or notes..."
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {selectedDayData.remarks || 'No remarks added'}
                    </p>
                  )}
                </div>

                {/* Sessions (if available) */}
                {selectedDayData.sessions && selectedDayData.sessions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Session Details
                    </h4>
                    <div className="space-y-3">
                      {selectedDayData.sessions.map((session, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              Session {index + 1}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              session.status === 'active' ? 'bg-blue-100 text-blue-700' :
                              session.status === 'closed' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <LogIn size={14} />
                              <span>Check In: {formatTime(session.loginTime)}</span>
                            </div>
                            {session.logoutTime && (
                              <div className="flex items-center gap-2">
                                <LogOut size={14} />
                                <span>Check Out: {formatTime(session.logoutTime)}</span>
                              </div>
                            )}
                            {session.duration && (
                              <div className="flex items-center gap-2">
                                <Timer size={14} />
                                <span>Duration: {session.duration.toFixed(2)} hours</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAttendance}
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  No Attendance Record
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  No attendance data found for this date.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default manageAttendance;