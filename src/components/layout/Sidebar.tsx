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
      className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 ease-in-out ${isOpen || !isMobile ? "translate-x-0 w-64" : "-translate-x-full"
        }`}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">HS</span>
          </div>
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Hadassah Scents
          </span>
        </Link>

        {isMobile && (
          <button onClick={closeSidebar} className="ml-auto p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive(item.path)
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <span
                  className={`${isActive(item.path) ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"}`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>

                {isActive(item.path) && (
                  <span className="ml-auto w-1.5 h-5 bg-purple-600 dark:bg-purple-400 rounded-full"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <span className="text-white font-medium">HS</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Hadassah Scents</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
