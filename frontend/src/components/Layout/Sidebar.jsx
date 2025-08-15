import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { getNavigationConfig } from '../../../src/components/config/navigation';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Get navigation config based on user role and department
  const userNavigation = getNavigationConfig(user);

  // Display department info for departmental roles
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
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex flex-col p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {getDepartmentTitle()}
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
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

        {/* Navigation Links */}
        <nav className="mt-4">
          <div className="px-4 space-y-2">
            {userNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Department Info Footer */}
        {user?.department && (
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
        )}
      </div>
    </>
  );
};

export default Sidebar;