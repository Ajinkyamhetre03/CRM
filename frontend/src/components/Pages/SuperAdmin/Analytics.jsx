import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, FileText, Lock, Eye, Activity, RefreshCw, Search, Filter, BarChart3, List } from 'lucide-react';
import { useAuth } from "../../../Context/AuthContext";
import axios from "axios";

const Analytics = () => {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('overview');
  const [sortBy, setSortBy] = useState('calls'); // 'calls', 'route'
  const base_url = import.meta.env.VITE_BASE_URL
  const { token } = useAuth()

  // Fetch stats from API

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // ✅ Use axios with Authorization header
      const response = await axios.get(`${base_url}/api/superadmin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`, // <-- Add your token here
        },
      });

      setStats(response.data); // ✅ axios automatically parses JSON
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchStats();
  }, []);

  // Process and categorize API routes
  const processedData = React.useMemo(() => {
    const entries = Object.entries(stats);

    // Categorize routes
    const categories = {
      auth: entries.filter(([route]) => route.toLowerCase().includes('/auth')),
      candidate: entries.filter(([route]) => route.toLowerCase().includes('/candidate')),
      hr: entries.filter(([route]) => route.toLowerCase().includes('/hr')),
      admin: entries.filter(([route]) => route.toLowerCase().includes('/admin') || route.toLowerCase().includes('/superadmin')),
      user: entries.filter(([route]) => route.toLowerCase().includes('/user')),
      job: entries.filter(([route]) => route.toLowerCase().includes('/job')),
      application: entries.filter(([route]) => route.toLowerCase().includes('/application')),
      stats: entries.filter(([route]) => route.toLowerCase().includes('/stats')),
      other: entries.filter(([route]) =>
        !route.toLowerCase().includes('/auth') &&
        !route.toLowerCase().includes('/candidate') &&
        !route.toLowerCase().includes('/hr') &&
        !route.toLowerCase().includes('/admin') &&
        !route.toLowerCase().includes('/superadmin') &&
        !route.toLowerCase().includes('/user') &&
        !route.toLowerCase().includes('/job') &&
        !route.toLowerCase().includes('/application') &&
        !route.toLowerCase().includes('/stats')
      )
    };

    // Category summary for pie chart
    const categorySummary = Object.entries(categories)
      .map(([category, routes]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: routes.reduce((sum, [, calls]) => sum + calls, 0),
        routes: routes.length
      }))
      .filter(item => item.value > 0);

    // Top routes for bar chart
    const topRoutes = entries
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([route, calls]) => ({
        route: route.length > 30 ? `...${route.slice(-30)}` : route,
        fullRoute: route,
        calls
      }));

    // Filter data based on search and category
    const filteredEntries = entries.filter(([route, calls]) => {
      const matchesSearch = route.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' ||
        categories[filterCategory]?.some(([r]) => r === route);
      return matchesSearch && matchesCategory;
    });

    return {
      categories,
      categorySummary,
      topRoutes,
      filteredEntries: filteredEntries.sort((a, b) =>
        sortBy === 'calls' ? b[1] - a[1] : a[0].localeCompare(b[0])
      ),
      totalCalls: entries.reduce((sum, [, calls]) => sum + calls, 0),
      totalRoutes: entries.length
    };
  }, [stats, searchTerm, filterCategory, sortBy]);

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              API Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your API endpoint usage and performance
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total API Calls</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {processedData.totalCalls.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Routes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {processedData.totalRoutes}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Categories</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {processedData.categorySummary.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg Calls/Route</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {processedData.totalRoutes > 0 ? Math.round(processedData.totalCalls / processedData.totalRoutes) : 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'overview', label: 'Overview', icon: Eye },
          { key: 'charts', label: 'Charts', icon: BarChart3 },
          { key: 'detailed', label: 'Detailed View', icon: List }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setViewMode(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === key
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Charts View */}
      {viewMode === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              API Calls by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={processedData.categorySummary}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {processedData.categorySummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Routes Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Top 20 Most Called Routes
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.topRoutes} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="route" width={150} fontSize={10} />
                <Tooltip
                  formatter={(value, name, props) => [value, 'API Calls']}
                  labelFormatter={(label) => props?.payload?.fullRoute || label}
                />
                <Bar dataKey="calls" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed View */}
      {(viewMode === 'detailed' || viewMode === 'overview') && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                API Route Details ({processedData.filteredEntries.length} routes)
              </h3>

              <div className="flex flex-col sm:flex-row gap-3 lg:ml-auto">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search routes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {processedData.categorySummary.map(category => (
                    <option key={category.name} value={category.name.toLowerCase()}>
                      {category.name} ({category.value} calls)
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="calls">Sort by Calls</option>
                  <option value="route">Sort by Route</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    API Calls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {processedData.filteredEntries.map(([route, calls], index) => {
                  const percentage = ((calls / processedData.totalCalls) * 100).toFixed(2);
                  const category = Object.entries(processedData.categories).find(([, routes]) =>
                    routes.some(([r]) => r === route)
                  )?.[0] || 'other';

                  return (
                    <tr key={route} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">
                        <span className="break-all">{route}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <span className="font-semibold">{calls}</span>
                          <div className="ml-3 w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min((calls / Math.max(...processedData.filteredEntries.map(([, c]) => c))) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${category === 'auth' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          category === 'candidate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            category === 'hr' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              category === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                          {category}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {processedData.filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No routes found matching your criteria
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;