import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { FourSquare } from "react-loading-indicators";
import { Pencil, Trash2, Eye, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

const AllUsers = () => {
  const base_Url = import.meta.env.VITE_BASE_URL;
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
const [selectedUserId, setSelectedUserId] = useState(null);


  const initialUser = {
    employeeCode: "",
    username: "",
    password: "",
    role: "employee",
    department: "",
    email: "",
    contact: "",
    Salary: "",
    accountType: false,
    status: "active",
    dateOfJoining: "",
    createdBy: "superadminUser",
    profileImage: "",
  };

  const [newUser, setNewUser] = useState(initialUser);

  const roles = ["ceo", "superadmin", "admin", "manager", "employee", "intern"];
  const departments = ["hr", "iot", "software", "financial", "business", "goble"];
  const statuses = ["active", "inactive", "suspended"];

  const deptCodes = {
    hr: "HR",
    iot: "IO",
    software: "SW",
    financial: "FN",
    business: "BN",
    goble: "GB",
    ceo: "CE",
    superadmin: "SA",
    admin: "AM",
  };
  const roleCodes = { manager: "M", employee: "E", intern: "I" };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${base_Url}/api/SuperAdmin/alluser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [base_Url, token]);

  useEffect(() => {
    if (!newUser.role) return;
    const year = new Date().getFullYear().toString().slice(-2);
    let depCode = "";
    let roleCode = "";

    if (["ceo", "superadmin", "admin"].includes(newUser.role)) {
      depCode = deptCodes[newUser.role.toLowerCase()] || "";
    } else {
      depCode = deptCodes[newUser.department?.toLowerCase()] || "";
      roleCode = roleCodes[newUser.role.toLowerCase()] || "";
    }

    let sameCategoryUsers = users.filter((u) => {
      if (["ceo", "superadmin", "admin"].includes(newUser.role)) {
        return u.role?.toLowerCase() === newUser.role.toLowerCase();
      }
      return (
        u.role?.toLowerCase() === newUser.role.toLowerCase() &&
        u.department?.toLowerCase() === newUser.department?.toLowerCase()
      );
    });

    let sequence = (sameCategoryUsers.length + 1).toString().padStart(3, "0");

    if (depCode) {
      const empCode = `EMP${year}${depCode}${roleCode}${sequence}`;
      setNewUser((prev) => ({ ...prev, employeeCode: empCode.toUpperCase() }));
    }
  }, [newUser.role, newUser.department, users]);

  const handleAddOrEditUser = async (e) => {
    e.preventDefault();
    const empCodeRegex = /^EMP\d{2}[A-Z]{2,3}\d{3}$/;
    if (!isEditMode && !empCodeRegex.test(newUser.employeeCode)) {
      toast.error("Invalid Employee Code format. Example: EMP25HRM001");
      return;
    }

    try {
      if (isEditMode) {
        const oldUser = users.find((u) => u._id === editUserId);
        let updatedFields = {};
        Object.keys(newUser).forEach((key) => {
          if (newUser[key] !== oldUser[key]) {
            updatedFields[key] = newUser[key];
          }
        });

        await axios.put(`${base_Url}/api/SuperAdmin/updateuser/${editUserId}`, updatedFields, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("User updated successfully!");
      } else {
        await axios.post(`${base_Url}/api/SuperAdmin/createuser`, newUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("User created successfully!");
      }

      setShowForm(false);
      setNewUser(initialUser);
      setIsEditMode(false);
      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save user!");
    }
  };

  const handleEdit = (user) => {
    setNewUser({ ...user, password: "" });
    setIsEditMode(true);
    setEditUserId(user._id);
    setShowForm(true);
  };

  const handleDeleteClick = (userId) => {
  setSelectedUserId(userId);
  setShowConfirm(true); // Show popup instead of default confirm()
};


 const confirmDelete = async () => {
  try {
    await axios.delete(`${base_Url}/api/SuperAdmin/deleteuser/${selectedUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("User deleted successfully!");
    fetchUsers();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to delete user!");
  } finally {
    setShowConfirm(false);
    setSelectedUserId(null);
  }
};


  const handleView = (user) => {
    setViewUser(user);
    setShowViewModal(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(filter.toLowerCase()) ||
      user.email?.toLowerCase().includes(filter.toLowerCase()) ||
      user.employeeCode?.toLowerCase().includes(filter.toLowerCase()) ||
      user.department?.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <FourSquare color="#acadac" size="medium" text="Loading..." textColor="#e76d6d" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          All Users ({users.length})
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by username, email, code or department"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 w-full sm:w-80 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditMode(false);
              setNewUser(initialUser);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <Plus className="w-5 h-5" /> Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-gray-800 text-xs sm:text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="p-2">Profile</th>
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Code</th>
              <th className="p-2">Dept</th>
              <th className="p-2">Role</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Account</th>
              <th className="p-2">Status</th>
              
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-2"><img src={user.profileImage} className="h-8 w-8 rounded-full"/></td>
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.employeeCode}</td>
                  <td className="p-2">{user.department || "-"}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">₹{user.Salary}</td>
                  <td className="p-2">{user.contact}</td>
                  <td className="p-2">{user.accountType ? "Paid" : "Free"}</td>
                  <td
                    className={`p-2 ${
                      user.status === "active" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {user.status}
                  </td>
                  
                  <td className="p-2 text-center space-x-1">
                    <button
                      onClick={() => handleView(user)}
                      className="bg-blue-500 text-white p-1 rounded"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-green-500 text-white p-1 rounded"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user._id)}

                      className="bg-red-500 text-white p-1 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-6">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex justify-center items-center p-4 z-50">
          <div className="relative bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-screen">
            <button
              onClick={() => {
                setShowForm(false);
                setIsEditMode(false);
                setNewUser(initialUser);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-300"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              {isEditMode ? "Edit User" : "Add New User"}
            </h2>

            <form onSubmit={handleAddOrEditUser} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Username */}
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                required
                className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
              />

              {/* Password */}
              {!isEditMode && (
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
                />
              )}

              {/* Role */}
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value, department: "" })}
                required
                className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white sm:col-span-2"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              {/* Department */}
              {!["ceo", "superadmin", "admin"].includes(newUser.role) && (
                <select
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  required
                  className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white sm:col-span-2"
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              )}

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
                className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white sm:col-span-2"
              />

              {/* Contact */}
              <input
                type="text"
                placeholder="Contact (+91...)"
                value={newUser.contact}
                onChange={(e) => setNewUser({ ...newUser, contact: e.target.value })}
                required
                className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
              />

              {/* Salary */}
              <input
                type="number"
                inputMode="numeric"
                placeholder="Salary"
                min="0"
                step="1"
                value={newUser.Salary}
                onChange={(e) => setNewUser({ ...newUser, Salary: e.target.value })}
                required
                className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
              />

              {/* Account Type */}
              <select
                value={newUser.accountType}
                onChange={(e) =>
                  setNewUser({ ...newUser, accountType: e.target.value === "true" })
                }
                required
                className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Account Type</option>
                <option value="true">Paid</option>
                <option value="false">Free</option>
              </select>

              {/* Status */}
              <select
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                required
                className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              {/* Date of Joining */}
              <input
                type="date"
                value={newUser.dateOfJoining}
                onChange={(e) => setNewUser({ ...newUser, dateOfJoining: e.target.value })}
                required
                className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white sm:col-span-2"
              />

              {/* Profile Image */}
              <input
                type="text"
                placeholder="Profile Image URL"
                value={newUser.profileImage}
                onChange={(e) => setNewUser({ ...newUser, profileImage: e.target.value })}
                required
                className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white sm:col-span-2"
              />

              {/* Employee Code */}
              {!isEditMode && (
                <input
                  type="text"
                  placeholder="Employee Code"
                  value={newUser.employeeCode}
                  readOnly
                  required
                  className="border rounded px-3 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white font-bold sm:col-span-2"
                />
              )}

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded sm:col-span-2"
              >
                {isEditMode ? "Update User" : "Create User"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
{showViewModal && viewUser && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex justify-center items-center z-50 p-4">
    <div className="relative bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 w-full max-w-md">
      
      {/* Close Button */}
      <button
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-300"
        onClick={() => setShowViewModal(false)}
      >
        <X size={20} />
      </button>

      {/* Title */}
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        User Details
      </h2>

      {/* Profile Image */}
      <div className="flex justify-center mb-4">
        <img
          src={viewUser.profileImage}
          alt={viewUser.username}
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>

      {/* Details List */}
      <div className="space-y-2 text-gray-800 dark:text-gray-200">
        <p><b>Username:</b> {viewUser.username}</p>
        <p><b>Email:</b> {viewUser.email}</p>
        <p><b>Employee Code:</b> {viewUser.employeeCode}</p>
        <p><b>Department:</b> {viewUser.department || "-"}</p>
        <p><b>Role:</b> {viewUser.role}</p>
        <p>
          <b>Status:</b>{" "}
          <span className={viewUser.status === "active" ? "text-green-400" : "text-red-400"}>
            {viewUser.status}
          </span>
        </p>
        <p><b>Contact:</b> {viewUser.contact}</p>
        <p><b>Salary:</b> ₹{viewUser.Salary}</p>
        <p><b>Joining Date:</b> {new Date(viewUser.dateOfJoining).toLocaleDateString()}</p>
      </div>
    </div>
  </div>
)}


{showConfirm && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex justify-center items-center p-4 z-50">
    <div className="relative bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
      
      {/* Title */}
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
        Confirm Deletion
      </h2>

      {/* Message */}
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Are you sure you want to delete this user?
      </p>

      {/* Buttons */}
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

export default AllUsers;
