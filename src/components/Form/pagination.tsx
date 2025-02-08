import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
        <div className="flex justify-between items-center mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded bg-gray-200 text-gray-800 ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-300'}`}
            >
                &lt; Previous
            </button>
            <span className="text-gray-600 font-medium">
                Page {`${currentPage} - ${totalPages}`} of {totalItems}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded bg-gray-200 text-gray-800 ${currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-300'}`}
            >
                Next &gt;
            </button>
        </div>
    );
};

export default Pagination;
