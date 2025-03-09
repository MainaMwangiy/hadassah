import React, { useState, useEffect } from "react";
import { FaBell, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useDarkMode } from "../../hooks/DarkModeContext";
import ProfileDropdown from "../../hooks/ProfileDropdown";
import { AiOutlineMenu } from "react-icons/ai";
import { SidebarProps } from "../../types";

const Header: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleDarkMode, darkMode } = useDarkMode();

  const [isDarkMode, setISDarkMode] = useState(darkMode);

  useEffect(() => {
    setISDarkMode(isDarkMode);
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    setISDarkMode(!darkMode);
  };

  return (
    <header className="w-full h-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-md flex justify-between items-center px-4 sm:px-6 lg:px-8 mt-2">
      <div className="flex items-center">
        <AiOutlineMenu className="text-3xl cursor-pointer" onClick={toggleSidebar} />
      </div>
      {/* <div className="flex-grow mx-4">
        <input
          type="text"
          className="w-full max-w-sm px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Search"
        />
      </div> */}
      <div className="flex items-center space-x-6">
        <button
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            location.pathname === '/notifications' ? 'bg-gray-100 dark:bg-gray-800' : ''
          }`}
          onClick={() => navigate("/notifications")}
        >
          <FaBell className="text-xl text-gray-600 dark:text-gray-300" />
        </button>
        
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={handleToggleDarkMode}
        >
          {darkMode ? (
            <FaSun className="text-xl text-gray-600 dark:text-gray-300" />
          ) : (
            <FaMoon className="text-xl text-gray-600 dark:text-gray-300" />
          )}
        </button>
        
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
