import type React from "react"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white py-3 dark:border-gray-800 dark:bg-gray-900 sm:py-4">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            © {currentYear} Hadassah Scents. All rights reserved.
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded sm:text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded sm:text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded sm:text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
