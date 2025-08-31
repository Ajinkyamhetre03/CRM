import React, { useState, useEffect } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import { FourSquare } from 'react-loading-indicators';
import { useAuth } from '../../../Context/AuthContext';

const Login = () => {
  const base_Url = import.meta.env.VITE_BASE_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // <-- store DB users

  const { login } = useAuth();

  // Fetch seeded users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${base_Url}/api/users`);
        setUsers(res.data);
      } catch (err) {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, [base_Url]);

  const eventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${base_Url}/api/auth/login`, { email, password });

      if (!res.data?.token) {
        toast.error(res.data.message || "Login failed!");
        return;
      }
      login(res.data.user, res.data.token);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  // Quick login function
  const quickLogin = async (user) => {
    setLoading(true);

    try {
      const res = await axios.post(`${base_Url}/api/auth/login`, {
        email: user.email,
        password: "Password@123" // seeded default password
      });

      if (!res.data?.token) {
        toast.error(res.data.message || "Login failed!");
        return;
      }

      toast.success(`Logged in as ${user.role.toUpperCase()}!`);
      login(res.data.user, res.data.token);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <FourSquare color="#acadac" size="medium" text="Loading..." textColor="#acadac" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <form
          id="login-form"
          onSubmit={eventHandler}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
            Login
          </h2>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded 
                       transition-colors duration-200 mb-4"
          >
            Submit
          </button>

          {/* Quick Login Buttons */}
          {users.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
                Quick Login (From DB)
              </p>
              {users.map((user, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => quickLogin(user)}
                  className="w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-200 bg-gray-500 hover:bg-gray-700 text-white"
                >
                  Login as {user.role.toUpperCase()} {user.department ? `(${user.department})` : ""}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
