import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchInputProps {
    placeholder?: string;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    onSearch: (value: string) => void;
    onClear: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, searchTerm, setSearchTerm, onSearch, onClear }) => {
    const [inputValue, setInputValue] = useState(searchTerm);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSearch = () => {
        setSearchTerm(inputValue);
        onSearch(inputValue);
    };

    const handleClear = () => {
        setInputValue('');
        setSearchTerm('');
        onClear();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative mb-4 flex">
            <input
                type="text"
                placeholder={placeholder || "Search..."}
                value={inputValue}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border rounded-l dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
            <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
            >
                <FaSearch />
            </button>
            <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-500 text-white rounded-r hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
                title="Clear search"
            >
                <FaTimes />
            </button>
        </div>
    );
};

export default SearchInput;
