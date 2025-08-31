import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { FourSquare } from 'react-loading-indicators';

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requiredPermission, 
  requiredDepartment 
}) => {
  const { isAuthenticated, isLoading, user, hasRole, hasPermission } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <FourSquare color="#acadac" size="medium" text="Loading..." textColor="#e76d6d" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check for specific role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for permission requirement (hierarchy)
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for department requirement
  if (requiredDepartment) {
    // Allow superadmin, admin, and ceo to access any department
    const hasUniversalAccess = ['superadmin', 'admin', 'ceo'].includes(user?.role);
    
    if (!hasUniversalAccess && user?.department !== requiredDepartment) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Additional role + department validation
  if (requiredRole && requiredDepartment) {
    // Ensure user has both the required role and department
    const hasCorrectRole = hasRole(requiredRole);
    const hasCorrectDepartment = user?.department === requiredDepartment;
    
    // SuperAdmin, admin, and CEO can access any department
    const hasUniversalAccess = ['superadmin', 'admin', 'ceo'].includes(user?.role);
    
    if (!hasCorrectRole || (!hasUniversalAccess && !hasCorrectDepartment)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;