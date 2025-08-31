import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { getNavigationConfig } from '../../../src/components/config/navigation';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const userNavigation = getNavigationConfig(user);

  const getDepartmentTitle = () => {
    if (!user?.department) return 'CRM';
    const departmentNames = {
      hr: 'HR Department',
      iot: 'IoT Department',
      software: 'Software Department',
      financial: 'Financial Department',
      business: 'Business Department'
    };
    return departmentNames[user.department] || 'CRM';
  };

  const getRoleDisplay = () => {
    if (!user?.role) return '';
    const roleNames = {
      superadmin: 'Super Admin',
      admin: 'Admin',
      manager: 'Manager',
      employee: 'Employee',
      intern: 'Intern',
      ceo: 'CEO'
    };
    return roleNames[user.role] || user.role;
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 
          ${collapsed ? 'w-20' : 'w-64'}
          bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0 
          flex flex-col`}
        style={{ height: '100vh' }}
      >
        {/* Collapse/Expand Button */}
        <div className="flex items-center justify-end p-2 mt-6 border-b border-gray-200 dark:border-gray-700">
          <button
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight className="h-6 w-6" /> : <ChevronsLeft className="h-6 w-6" />}
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Header */}
        {!collapsed && (
          <div className="flex flex-col p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {getDepartmentTitle()}
              </h2>
            </div>
            {/* Role and Department Display */}
            {user && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getRoleDisplay()}
                  {user.department && (
                    <span className="text-xs ml-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full">
                      {user.department.toUpperCase()}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Links - Scrollable */}
        <nav
          className="flex-1 overflow-y-auto px-2 py-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
          style={{
            maxHeight: 'calc(100vh - 160px)', // Adjust if header/footer height changes
          }}
        >
          {userNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200
                  ${isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={item.name}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Department Info Footer */}
        {/* {!collapsed && user?.department && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                {getDepartmentTitle()}
              </p>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default Sidebar;
