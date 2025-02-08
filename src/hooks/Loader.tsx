import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-gray-500" />
            <p className="ml-2 text-gray-500 text-lg">Loading...</p>
        </div>
    );
};

export default Loader;
