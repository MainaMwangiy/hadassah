"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import utils from "../../utils"

const MainLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hideSidebar, setHideSidebar] = useState(false)
  const location = useLocation()
  const isMobile = utils.isMobile
  const isDesktop = utils.isDesktop

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    }
    if (isDesktop) {
      setHideSidebar(!hideSidebar)
    }
  }

  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setIsOpen(false)
    }
  }, [isMobile])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector(".sidebar")
      if (sidebar && !sidebar.contains(e.target as Node)) {
        closeSidebar()
      }
    }

    if (isMobile && isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, isOpen, closeSidebar])

  useEffect(() => {
    if (isMobile) {
      closeSidebar()
    }
  }, [location.pathname, isMobile, closeSidebar])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {!hideSidebar && <Sidebar isMobile={isMobile} isOpen={isOpen} closeSidebar={closeSidebar} />}

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${hideSidebar ? "ml-0" : isOpen || !isMobile ? "md:ml-64" : "ml-0"
          }`}
      >
        <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={closeSidebar} />
      )}
    </div>
  )
}

export default MainLayout
