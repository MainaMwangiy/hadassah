"use client"

import type React from "react"
import { useEffect } from "react"
import { X } from "lucide-react"

interface ChildProps {
  config?: {
    keyField?: string
  }
  mode?: string
}

interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  title?: string
  children: React.ReactElement<ChildProps>
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
}

const Modal: React.FC<ModalProps & { [key: string]: any }> = ({
  isOpen,
  onClose,
  title,
  children,
  config,
  size = "md",
  ...rest
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  let mainTitle = title || ""
  if (children && !mainTitle) {
    const { config, mode } = children.props
    mainTitle = mode === "edit" ? `Edit ${config?.keyField}` : `Add ${config?.keyField}`
  }

  const sizeClasses = {
    sm: "max-w-[90vw] sm:max-w-sm",
    md: "max-w-[90vw] sm:max-w-md",
    lg: "max-w-[90vw] sm:max-w-lg",
    xl: "max-w-[90vw] sm:max-w-4xl",
    "2xl": "max-w-[90vw] sm:max-w-6xl",
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-start p-3 sm:items-center sm:p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${sizeClasses[size]} border border-gray-200 dark:border-gray-700 my-3 sm:my-4`}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {/* Header */}
        {mainTitle && (
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-3 py-2 sm:px-4 sm:py-3">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">{mainTitle}</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800 sm:p-1.5"
                aria-label="Close modal"
              >
                <X size={16} className="sm:h-5 sm:w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-3 sm:p-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal