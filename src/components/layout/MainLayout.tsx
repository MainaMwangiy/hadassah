import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import utils from "../../utils";

const MainLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [hideSideBar, setHideSidebar] = useState(false);
  const isMobile = utils.isMobile;
  const isDesktop = utils.isDesktop;

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
    if (isDesktop) {
      setHideSidebar(!hideSideBar);
    }
  };

  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar && !sidebar.contains(e.target as Node)) {
        closeSidebar();
      }
    };
    if (isMobile && isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen, closeSidebar]);

  useEffect(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [location.pathname, isMobile, closeSidebar]);
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {!hideSideBar && <Sidebar isMobile={isMobile} isOpen={isOpen} closeSidebar={closeSidebar} />}
      <div className={`flex flex-col transition-all duration-300 ${(isMobile || isOpen || hideSideBar) ? "md:ml-0 w-full" : "md:ml-64 w-full"}`} >
        <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 mt-2">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={closeSidebar} />
      )}
    </div>
  );
};

export default MainLayout;
