import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../Context/AuthContext";
import { ChevronLeft, ChevronRight, X, LogIn, LogOut, Timer } from "lucide-react";
import { toast } from "react-toastify";

const statusOptions = [
  "full-day", "half-day", "absent", "remote", "on-leave", "paid-leave", "sick-leave", "weekend", "holiday", "checked-in",
];

const getStatusColor = (status) => {
  switch (status) {
    case "full-day": return "text-green-600";
    case "half-day": return "text-yellow-600";
    case "checked-in": return "text-blue-600";
    case "absent": return "text-red-600";
    case "remote": return "text-purple-600";
    case "on-leave":
    case "paid-leave":
    case "sick-leave": return "text-gray-600";
    case "weekend": return "text-indigo-600";
    case "holiday": return "text-orange-600";
    default: return "text-gray-600";
  }
};

const getStatusBgColor = (status) => {
  switch (status) {
    case "full-day": return "bg-green-100 border-green-300";
    case "half-day": return "bg-yellow-100 border-yellow-300";
    case "checked-in": return "bg-blue-100 border-blue-300";
    case "absent": return "bg-red-100 border-red-300";
    case "remote": return "bg-purple-100 border-purple-300";
    case "on-leave":
    case "paid-leave":
    case "sick-leave": return "bg-gray-100 border-gray-300";
    case "weekend": return "bg-indigo-100 border-indigo-300";
    case "holiday": return "bg-orange-100 border-orange-300";
    default: return "bg-gray-50 border-gray-200";
  }
};

const ManagerAttendance = () => {
  const { token } = useAuth();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [usersAttendance, setUsersAttendance] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editAttendance, setEditAttendance] = useState({
    status: "absent",
    remarks: "",
    sessions: [],
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailAttendance, setDetailAttendance] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isFutureDate = (day) => {
    if (!day) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date > new Date();
  };

  const fetchUsersAttendance = async (date) => {
    if (!date) return;
    setLoadingUsers(true);
    const isoDate = date.toISOString().split("T")[0];
    try {
      const res = await fetch(`/api/manager/attendance?date=${isoDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsersAttendance(data.data);
      } else {
        toast.error(data.message || "Failed to fetch attendance");
        setUsersAttendance([]);
      }
    } catch (error) {
      toast.error("Network error fetching attendance");
      setUsersAttendance([]);
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (selectedDate) fetchUsersAttendance(selectedDate);
    else setUsersAttendance([]);
  }, [selectedDate]);

  const handleDayClick = (day) => {
    if (!day) return;
    if (isFutureDate(day)) {
      toast.info("Cannot select future dates.");
      return;
    }
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
  };

  // Edit modal open
  const openEditModal = (userObj) => {
    setEditUser(userObj.user);
    setEditAttendance({
      status: userObj.attendance.status,
      remarks: userObj.attendance.remarks || "",
      sessions: userObj.attendance.sessions || [],
    });
    setShowEditModal(true);
  };

  // Save edited attendance
  const saveAttendanceEdit = async () => {
    if (!editAttendance.remarks.trim()) {
      toast.error("Remarks are required to save changes.");
      return;
    }
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/manager/attendance/${editUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: selectedDate.toISOString().split("T")[0],
          status: editAttendance.status,
          remarks: editAttendance.remarks,
          sessions: editAttendance.sessions,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Attendance updated.");
        setShowEditModal(false);
        fetchUsersAttendance(selectedDate);
      } else {
        toast.error(data.message || "Failed to update attendance");
      }
    } catch {
      toast.error("Network error updating attendance");
    }
    setSavingEdit(false);
  };

  // View attendance detail modal
  const openDetailModal = async (userObj) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(
        `/api/manager/attendance/${userObj.user._id}/detail?date=${selectedDate.toISOString().split("T")[0]}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setDetailAttendance({ user: userObj.user, attendance: data.data });
        setShowDetailModal(true);
      } else {
        toast.error(data.message || "Failed to load attendance detail");
      }
    } catch {
      toast.error("Network error loading attendance detail");
    }
    setLoadingDetail(false);
  };

  const navigateMonth = (direction) => {
    setSelectedDate(null);
    setUsersAttendance([]);
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg max-w-7xl w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Manager Department Attendance
        </h2>

        {/* Calendar Controls */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigateMonth(-1)} aria-label="Previous Month" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronLeft className="text-gray-600 dark:text-gray-400" size={20} />
          </button>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentMonth.toLocaleDateString("en-US", {month: "long", year: "numeric"})}
          </h3>
          <button onClick={() => {
            setCurrentMonth(new Date());
            setSelectedDate(null);
            setUsersAttendance([]);
          }} className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
            Today
          </button>
          <button onClick={() => navigateMonth(1)} aria-label="Next Month" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronRight className="text-gray-600 dark:text-gray-400" size={20} />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(wd => (
            <div key={wd}>{wd}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {generateCalendarDays().map((day, idx) => {
            const disable = isFutureDate(day);
            return (
              <button key={idx} disabled={disable} onClick={() => handleDayClick(day)}
                className={`aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  isToday(day) ? "ring-2 ring-blue-500 ring-offset-1" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                } ${disable ? "opacity-40 cursor-not-allowed" : ""}`}>
                <span className={`${isToday(day) ? "text-blue-600 font-bold" : ""}`}>{day || ""}</span>
              </button>
            );
          })}
        </div>

        {/* Attendance List */}
        {selectedDate && (
          <div className="mt-6 border-t border-gray-300 pt-4 max-h-[500px] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Attendance for {selectedDate.toLocaleDateString("en-US", {weekday:"long", year:"numeric", month:"long", day:"numeric"})}
            </h4>

            {loadingUsers ? (
              <p>Loading attendance...</p>
            ) : usersAttendance.length === 0 ? (
              <p>No users found or no attendance data.</p>
            ) : (
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left">User</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Total Hours</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersAttendance.map(({user, attendance}) => (
                    <tr key={user._id} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-3 py-2 flex items-center gap-2">
                        <img src={user.profileImage} alt={user.username} className="w-8 h-8 rounded-full border" />
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{user.employeeCode}</div>
                        </div>
                      </td>
                      <td className={`px-3 py-2 font-semibold ${getStatusColor(attendance.status)}`}>
                        {attendance.status.replace("-", " ").toUpperCase()}
                      </td>
                      <td className="px-3 py-2">{attendance.totalHours?.toFixed(2) || 0} hrs</td>
                      <td className="px-3 py-2 flex gap-2">
                        <button onClick={() => openEditModal({user, attendance})} className="px-3 py-1 bg-yellow-400 rounded text-white hover:bg-yellow-500 text-xs">
                          Edit
                        </button>
                        <button onClick={() => openDetailModal({user, attendance})} className="px-3 py-1 bg-blue-500 rounded text-white hover:bg-blue-600 text-xs">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Edit Attendance Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md max-h-[80vh] overflow-auto w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Attendance - {editUser.username}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={editAttendance.status}
                  onChange={(e) => setEditAttendance((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("-", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={editAttendance.remarks}
                  onChange={(e) => setEditAttendance((prev) => ({ ...prev, remarks: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded resize-none dark:bg-gray-700 dark:text-white"
                  placeholder="Provide remarks to explain status change"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button onClick={() => setShowEditModal(false)} disabled={savingEdit} className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button onClick={saveAttendanceEdit} disabled={savingEdit} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                  {savingEdit ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Attendance Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg max-h-[80vh] overflow-auto w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Attendance Detail - {detailAttendance?.user.username}</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            {!detailAttendance ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className={`p-4 rounded-lg border-2 ${getStatusBgColor(detailAttendance.attendance.status)} mb-4`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-semibold ${getStatusColor(detailAttendance.attendance.status)}`}>
                      {detailAttendance.attendance.status.toUpperCase()}
                    </span>
                    <span>Total Hours: {detailAttendance.attendance.totalHours?.toFixed(2) || 0}</span>
                  </div>
                  {detailAttendance.attendance.remarks && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">Remarks: {detailAttendance.attendance.remarks}</p>
                  )}
                </div>

                {/* Sessions */}
                {detailAttendance.attendance.sessions && detailAttendance.attendance.sessions.length > 0 ? (
                  <div className="space-y-3">
                    {detailAttendance.attendance.sessions.map((session, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Session {idx + 1}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              session.status === "active"
                                ? "bg-blue-100 text-blue-700"
                                : session.status === "closed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {session.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <div className="flex items-center gap-2">
                            <LogIn size={14} />
                            <span>
                              Check In:{" "}
                              {new Date(session.loginTime).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                          {session.logoutTime && (
                            <div className="flex items-center gap-2">
                              <LogOut size={14} />
                              <span>
                                Check Out:{" "}
                                {new Date(session.logoutTime).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </div>
                          )}
                          {session.duration && (
                            <div className="flex items-center gap-2">
                              <Timer size={14} />
                              <span>Duration: {session.duration.toFixed(2)} hours</span>
                            </div>
                          )}
                          {session.deviceInfo && (
                            <div className="text-xs mt-2 border-t border-gray-200 dark:border-gray-600 pt-2 truncate">
                              Device: {session.deviceInfo}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No session data for this day.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerAttendance;
