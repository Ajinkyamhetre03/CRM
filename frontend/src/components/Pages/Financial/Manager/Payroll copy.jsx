import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../../Api";
import { toast } from "react-toastify";
import { 
  Users, 
  DollarSign, 
  Calendar,
  Filter,
  Download,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from "lucide-react";

const Payroll = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [summary, setSummary] = useState({});
  
  // Filters and Pagination
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  });

  // Modals
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Payroll form data
  const [payrollForm, setPayrollForm] = useState({
    earnings: [
      { type: 'Basic Salary', amount: 0, ytdAmount: 0 },
      { type: 'HRA', amount: 0, ytdAmount: 0 },
      { type: 'Transport Allowance', amount: 1600, ytdAmount: 0 }
    ],
    deductions: [
      { type: 'EPF Employee', amount: 0, ytdAmount: 0 },
      { type: 'Professional Tax', amount: 200, ytdAmount: 0 },
      { type: 'TDS', amount: 0, ytdAmount: 0 }
    ],
    remarks: ''
  });

  // Tab configuration
  const tabs = [
    { id: "employees", label: "Employees", icon: Users },
    { id: "payroll", label: "Payroll Management", icon: DollarSign },
    { id: "reports", label: "Reports & Analytics", icon: TrendingUp }
  ];

  // Department options
  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'hr', label: 'HR' },
    { value: 'iot', label: 'IoT' },
    { value: 'software', label: 'Software' },
    { value: 'financial', label: 'Financial' },
    { value: 'business', label: 'Business' }
  ];

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'unpaid', label: 'Unpaid' }
  ];

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2025, i).toLocaleDateString('en-US', { month: 'long' })
  }));

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  // Fetch employees with real API
  const fetchEmployees = async (page = 1) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status: filters.status,
        department: filters.department,
        month: filters.month.toString(),
        year: filters.year.toString(),
        search: filters.search,
        page: page.toString(),
        limit: pagination.limit.toString()
      });

      const response = await apiRequest("GET", `/financial/users?${queryParams}`);
      
      if (response?.success) {
        setEmployees(response.data || []);
        setPagination(response.pagination || {});
        setSummary(response.summary || {});
      } else {
        setEmployees([]);
        toast.error(response?.message || "Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
      toast.error("Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch employee details with real API
  const fetchEmployeeDetails = async (userId) => {
    try {
      const response = await apiRequest("GET", `/financial/users/${userId}?month=${filters.month}&year=${filters.year}`);
      
      if (response?.success) {
        setSelectedEmployee(response.data);
        setShowEmployeeModal(true);
      } else {
        toast.error(response?.message || "Failed to fetch employee details");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Failed to fetch employee details");
    }
  };

  // Generate payroll with real API
  const generatePayroll = async (userId, override = false) => {
    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", `/financial/users/${userId}`, {
        month: filters.month,
        year: filters.year,
        earnings: payrollForm.earnings,
        deductions: payrollForm.deductions,
        remarks: payrollForm.remarks,
        override
      });

      if (response?.success) {
        toast.success(response.message);
        fetchEmployees(pagination.currentPage);
        setShowPayrollModal(false);
        resetPayrollForm();
        if (selectedEmployee) {
          fetchEmployeeDetails(userId);
        }
      } else {
        toast.error(response?.message || "Failed to generate payroll");
      }
    } catch (error) {
      console.error("Error generating payroll:", error);
      toast.error(error.response?.data?.message || "Failed to generate payroll");
    } finally {
      setIsGenerating(false);
    }
  };

  // Update payroll with real API
  const updatePayroll = async (userId, payrollId) => {
    try {
      const response = await apiRequest("PUT", `/financial/users/${userId}`, {
        payrollId,
        earnings: payrollForm.earnings,
        deductions: payrollForm.deductions,
        remarks: payrollForm.remarks
      });

      if (response?.success) {
        toast.success("Payroll updated successfully");
        fetchEmployees(pagination.currentPage);
        setIsEditing(false);
        fetchEmployeeDetails(userId);
      } else {
        toast.error(response?.message || "Failed to update payroll");
      }
    } catch (error) {
      console.error("Error updating payroll:", error);
      toast.error("Failed to update payroll");
    }
  };

  // Delete payroll with real API
  const deletePayroll = async (payrollId) => {
    if (!confirm("Are you sure you want to delete this payroll?")) return;

    try {
      const response = await apiRequest("DELETE", `/financial/payroll/${payrollId}`);

      if (response?.success) {
        toast.success("Payroll deleted successfully");
        fetchEmployees(pagination.currentPage);
        setShowEmployeeModal(false);
      } else {
        toast.error(response?.message || "Failed to delete payroll");
      }
    } catch (error) {
      console.error("Error deleting payroll:", error);
      toast.error("Failed to delete payroll");
    }
  };

  // Fetch statistics with real API
  const fetchStatistics = async () => {
    try {
      const response = await apiRequest("GET", `/financial/statistics?year=${filters.year}`);
      
      if (response?.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchStatistics();
  }, [filters.status, filters.department, filters.month, filters.year]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== '') {
        fetchEmployees(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key !== 'search') {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchEmployees(page);
  };

  // Reset payroll form
  const resetPayrollForm = () => {
    setPayrollForm({
      earnings: [
        { type: 'Basic Salary', amount: 0, ytdAmount: 0 },
        { type: 'HRA', amount: 0, ytdAmount: 0 },
        { type: 'Transport Allowance', amount: 1600, ytdAmount: 0 }
      ],
      deductions: [
        { type: 'EPF Employee', amount: 0, ytdAmount: 0 },
        { type: 'Professional Tax', amount: 200, ytdAmount: 0 },
        { type: 'TDS', amount: 0, ytdAmount: 0 }
      ],
      remarks: ''
    });
  };

  // Open payroll modal
  const openPayrollModal = (employee) => {
    setSelectedEmployee(employee);
    resetPayrollForm();
    
    // Pre-calculate default values
    const basicSalary = employee.calculatedSalary || employee.Salary;
    const updatedEarnings = payrollForm.earnings.map(earning => {
      if (earning.type === 'Basic Salary') {
        return { ...earning, amount: basicSalary, ytdAmount: basicSalary * filters.month };
      }
      if (earning.type === 'HRA') {
        const hra = basicSalary * 0.4;
        return { ...earning, amount: hra, ytdAmount: hra * filters.month };
      }
      return earning;
    });

    const updatedDeductions = payrollForm.deductions.map(deduction => {
      if (deduction.type === 'EPF Employee') {
        const epf = basicSalary * 0.12;
        return { ...deduction, amount: epf, ytdAmount: epf * filters.month };
      }
      if (deduction.type === 'TDS') {
        const tds = basicSalary * 0.05;
        return { ...deduction, amount: tds, ytdAmount: tds * filters.month };
      }
      if (deduction.type === 'Professional Tax') {
        return { ...deduction, ytdAmount: 200 * filters.month };
      }
      return deduction;
    });

    setPayrollForm({
      ...payrollForm,
      earnings: updatedEarnings,
      deductions: updatedDeductions
    });
    setShowPayrollModal(true);
  };

  // Update earning/deduction amount
  const updateEarningAmount = (index, amount) => {
    const updatedEarnings = [...payrollForm.earnings];
    updatedEarnings[index].amount = parseFloat(amount) || 0;
    setPayrollForm({ ...payrollForm, earnings: updatedEarnings });
  };

  const updateDeductionAmount = (index, amount) => {
    const updatedDeductions = [...payrollForm.deductions];
    updatedDeductions[index].amount = parseFloat(amount) || 0;
    setPayrollForm({ ...payrollForm, deductions: updatedDeductions });
  };

  // Calculate totals
  const calculateTotals = () => {
    const totalEarnings = payrollForm.earnings.reduce((sum, earning) => sum + (earning.amount || 0), 0);
    const totalDeductions = payrollForm.deductions.reduce((sum, deduction) => sum + (deduction.amount || 0), 0);
    const netPay = totalEarnings - totalDeductions;
    
    return { totalEarnings, totalDeductions, netPay };
  };

  const renderEmployeesTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalUsers || 0}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Employees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.paidUsers || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unpaid Employees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.unpaidUsers || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{(summary.totalPayrollAmount || 0).toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Employees</h3>
          <button
            onClick={() => fetchEmployees(pagination.currentPage)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {departments.map(dept => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Month
            </label>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {monthOptions.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {yearOptions.map(year => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="text-gray-500">Loading employees...</span>
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">No employees found</p>
                      <p className="text-sm">Try adjusting your filters or search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={employee.profileImage}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>
                        <div>Present: {employee.presentDays}/{employee.totalDaysInMonth}</div>
                        <div className="text-xs text-gray-500">LOP: {employee.lopDays} days</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>
                        <div>Base: ₹{employee.Salary?.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Calculated: ₹{Math.round(employee.calculatedSalary || 0).toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.payrollStatus === 'paid' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {employee.payrollStatus === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                      {employee.payDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(employee.payDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => fetchEmployeeDetails(employee._id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {employee.payrollStatus === 'unpaid' && (
                        <button
                          onClick={() => openPayrollModal(employee)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Generate Payroll"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
                  <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage <= 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage >= pagination.totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Showing{" "}
                            <span className="font-medium">
                              {(pagination.currentPage - 1) * pagination.limit + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                              {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">{pagination.totalUsers}</span> results
                          </p>
                        </div>
                        <div>
                          <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                          >
                            <button
                              onClick={() => handlePageChange(pagination.currentPage - 1)}
                              disabled={pagination.currentPage <= 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                              const page = i + Math.max(1, pagination.currentPage - 2);
                              if (page > pagination.totalPages) return null;
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    page === pagination.currentPage
                                      ? "z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200"
                                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            })}
                            <button
                              onClick={() => handlePageChange(pagination.currentPage + 1)}
                              disabled={pagination.currentPage >= pagination.totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

          const renderPayrollTab = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              // Generate payroll for all unpaid employees
              const unpaidEmployees = employees.filter(emp => emp.payrollStatus === 'unpaid');
              if (unpaidEmployees.length === 0) {
                toast.info("No unpaid employees found");
                return;
              }
              if (confirm(`Generate payroll for ${unpaidEmployees.length} employees?`)) {
                unpaidEmployees.forEach(emp => generatePayroll(emp._id));
              }
            }}
            className="p-4 text-left border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
          >
            <DollarSign className="w-8 h-8 text-blue-500 mb-2" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Generate All Payrolls</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Generate payroll for all unpaid employees</p>
          </button>

          <button
            onClick={() => {
              // Export payroll report
              toast.info("Export functionality coming soon");
            }}
            className="p-4 text-left border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
          >
            <Download className="w-8 h-8 text-green-500 mb-2" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Export Payroll</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Export payroll data to Excel/PDF</p>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className="p-4 text-left border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
          >
            <FileText className="w-8 h-8 text-purple-500 mb-2" />
            <h4 className="font-semibold text-gray-900 dark:text-white">View Reports</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Detailed payroll analytics and reports</p>
          </button>
        </div>
      </div>

      {/* Recent Payrolls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payroll Activity</h3>
        </div>
        <div className="p-6">
          {employees.filter(emp => emp.payrollStatus === 'paid').length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No payroll records found for this period</p>
            </div>
          ) : (
            <div className="space-y-4">
              {employees
                .filter(emp => emp.payrollStatus === 'paid')
                .slice(0, 5)
                .map(employee => (
                  <div key={employee._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={employee.profileImage}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{employee.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{employee.employeeCode}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">₹{employee.netPay?.toLocaleString()}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {employee.payDate ? new Date(employee.payDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <button
                      onClick={() => fetchEmployeeDetails(employee._id)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Payroll ({filters.year})</p>
              <p className="text-2xl font-bold">₹{(statistics?.overall?.totalPayroll || 0).toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Average Salary</p>
              <p className="text-2xl font-bold">₹{Math.round(statistics?.overall?.averageSalary || 0).toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Highest Salary</p>
              <p className="text-2xl font-bold">₹{(statistics?.overall?.highestSalary || 0).toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Employees Paid</p>
              <p className="text-2xl font-bold">{statistics?.overall?.totalEmployees || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Department-wise Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Department-wise Payroll</h3>
        </div>
        <div className="p-6">
          {statistics?.department?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total Payroll</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Average Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {statistics.department.map((dept) => (
                    <tr key={dept._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                          {dept._id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {dept.employeeCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ₹{dept.totalPayroll.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ₹{Math.round(dept.averageSalary).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No department data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend (Simple representation) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Payroll Trend ({filters.year})</h3>
        </div>
        <div className="p-6">
          {statistics?.monthly?.length > 0 ? (
            <div className="space-y-4">
              {statistics.monthly.map((month) => {
                const monthName = new Date(2025, month._id - 1).toLocaleDateString('en-US', { month: 'long' });
                const maxAmount = Math.max(...statistics.monthly.map(m => m.totalPayroll));
                const widthPercent = (month.totalPayroll / maxAmount) * 100;
                
                return (
                  <div key={month._id} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-900 dark:text-white">{monthName}</div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                    </div>
                    <div className="w-32 text-sm text-gray-900 dark:text-white text-right">
                      ₹{month.totalPayroll.toLocaleString()}
                    </div>
                    <div className="w-24 text-sm text-gray-500 dark:text-gray-400 text-right">
                      {month.employeeCount} emp
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No monthly data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Employee Details Modal
  const EmployeeModal = () => {
    if (!showEmployeeModal || !selectedEmployee) return null;

    const { user, currentPayroll, payrollHistory, attendanceRecords } = selectedEmployee;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={user.profileImage} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.username}</h2>
                <p className="text-gray-500 dark:text-gray-400">{user.employeeCode} • {user.department}</p>
              </div>
            </div>
            <button
              onClick={() => setShowEmployeeModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Employee Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="text-gray-900 dark:text-white">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Base Salary:</span>
                    <span className="text-gray-900 dark:text-white">₹{user.Salary?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Joining Date:</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(user.dateOfJoining).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Present Days:</span>
                    <span className="text-gray-900 dark:text-white">{user.attendance?.presentDays || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">LOP Days:</span>
                    <span className="text-gray-900 dark:text-white">{user.attendance?.lopDays || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Attendance:</span>
                    <span className="text-gray-900 dark:text-white">{user.attendance?.attendancePercentage || 0}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Payroll */}
            {currentPayroll ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Payroll</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPayroll(currentPayroll);
                        setPayrollForm({
                          earnings: currentPayroll.earnings || [],
                          deductions: currentPayroll.deductions || [],
                          remarks: currentPayroll.remarks || ''
                        });
                        setIsEditing(true);
                        setShowPayrollModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      title="Edit Payroll"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deletePayroll(currentPayroll._id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                      title="Delete Payroll"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₹{currentPayroll.grossEarnings?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Gross Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      ₹{currentPayroll.totalDeductions?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Deductions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{currentPayroll.netPay?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Net Pay</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-yellow-800 dark:text-yellow-200">No payroll generated for this month</span>
                  </div>
                  <button
                    onClick={() => openPayrollModal(user)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Generate Payroll
                  </button>
                </div>
              </div>
            )}

            {/* Payroll History */}
            {payrollHistory && payrollHistory.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payroll History</h3>
                <div className="space-y-2">
                  {payrollHistory.map((payroll) => (
                    <div key={payroll._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{payroll.payPeriod}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Paid on {new Date(payroll.payDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">₹{payroll.netPay?.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Payroll Generation/Edit Modal
  const PayrollModal = () => {
    if (!showPayrollModal) return null;

    const { totalEarnings, totalDeductions, netPay } = calculateTotals();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Payroll' : 'Generate Payroll'} - {selectedEmployee?.username}
            </h2>
            <button
              onClick={() => {
                setShowPayrollModal(false);
                setIsEditing(false);
                setSelectedPayroll(null);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹{totalEarnings.toLocaleString()}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">Total Earnings</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ₹{totalDeductions.toLocaleString()}
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">Total Deductions</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{netPay.toLocaleString()}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Net Pay</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earnings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Earnings</h3>
                <div className="space-y-4">
                  {payrollForm.earnings.map((earning, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{earning.type}</div>
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          value={earning.amount}
                          onChange={(e) => updateEarningAmount(index, e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-right"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deductions</h3>
                <div className="space-y-4">
                  {payrollForm.deductions.map((deduction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{deduction.type}</div>
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          value={deduction.amount}
                          onChange={(e) => updateDeductionAmount(index, e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-right"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Remarks
              </label>
              <textarea
                value={payrollForm.remarks}
                onChange={(e) => setPayrollForm({ ...payrollForm, remarks: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Optional remarks..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowPayrollModal(false);
                  setIsEditing(false);
                  setSelectedPayroll(null);
                }}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isEditing) {
                    updatePayroll(selectedEmployee._id, selectedPayroll._id);
                  } else {
                    generatePayroll(selectedEmployee._id);
                  }
                }}
                disabled={isGenerating}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isEditing ? 'Update' : 'Generate'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payroll Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage employee payrolls, generate reports, and track payment history
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "employees" && renderEmployeesTab()}
        {activeTab === "payroll" && renderPayrollTab()}
        {activeTab === "reports" && renderReportsTab()}

        {/* Modals */}
        <EmployeeModal />
        <PayrollModal />
      </div>
    </div>
  );
}

export default Payroll;