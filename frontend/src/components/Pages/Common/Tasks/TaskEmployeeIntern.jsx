import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../../Api";
import { FourSquare } from "react-loading-indicators";
import { Eye, X, Trash2, Clock, Activity, FileText, CheckCircle, Pencil  } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../Context/AuthContext";
const TaskDashboard = () => {
  const {user} = useAuth()
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [filter, setFilter] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewTask, setViewTask] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', progress: 0 });

  const [noteMsg, setNoteMsg] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(false);

  // Fetch tasks assigned to the employee
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest("GET", `/${user.role}/tasks`);
      setTasks(res.data || []);
      setIsError(false);
    } catch (err) {
      console.log(err);
      setIsError(err.message || "Failed to fetch tasks");
      setTasks([]);
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    
  }, []);

  const handleView = async (task) => {
    try {
      const details = await apiRequest("GET", `/${user.role}/tasks/${task._id}`);
      setViewTask(details.data);
      setShowViewModal(true);
    } catch (err) {
      console.log(err);
      toast.error("Couldn't fetch task details");
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setEditForm({
      status: task.status,
      progress: task.progress ?? 0
    });
    setShowEditModal(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setUpdatingTask(true);
    try {
      await apiRequest("PUT", `/${user.role}/tasks/${editTask._id}`, editForm);
      toast.success("Task updated successfully!");
      setShowEditModal(false);
      setEditTask(null);
      fetchTasks();
      setIsError(false);
    } catch (err) {
      console.log(err);
      setIsError(err.message);
      toast.error(err.response?.data?.message || "Failed to update task!");
    } finally {
      setUpdatingTask(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteMsg.trim()) {
      toast.error("Note cannot be empty");
      return;
    }
    setAddingNote(true);
    try {
      await apiRequest("POST", `/${user.role}/tasks/${viewTask._id}/notes`, { 
        message: noteMsg 
      });
      toast.success("Note added successfully!");
      handleView(viewTask); // Refresh task details
      setNoteMsg('');
    } catch (err) {
      console.log(err);
      toast.error("Error adding note");
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (taskId, noteId) => {
    try {
      await apiRequest("DELETE", `/${user.role}/tasks/${taskId}/notes/${noteId}`);
      toast.success("Note deleted successfully!");
      handleView(viewTask); // Refresh task details
    } catch (err) {
      console.log(err);
      toast.error("Error deleting note");
    }
  };

  // Calculate stats from tasks
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter(
        (task) =>
          task.title?.toLowerCase().includes(filter.toLowerCase()) ||
          task.priority?.toLowerCase().includes(filter.toLowerCase()) ||
          task.status?.toLowerCase().includes(filter.toLowerCase()) ||
          task.assignedBy?.username?.toLowerCase().includes(filter.toLowerCase())
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
      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Total Tasks</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          <Clock className="w-8 h-8 text-yellow-500" />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Pending</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          <Activity className="w-8 h-8 text-orange-500" />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">In Progress</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Completed</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Tasks ({tasks.length})
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by title, priority, status, or assigned by"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 w-full sm:w-80 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-gray-800 text-xs sm:text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Status</th>
              <th className="p-2">Progress</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Assigned By</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr
                  key={task._id}
                  className="border-b dark:border-gray-700 text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-center"
                >
                  <td className="p-2">{task.title}</td>
                  <td className={`p-2 ${
                    task.priority === "high" || task.priority === "critical"
                      ? "text-red-500"
                      : task.priority === "medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}>
                    {task.priority}
                  </td>
                  <td className={`p-2 ${
                    task.status === "completed"
                      ? "text-green-500"
                      : task.status === "in-progress"
                      ? "text-orange-500"
                      : "text-yellow-500"
                  }`}>
                    {task.status}
                  </td>
                  <td className="p-2">{task.progress ?? 0}%</td>
                  <td className="p-2">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2">
                    {task.assignedBy?.username || '-'}
                  </td>
                  <td className="p-2 text-center space-x-1">
                    <button
                      onClick={() => handleView(task)}
                      className="bg-blue-500 text-white p-1 rounded"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-green-500 text-white p-1 rounded"
                    >
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Task Modal */}
      {showEditModal && editTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Update Task Progress
            </h2>

            {/* Task Info */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium text-gray-800 dark:text-white">{editTask.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{editTask.description}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateTask} className="space-y-4">
              
              {/* Status */}
              <div>
                <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                  Status <span className="text-red-500">*</span>
                </label>
                <select 
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} 
                  required
                  className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Progress */}
              <div>
                <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                  Progress <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={editForm.progress}
                  onChange={(e) => setEditForm({ ...editForm, progress: parseInt(e.target.value) || 0 })} 
                  required
                  className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500" 
                />
                <div className="mt-2">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-full overflow-hidden">
                    <div
                      style={{ width: `${editForm.progress}%` }}
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    />
                  </div>
                  <div className="text-right text-xs text-gray-600 dark:text-gray-400 mt-1">{editForm.progress}%</div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-6 gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-md transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updatingTask}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition disabled:opacity-50"
                >
                  {updatingTask ? "Updating..." : "Update Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Task Modal */}
      {showViewModal && viewTask && (
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
              Task Details
            </h2>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 pb-6 space-y-3 break-words">
              <p><b>Title:</b> {viewTask.title}</p>
              <p><b>Description:</b> {viewTask.description}</p>
              <p><b>Priority:</b> {viewTask.priority}</p>
              <p><b>Status:</b> {viewTask.status}</p>
              <p><b>Progress:</b> {viewTask.progress ?? 0}%</p>
              <p>
                <b>Due Date:</b>{" "}
                {viewTask.dueDate
                  ? new Date(viewTask.dueDate).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <b>Assigned By:</b> {viewTask.assignedBy?.username || 'Unknown'} ({viewTask.assignedBy?.email || ''})
              </p>
              <p>
                <b>Assigned To:</b> {viewTask.assignedTo?.map(u => u.username).join(', ') || 'None'}
              </p>

              {/* Progress Bar */}
              <div>
                <b>Progress:</b>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 w-full mt-2 overflow-hidden">
                  <div
                    style={{ width: `${viewTask.progress ?? 0}%` }}
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  />
                </div>
                <div className="text-right text-xs text-gray-600 dark:text-gray-400 mt-1">{viewTask.progress ?? 0}%</div>
              </div>

              {/* Notes Section */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3 dark:text-gray-200">Notes</h3>
                {viewTask.notes?.length === 0 ? (
                  <p className="text-gray-400 dark:text-gray-500 mb-3">No notes yet.</p>
                ) : (
                  <ul className="max-h-40 overflow-y-auto space-y-3 mb-4">
                    {viewTask.notes?.map(note => (
                      <li
                        key={note._id}
                        className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded"
                      >
                        <span className="text-sm">
                          <span className="font-medium">{note.user?.username || 'User'}: </span>
                          {note.message}
                          <span className="text-xs text-gray-500 ml-2">
                            {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}
                          </span>
                        </span>
                        <button
                          onClick={() => handleDeleteNote(viewTask._id, note._id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Add a note..."
                    value={noteMsg}
                    onChange={e => setNoteMsg(e.target.value)}
                    disabled={addingNote}
                    className="border rounded-md px-3 py-1.5 flex-grow bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={addingNote}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium text-sm disabled:opacity-50"
                  >
                    {addingNote ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>

              {/* Activity Log (if available) */}
              {viewTask.activityLog && viewTask.activityLog.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3 dark:text-gray-200">Activity Log</h3>
                  <ul className="max-h-32 overflow-y-auto space-y-2">
                    {viewTask.activityLog.map((activity, index) => (
                      <li key={index} className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <span className="font-medium">{activity.action}</span> by {activity.user?.username || 'System'}
                        <span className="text-xs text-gray-500 ml-2">
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 pt-4 border-t">
                <p><b>Created:</b> {viewTask.createdAt ? new Date(viewTask.createdAt).toLocaleDateString() : '-'}</p>
                <p><b>Last Updated:</b> {viewTask.updatedAt ? new Date(viewTask.updatedAt).toLocaleDateString() : '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;