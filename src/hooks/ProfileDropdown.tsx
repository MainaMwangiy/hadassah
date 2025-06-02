"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"

interface UserData {
  name: string
  email: string
  image_url: string
}

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const getStoredUser = (): UserData | null => {
    const storedUser = localStorage.getItem("clientuser")
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e)
        return null
      }
    }
    return null
  }

  useEffect(() => {
    setUserData(getStoredUser())
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const clearCookies = () => {
    const cookies = document.cookie.split(";")
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim()
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; Secure; SameSite=Lax`
    })
  }

  const handleLogout = () => {
    clearCookies()
    localStorage.clear()
    sessionStorage.clear()
    navigate("/login")
  }
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-blue-400 sm:gap-2 sm:p-1.5"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {userData?.image_url ? (
          <img
            src={userData.image_url || "/placeholder.svg"}
            alt="Profile"
            className="h-6 w-6 rounded-full object-cover sm:h-7 sm:w-7"
            onError={(e) => {
              ; (e.target as HTMLImageElement).src = "https://via.placeholder.com/40"
            }}
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 sm:h-7 sm:w-7">
            <span className="text-xs font-medium text-white">{userData?.name?.charAt(0) || "U"}</span>
          </div>
        )}
        <span className="hidden truncate max-w-20 md:inline-block md:max-w-32">{userData?.name || "User"}</span>
        <ChevronDown className="hidden h-3 w-3 md:inline-block sm:h-4 sm:w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out dark:bg-gray-800 dark:ring-gray-700 sm:w-64">
          <div className="p-3 sm:p-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3 dark:border-gray-700">
              {userData?.image_url ? (
                <img
                  src={userData.image_url || "/placeholder.svg"}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                  onError={(e) => {
                    ; (e.target as HTMLImageElement).src = "https://via.placeholder.com/40"
                  }}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500">
                  <span className="text-sm font-medium text-white">{userData?.name?.charAt(0) || "U"}</span>
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {userData?.name || "Guest"}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{userData?.email || "No email"}</p>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-purple-400 dark:focus:ring-offset-gray-800"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-orange-400 dark:focus:ring-offset-gray-800"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:text-red-400 dark:hover:bg-red-900/20 dark:focus:ring-red-400 dark:focus:ring-offset-gray-800"
              >
                {/* <LogOut className="h-4 w-4" /> */}
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
