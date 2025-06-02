"use client"

import type React from "react"
import { BellOff, Bell, RefreshCw } from "lucide-react"

const Notifications: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-4 flex flex-col space-y-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Notifications</h1>
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-blue-400 sm:px-4 sm:py-2.5">
          <RefreshCw size={16} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-700 sm:h-16 sm:w-16">
            <BellOff size={24} className="sm:h-8 sm:w-8" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">No notifications yet</h2>
          <p className="mb-6 max-w-sm text-center text-sm text-gray-500 dark:text-gray-400 sm:max-w-md sm:text-base">
            When you receive notifications, they will appear here. Stay tuned for updates, alerts, and important
            messages.
          </p>
          <button className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-600 sm:px-6">
            <Bell size={16} className="sm:h-5 sm:w-5" />
            <span>Enable notifications</span>
          </button>
        </div>
      </div>

      {/* Sample notification items (hidden by default) */}
      <div className="mt-4 hidden space-y-3 sm:mt-6 sm:space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 sm:h-10 sm:w-10">
              <Bell size={16} className="sm:h-5 sm:w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex flex-col space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h3 className="font-medium text-gray-900 dark:text-white">New message received</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">2 hours ago</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You have received a new message from the support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
