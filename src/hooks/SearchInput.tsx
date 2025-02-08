import React from 'react';

interface SearchInputProps {
    placeholder?: string;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, searchTerm, setSearchTerm }) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
    };

    return (
        <div className="relative mb-4">
            <input
                type="text"
                placeholder={placeholder || "Search..."}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
        </div>
    );
};

export default SearchInput;
