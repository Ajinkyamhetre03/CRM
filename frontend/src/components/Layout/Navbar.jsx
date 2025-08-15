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
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left - Menu */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-800 dark:text-white">
              Department: {user.department || "Management"} , Role: {user.role} 
            </h1>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Bell className="h-6 w-6" />
            </button>

            {/* User Icon + Pop-Up */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <User className="h-8 w-8" />
              </button>

              {/* Profile Pop-Up */}
              {showProfile && (
                <>
                  {/* Full Screen Blur Behind Pop-Up */}
                  <div
                    className="fixed inset-0 bg-white/0 backdrop-blur-xl z-40"
                    onClick={() => setShowProfile(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 z-50">
                    <div className="relative bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 w-[300px]">
                      {/* Close Button */}
                      <button
                        onClick={() => setShowProfile(false)}
                        className="absolute top-3 right-3 text-gray-300 hover:text-red-400"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
                          <User className="h-12 w-12 text-gray-700 dark:text-gray-300" />
                        </div>
                      </div>

                      {/* Name & Role */}
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-white">
                          {user.username}
                        </h3>
                      </div>

                      {/* Info List */}
                      <div className="mt-4 text-gray-200 text-sm space-y-1">
                        <p><strong>ROLE:</strong> {user.role}</p>
                        <p><strong>EMPLOYEE CODE:</strong> {user.employeeCode}</p>
                        <p><strong>Department:</strong> {user.department}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Contact:</strong> {user.contact}</p>
                        <p><strong>Salary:</strong> ₹{user.Salary}</p>
                        <p><strong>Status:</strong> {user.status}</p>
                        <p><strong>Joined:</strong> {new Date(user.dateOfJoining).toLocaleDateString()}</p>
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={logout}
                        className="mt-5 w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-md"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Logout Button (in navbar) */}
            <button
              onClick={logout}
              className="text-gray-600 dark:text-gray-300 bg-gray-700 hover:bg-gray-900 p-1 px-3 rounded-md hover:text-red-600 dark:hover:text-red-400 flex items-center"
              title="Logout"
            >
               <LogOut className="h-5 w-5 ml-1" /> Logout
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
