import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  image_url: string;
}

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { image_url } = loggedUser || {}

  const getStoredUser = (): User | null => {
    const storedUser = localStorage.getItem('clientuser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    setLoggedUser(getStoredUser());
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const clearCookies = () => {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; Secure; SameSite=Lax`;
    });
  };

  const LogOut = () => {
    clearCookies();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.querySelector(".menu");
      if (menu && !menu.contains(e.target as Node)) {
        closeMenu();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="menu relative bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex items-center space-x-6" onClick={() => setIsOpen(!isOpen)}>
        {image_url ? (
          <img src={image_url} alt="Profile" className="w-12 h-12 rounded-full" />
        ) : (
          <FaUserCircle className="text-gray-500 cursor-pointer" size={32} />
        )}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-50">
          {/* User Info Section */}
          <div className="flex items-center px-2 py-2 border-b border-gray-200">
            <div className="flex-shrink-0 mr-3">
              {image_url ? (
                <img src={image_url} alt="Profile" className="w-12 h-12 rounded-full" />
              ) : (
                <FaUserCircle className="text-gray-500" size={30} />
              )}
            </div>
            <div className="flex flex-col ml-3 flex-grow">
              <p className="text-gray-800 font-semibold truncate">{loggedUser?.name || "Guest"}</p>
              <p className="text-sm text-gray-500 truncate">{loggedUser?.email || "No email available"}</p>
            </div>
          </div>

          {/* Profile Link */}
          <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
            Profile
          </Link>
          {/* My Bills Link */}
          {/* <Link to="/my-bills" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
            My Bills
          </Link> */}
          {/* Logout Button */}
          <button
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={LogOut}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
