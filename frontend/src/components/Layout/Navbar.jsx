import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Menu, Bell, User, LogOut, X } from "lucide-react";

const Navbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          {/* Left - Menu + Title */}
          <div className="flex items-center min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-3 sm:ml-4 text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white truncate max-w-[180px] sm:max-w-xs md:max-w-md">
              Dept: {user.department || "Management"} , Role: {user.role}
            </h1>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Bell */}
            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* User Icon + Pop-Up */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <User className="h-7 w-7 sm:h-8 sm:w-8" />
              </button>

              {/* Profile Pop-Up */}
              {showProfile && (
                <>
                  {/* Blur Background */}
                  <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    onClick={() => setShowProfile(false)}
                  ></div>

                  {/* Mobile: Full Bottom Drawer */}
                  <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl p-6 max-h-[85vh] overflow-y-auto">
                      {/* Close Button */}
                      <button
                        onClick={() => setShowProfile(false)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
                          <User className="h-12 w-12 text-gray-700 dark:text-gray-300" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="text-center text-gray-900 dark:text-white">
                        <h3 className="text-lg font-semibold">{user.username}</h3>
                      </div>

                      <div className="mt-4 text-gray-700 dark:text-gray-200 text-sm space-y-2">
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Code:</strong> {user.employeeCode}</p>
                        <p><strong>Dept:</strong> {user.department}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Contact:</strong> {user.contact}</p>
                        <p><strong>Salary:</strong> ₹{user.Salary}</p>
                        <p><strong>Status:</strong> {user.status}</p>
                        <p><strong>Joined:</strong> {new Date(user.dateOfJoining).toLocaleDateString()}</p>
                      </div>

                      {/* Logout */}
                      <button
                        onClick={logout}
                        className="mt-5 w-full py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-900 font-medium shadow-md"
                      >
                        Logout
                      </button>
                    </div>
                  </div>

                  {/* Desktop: Dropdown Card */}
                  <div className="hidden sm:block absolute right-0 mt-2 z-50">
                    <div className="relative bg-white dark:bg-gray-900 border border-white/20 rounded-2xl shadow-xl p-6 w-[300px]">
                      {/* Close Button */}
                      <button
                        onClick={() => setShowProfile(false)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
                          <User className="h-12 w-12 text-gray-700 dark:text-gray-300" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="text-center text-gray-900 dark:text-white">
                        <h3 className="text-lg font-semibold">{user.username}</h3>
                      </div>

                      <div className="mt-4 text-gray-700 dark:text-gray-200 text-sm space-y-2">
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Code:</strong> {user.employeeCode}</p>
                        <p><strong>Dept:</strong> {user.department}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Contact:</strong> {user.contact}</p>
                        <p><strong>Salary:</strong> ₹{user.Salary}</p>
                        <p><strong>Status:</strong> {user.status}</p>
                        <p><strong>Joined:</strong> {new Date(user.dateOfJoining).toLocaleDateString()}</p>
                      </div>

                      {/* Logout */}
                      <button
                        onClick={logout}
                        className="mt-5 w-full py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-900 font-medium shadow-md"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Desktop Logout */}
            
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
