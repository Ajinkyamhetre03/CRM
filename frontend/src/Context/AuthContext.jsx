import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  setIsLoading: () => {},
  setUser: () => {},
  setToken: () => {},
  login: () => {},
  logout: () => {},
  hasRole: () => {},
  hasPermission: () => {},
  hasDepartment: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const base_Url = import.meta.env.VITE_BASE_URL;

  // Check if user is authenticated on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
       
        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

const login = async (userData, tokenValue) => {
  setUser(userData);
  setToken(tokenValue);
  setIsAuthenticated(true);

  // Store in localStorage for persistence
  localStorage.setItem('auth_token', tokenValue);
  localStorage.setItem('auth_user', JSON.stringify(userData));

  try {
    // Call check-in API
    const checkinRes = await axios.post(
      `${base_Url}/api/attendance/checkin`,
      {}, // no body
      {
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
      }
    );

    
  } catch (err) {
    //toast.error(err.response?.data?.message || "You are all ready Check-in or Check-in failed! ");
  }

  // Navigate after check-in
  navigate("/app/dashboard");

  setTimeout(function() {
   localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
}, 1000* 60*60* 9);
};


  // Handle checkout API call
  const handleCheckout = async (userToken) => {
    try {
      const checkoutRes = await axios.post(
        `${base_Url}/api/attendance/checkout`,
        {}, // no body
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );
      console.log('Checkout response:', checkoutRes.data);
     
      return true;
    } catch (err) {
      console.error('Checkout error:', err);
      // Don't block logout if checkout fails, just show warning
      // toast.warn(err.response?.data?.message || 'Checkout failed, but logout will continue');
      return false;
    }
  };

  const logout = async () => {
    const currentToken = token;
    
    // Call checkout API before clearing the token
    if (currentToken && isAuthenticated) {
      await handleCheckout(currentToken);
    }
    
    // Clear state and localStorage
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
   
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    toast.success('Logout Success!');
   
    navigate("/login");
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has permission (role hierarchy)
  const hasPermission = (requiredRole) => {
    if (!user?.role) return false;
   
    const roleHierarchy = {
      'intern': 1,
      'employee': 2,
      'manager': 3,
      'admin': 4,
      'ceo': 5,
      'superadmin': 6
    };
   
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
   
    return userLevel >= requiredLevel;
  };

  // Check if user has access to a specific department
  const hasDepartment = (department) => {
    if (!user) return false;
    
    // SuperAdmin, Admin, and CEO have access to all departments
    if (['superadmin', 'admin', 'ceo'].includes(user.role)) {
      return true;
    }
    
    // Other roles must match the department
    return user.department === department;
  };

  // Get user's accessible departments (useful for UI rendering)
  const getAccessibleDepartments = () => {
    if (!user) return [];
    
    // SuperAdmin, Admin, and CEO can access all departments
    if (['superadmin', 'admin', 'ceo'].includes(user.role)) {
      return ['hr', 'iot', 'software', 'financial', 'business'];
    }
    
    // Other roles only have access to their own department
    return user.department ? [user.department] : [];
  };

  // Enhanced role validation with department context
  const hasRoleInDepartment = (role, department) => {
    if (!hasRole(role)) return false;
    return hasDepartment(department);
  };

  // Check if user can manage a specific department
  const canManageDepartment = (department) => {
    if (!user) return false;
    
    // SuperAdmin and Admin can manage all departments
    if (['superadmin', 'admin'].includes(user.role)) {
      return true;
    }
    
    // CEO can view all departments but specific management depends on business logic
    if (user.role === 'ceo') {
      return true;
    }
    
    // Managers can only manage their own department
    if (user.role === 'manager') {
      return user.department === department;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isLoading, 
      setIsLoading,
      setUser,
      setToken,
      login,
      logout,
      hasRole,
      hasPermission,
      hasDepartment,
      getAccessibleDepartments,
      hasRoleInDepartment,
      canManageDepartment
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};