import { useAuth } from '../../../Context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Welcome, {user?.name}!
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This is your personalized dashboard based on your role: {user?.role}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;