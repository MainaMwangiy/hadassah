"use client"

import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Package, BarChart3, ChevronLeft } from "lucide-react"

interface SidebarProps {
  isMobile: boolean
  isOpen: boolean
  closeSidebar?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, closeSidebar }) => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/products", icon: <Package size={20} />, label: "Products" },
    { path: "/sales", icon: <BarChart3 size={20} />, label: "Sales" },
  ]

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 ease-in-out ${isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        } ${isMobile ? "w-72" : "w-64"}`}
    >
      <div className="flex items-center justify-between h-14 border-b border-gray-200 dark:border-gray-800 px-3 sm:h-16 sm:px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center sm:w-8 sm:h-8">
            <span className="text-white font-bold text-sm sm:text-lg">HS</span>
          </div>
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 sm:text-xl">
            Hadassah Scents
          </span>
        </Link>

        {isMobile && (
          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 sm:py-6 sm:px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm sm:text-base ${isActive(item.path)
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <span
                  className={`${isActive(item.path) ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"}`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>

                {isActive(item.path) && (
                  <span className="ml-auto w-1.5 h-5 bg-purple-600 dark:bg-purple-400 rounded-full"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800 sm:p-4">
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center sm:w-10 sm:h-10">
              <span className="text-white font-medium text-xs sm:text-sm">HS</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Hadassah Scents</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Admin Dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
