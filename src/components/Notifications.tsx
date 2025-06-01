"use client"

import React from "react"
import { BellOff, Bell, RefreshCw } from 'lucide-react'

const Notifications: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <button className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:mt-0">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-700">
            <BellOff size={32} />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No notifications yet</h2>
          <p className="mb-6 max-w-md text-center text-gray-500 dark:text-gray-400">
            When you receive notifications, they will appear here. Stay tuned for updates, alerts, and important messages.
          </p>
          <button className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-600">
            <Bell size={16} />
            Enable notifications
          </button>
        </div>
      </div>

      {/* Sample notification items (hidden by default) */}
      <div className="mt-6 hidden space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white">New message received</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
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
