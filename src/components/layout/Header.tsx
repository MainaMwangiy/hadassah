"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { Bell, Moon, Sun, Menu } from "lucide-react"
import { useDarkMode } from "../../hooks/DarkModeContext"
import ProfileDropdown from "../../hooks/ProfileDropdown"

interface HeaderProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate()
  const { toggleDarkMode, darkMode } = useDarkMode()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 sm:h-16">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:h-9 sm:w-9"
        >
          <Menu size={18} className="sm:h-5 sm:w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </button>

        {/* <div className="relative flex-1 sm:flex sm:max-w-xs md:max-w-sm lg:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="h-8 w-full rounded-md border border-gray-200 bg-white pl-8 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-400 dark:focus-visible:ring-purple-400 sm:h-9"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate("/notifications")}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 relative focus:outline-none focus:ring-2 focus:ring-orange-500 sm:h-9 sm:w-9"
        >
          <Bell size={16} className="sm:h-[18px] sm:w-[18px]" />
          <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 sm:top-1 sm:right-1.5"></span>
          <span className="sr-only">Notifications</span>
        </button>

        <button
          onClick={toggleDarkMode}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:h-9 sm:w-9"
        >
          {darkMode ? (
            <Sun size={16} className="sm:h-[18px] sm:w-[18px]" />
          ) : (
            <Moon size={16} className="sm:h-[18px] sm:w-[18px]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </button>

        <ProfileDropdown />
      </div>
    </header>
  )
}

export default Header