import React from 'react';
import { useNavigate } from 'react-router-dom';

const  Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">🏠 Home Page</h1>

      <button
        onClick={() => navigate('/login')}
        className="px-6 py-3 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 transition duration-300"
      >
        Go to Login
      </button>
    </div>
  );
};

export default Home;
