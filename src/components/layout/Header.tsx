"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { Bell, Moon, Sun, Menu, Search, User, LogOut, Settings, ChevronDown } from "lucide-react"
import { useDarkMode } from "../../hooks/DarkModeContext"

interface HeaderProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate()
  const { toggleDarkMode, darkMode } = useDarkMode()
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
      <button
        onClick={toggleSidebar}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
      >
        <Menu size={20} />
        <span className="sr-only">Toggle sidebar</span>
      </button>

      <div className="relative hidden md:flex flex-1 items-center gap-2 md:ml-2 md:gap-4 lg:gap-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-md border border-gray-200 bg-white pl-8 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-400 dark:focus-visible:ring-purple-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/notifications")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 relative"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          <span className="sr-only">Notifications</span>
        </button>

        <button
          onClick={toggleDarkMode}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span className="sr-only">Toggle theme</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">HS</span>
            </div>
            <span className="hidden md:inline-flex">Admin</span>
            <ChevronDown size={14} className="hidden md:inline-flex" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-900 dark:ring-gray-800">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  role="menuitem"
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  role="menuitem"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  role="menuitem"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
