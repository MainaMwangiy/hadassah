import React from "react";
import { FaTachometerAlt, FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { MdProductionQuantityLimits } from "react-icons/md";
import { Link } from "react-router-dom";
import logo from '../assets/logo.jpg';
import { SidebarProps } from "../../types";

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen }) => {
  return (
    <aside
      className={`sidebar bg-white shadow-lg dark:bg-gray-900 text-gray-900 dark:text-gray-100 fixed inset-y-0 left-0 z-50 h-full transition-transform duration-300 transform ${isOpen || !isMobile ? "translate-x-0 w-64" : "-translate-x-full"}`} >
      <div className="flex flex-col items-center py-6">
        <Link to="/">
          <img src={logo} alt="Zao Logo" className="h-20 w-auto mb-4 cursor-pointer" />
        </Link>
      </div>
      <nav className="mt-6">
        <ul>
          <li className="mb-4">
            <Link to="/dashboard" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/products" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <MdProductionQuantityLimits className="mr-3" />
              Products
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/sales" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FcSalesPerformance className="mr-3" />
              Sales
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
