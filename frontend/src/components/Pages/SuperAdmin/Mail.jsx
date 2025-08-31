import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { FourSquare } from "react-loading-indicators";
import {
  Users, Mail, CheckCircle, XCircle, BarChart3, UserPlus, Search
} from "lucide-react";
import { toast } from "react-toastify";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4"];

const MailStats = () => {
  const base_Url = import.meta.env.VITE_BASE_URL;
  const { token } = useAuth();

  const [emailStats, setEmailStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  // Fetch Email Stats
  const fetchEmailStats = async () => {
    try {
      const res = await axios.get(`${base_Url}/api/superadmin/email-tracking-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setEmailStats(res.data.data);
      } else {
        throw new Error(res.data.message || "Failed to fetch email stats");
      }
    } catch (err) {
      console.error("Fetch email stats error:", err);
      toast.error("Failed to fetch email statistics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailStats();
  }, [base_Url, token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <FourSquare
          color="#3B82F6"
          size="medium"
          text="Loading Email Data..."
          textColor="#6B7280"
        />
      </div>
    );
  }

  if (!emailStats) return null;

  // Apply filters
  let filteredDepartments = emailStats.departmentStats || [];
  if (deptFilter !== "all") {
    filteredDepartments = filteredDepartments.filter(d => d._id === deptFilter);
  }
  if (search) {
    filteredDepartments = filteredDepartments.filter(d =>
      d._id?.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div className="space-y-10 p-6">
      {/* 🔑 Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(emailStats.summary).map(([key, value], i) => (
          <div key={i} className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 Email Breakdown - Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Email Breakdown</h3>
        <PieChart width={500} height={300}>
          <Pie
            data={Object.entries(emailStats.emailBreakdown).map(([name, value]) => ({ name, value }))}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {Object.entries(emailStats.emailBreakdown).map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* 📈 Open Rates */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Email Open Rates</h3>
        <div className="flex gap-6">
          {Object.entries(emailStats.openRates).map(([key, value]) => (
            <div key={key} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex-1 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 📌 Department-wise Stats */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Department-wise Statistics</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:text-white"
            />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Departments</option>
              {emailStats.departmentStats.map((d, i) => (
                <option key={i} value={d._id}>{d._id}</option>
              ))}
            </select>
          </div>
        </div>

        <BarChart width={700} height={300} data={filteredDepartments}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="applications" fill="#3B82F6" />
          <Bar dataKey="emailsSent" fill="#10B981" />
          <Bar dataKey="hired" fill="#F59E0B" />
          <Bar dataKey="employeesCreated" fill="#8B5CF6" />
        </BarChart>

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                {["Department", "Applications", "Emails Sent", "Hired", "Employees Created"].map((head) => (
                  <th key={head} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDepartments.map((dept, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">{dept._id}</td>
                  <td className="px-4 py-2 text-sm">{dept.applications}</td>
                  <td className="px-4 py-2 text-sm">{dept.emailsSent}</td>
                  <td className="px-4 py-2 text-sm">{dept.hired}</td>
                  <td className="px-4 py-2 text-sm">{dept.employeesCreated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🕒 Recent Email Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Email Activity</h3>
        <ul className="space-y-3">
          {emailStats.recentActivity.map((activity, i) => (
            <li key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.fullName} ({activity.email})
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Emails Sent: {activity.totalEmailsSent}</p>
              </div>
              <span className="text-xs text-gray-400">{new Date(activity.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MailStats;
