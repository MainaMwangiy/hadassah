"use client"

import React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginationProps {
    currentPage: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const getVisiblePages = () => {
        const delta = 2
        const range = []
        const rangeWithDots = []

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i)
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...")
        } else {
            rangeWithDots.push(1)
        }

        rangeWithDots.push(...range)

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages)
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages)
        }

        return rangeWithDots
    }

    const PaginationButton = ({
        onClick,
        disabled,
        children,
        isActive = false,
    }: {
        onClick: () => void
        disabled?: boolean
        children: React.ReactNode
        isActive?: boolean
    }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        inline-flex items-center justify-center px-2 py-1.5 text-sm font-medium transition-colors duration-200 sm:px-3 sm:py-2
        ${isActive
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }
        ${disabled ? "cursor-not-allowed opacity-50" : "hover:text-gray-900 dark:hover:text-white"}
        border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
      `}
        >
            {children}
        </button>
    )

    if (totalPages <= 1) {
        return null
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="text-xs text-gray-700 dark:text-gray-300 sm:text-sm">
                Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{" "}
                <span className="font-medium">{totalItems}</span> results
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
                {/* First page */}
                <PaginationButton onClick={() => onPageChange(1)} disabled={currentPage === 1}>
                    <ChevronsLeft size={14} className="sm:h-4 sm:w-4" />
                    <span className="sr-only">First page</span>
                </PaginationButton>

                {/* Previous page */}
                <PaginationButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <ChevronLeft size={14} className="sm:h-4 sm:w-4" />
                    <span className="sr-only">Previous page</span>
                </PaginationButton>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {getVisiblePages().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === "..." ? (
                                <span className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 sm:px-3 sm:py-2 sm:text-sm">
                                    ...
                                </span>
                            ) : (
                                <PaginationButton onClick={() => onPageChange(page as number)} isActive={currentPage === page}>
                                    {page}
                                </PaginationButton>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Next page */}
                <PaginationButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <ChevronRight size={14} className="sm:h-4 sm:w-4" />
                    <span className="sr-only">Next page</span>
                </PaginationButton>

                {/* Last page */}
                <PaginationButton onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
                    <ChevronsRight size={14} className="sm:h-4 sm:w-4" />
                    <span className="sr-only">Last page</span>
                </PaginationButton>
            </div>
        </div>
    )
}

export default Pagination
