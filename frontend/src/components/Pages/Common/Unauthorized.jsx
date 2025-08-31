// components/Pages/Common/Unauthorized.jsx
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <ShieldX className="h-24 w-24 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You don't have permission to access this page.
        </p>
        <Link
          to="/app/dashboard"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;