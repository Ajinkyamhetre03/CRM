import React, { useState, useEffect } from 'react'
import { apiRequest } from "../../../../Api"
import { toast } from 'react-toastify'
import { FourSquare } from "react-loading-indicators"
import { Plus, X, Pencil, Trash2, Eye, Clock, Activity, FileText, CheckCircle, Users } from 'lucide-react'

const ManagerTaskDashboard = () => {
  // STATES
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [filter, setFilter] = useState("")

  const [showForm, setShowForm] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editTaskId, setEditTaskId] = useState(null)

  const [showViewModal, setShowViewModal] = useState(false)
  const [viewTask, setViewTask] = useState(null)

  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  const [noteMsg, setNoteMsg] = useState('')

  const priorities = ["low", "medium", "high", "critical"]
  const statuses = ["pending", "inProgress", "completed"]

  const initialTask = {
    title: "",
    description: "",
    assignedTo: [],
    priority: "medium",
    dueDate: "",
  }

  const [newTask, setNewTask] = useState(initialTask)

  // Fetch all data
  const fetchAll = async () => {
    setIsLoading(true)
    try {
      const usersRes = await apiRequest("GET", "/manager/users")
      const tasksRes = await apiRequest("GET", "/manager/tasks")
      const statsRes = await apiRequest("GET", "/manager/tasks-stats")

      setUsers(usersRes?.data || [])
      setTasks(tasksRes?.data || [])
      setStats(statsRes?.data || null)
      setIsError(false)
    } catch (err) {
      console.log(err)
      setIsError(err.message || "Failed to fetch data")
      setTasks([])
      setUsers([])
      toast.error("Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  // Add / Edit task
  const handleAddOrEditTask = async (e) => {
    e.preventDefault()

    // Validation
    if (!newTask.title.trim()) {
      toast.error("Title is required")
      return
    }
    if (!newTask.description.trim()) {
      toast.error("Description is required")
      return
    }
    if (newTask.assignedTo.length === 0) {
      toast.error("Assign to at least one employee")
      return
    }
    if (newTask.dueDate && new Date(newTask.dueDate) < new Date()) {
      toast.error("Due date cannot be in the past")
      return
    }

    try {
      if (isEditMode) {
        await apiRequest("PUT", `/manager/tasks/${editTaskId}`, newTask)
        toast.success("Task updated successfully!")
      } else {
        await apiRequest("POST", "/manager/tasks", newTask)
        toast.success("Task created successfully!")
      }
      setShowForm(false)
      setNewTask(initialTask)
      setIsEditMode(false)
      setEditTaskId(null)
      fetchAll()
      setIsError(false)
    } catch (err) {
      console.log(err)
      setIsError(err.message)
      toast.error(err.response?.data?.message || "Failed to save task!")
    }
  }

  const handleEdit = (task) => {
    setNewTask({
      ...task,
      assignedTo: task.assignedTo.map(u => u._id),
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      progress: task.progress ?? 0,
      status: task.status || "pending",
    })
    setIsEditMode(true)
    setEditTaskId(task._id)
    setShowForm(true)
  }


  const handleDeleteClick = (taskId) => {
    setSelectedTaskId(taskId)
    setShowConfirm(true)
  }

  const confirmDelete = async () => {
    try {
      await apiRequest("DELETE", `/manager/tasks/${selectedTaskId}`)
      toast.success("Task deleted successfully!")
      fetchAll()
      setIsError(false)
    } catch (err) {
      console.log(err)
      setIsError(err.message)
      toast.error(err.response?.data?.message || "Failed to delete task!")
    } finally {
      setShowConfirm(false)
      setSelectedTaskId(null)
    }
  }

  const handleView = async (task) => {
    try {
      const details = await apiRequest("GET", `/manager/tasks/${task._id}`)
      setViewTask(details.data)
      setShowViewModal(true)
    } catch {
      toast.error("Couldn't fetch task details")
    }
  }

  const handleAssignToggle = (id) => {
    setNewTask((prev) => {
      if (prev.assignedTo.includes(id)) {
        return { ...prev, assignedTo: prev.assignedTo.filter(i => i !== id) }
      }
      return { ...prev, assignedTo: [...prev.assignedTo, id] }
    })
  }

  const handleAddNote = async () => {
    if (!noteMsg.trim()) {
      toast.error("Note cannot be empty")
      return
    }
    try {
      await apiRequest("POST", `/manager/tasks/${viewTask._id}/notes`, { message: noteMsg })
      toast.success("Note added")
      handleView(viewTask)
      setNoteMsg('')
    } catch {
      toast.error("Error adding note")
    }
  }

  const handleDeleteNote = async (taskId, noteId) => {
    try {
      await apiRequest("DELETE", `/manager/tasks/${taskId}/notes/${noteId}`)
      toast.success("Note deleted")
      handleView(viewTask)
    } catch {
      toast.error("Error deleting note")
    }
  }

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter(
      (task) =>
        task.title?.toLowerCase().includes(filter.toLowerCase()) ||
        task.priority?.toLowerCase().includes(filter.toLowerCase()) ||
        task.status?.toLowerCase().includes(filter.toLowerCase()) ||
        task.assignedTo?.some(user =>
          user.username?.toLowerCase().includes(filter.toLowerCase())
        )
    )
    : []

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
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] bg-gray-100 dark:bg-gray-900 overflow-hidden">
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

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 text-center">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
          {isError || "An unexpected error occurred. Please try again later."}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4">
      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        {stats && (
          <>
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
          </>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Tasks ({tasks.length})
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by title, priority, status, or assignee"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 w-full sm:w-80 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
          <button
            onClick={() => {
              setShowForm(true)
              setIsEditMode(false)
              setNewTask(initialTask)
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <Plus className="w-5 h-5" /> Add Task
          </button>
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
              <th className="p-2">Due Date</th>
              <th className="p-2">Progress</th>
              <th className="p-2">Assigned To</th>
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
                  <td className={`p-2 ${task.priority === "high" || task.priority === "critical"
                      ? "text-red-500"
                      : task.priority === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}>
                    {task.priority}
                  </td>
                  <td className={`p-2 ${task.status === "completed"
                      ? "text-green-500"
                      : task.status === "inProgress"
                        ? "text-orange-500"
                        : "text-yellow-500"
                    }`}>
                    {task.status}
                  </td>
                  <td className="p-2">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2">{task.progress ?? 0}%</td>
                  <td className="p-2">
                    {task.assignedTo?.map(u => u.username).join(', ') || '-'}
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
                    <button
                      onClick={() => handleDeleteClick(task._id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      <Trash2 size={14} />
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

      {/* Add/Edit Task Modal */}
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
              {isEditMode ? "Edit Task" : "Add New Task"}
            </h2>

            {/* Form */}
            <form onSubmit={handleAddOrEditTask} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">

              {/* Task Title */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  required
                  className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 h-20"
                />
              </div>

              {/* Progress */}
              <div>
                <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                  Progress (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newTask.progress ?? 0}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      progress: Math.min(100, Math.max(0, Number(e.target.value))),
                    })
                  }
                  min={0}
                  max={100}
                  required
                  className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTask.status || "pending"}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      status: e.target.value,
                    })
                  }
                  required
                  className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">pending</option>
                  <option value="in-progress">in-progress</option>
                  <option value="completed">completed</option>
                </select>
              </div>


              {/* Priority */}
              <div>
                <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  required
                  className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="border rounded-md px-3 py-1.5 w-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().slice(0, 10)}
                />
              </div>

              {/* Assign To */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">
                  Assign To <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
                  {users.length === 0 && <div className="text-gray-400 dark:text-gray-500 text-sm">No users available</div>}
                  {users.map(u => (
                    <label
                      key={u._id}
                      className={`cursor-pointer px-3 py-1 rounded-full border select-none text-xs ${newTask.assignedTo.includes(u._id)
                          ? "bg-blue-600 text-white border-blue-700"
                          : "bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-300"
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={newTask.assignedTo.includes(u._id)}
                        onChange={() => handleAssignToggle(u._id)}
                      />
                      {u.username}
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 flex justify-end mt-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-1.5 rounded-md text-sm transition"
                >
                  {isEditMode ? "Update Task" : "Create Task"}
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
                    className="border rounded-md px-3 py-1.5 flex-grow bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddNote}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* <div>
                <p><b>Created By:</b> {viewTask.createdBy?.username || 'Unknown'}</p>
              </div> */}
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
              Are you sure you want to delete this task?
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
  )
}

export default ManagerTaskDashboard