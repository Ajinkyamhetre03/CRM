import React from "react";
import { Clock } from "lucide-react";

const TrainingRecords = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-150px)] overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 text-center">
        <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Page Coming Soon TrainingRecords
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          We're working hard to bring you this feature. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default TrainingRecords;
