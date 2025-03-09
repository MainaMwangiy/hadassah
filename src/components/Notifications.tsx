import React from 'react';
import { IoNotificationsOff } from 'react-icons/io5';

const Notifications: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
      
      <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 min-h-[400px]">
        <IoNotificationsOff className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">No Notifications Yet</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          When you receive notifications, they will appear here. Stay tuned for updates, alerts, and important messages.
        </p>
      </div>
    </div>
  );
};

export default Notifications; 