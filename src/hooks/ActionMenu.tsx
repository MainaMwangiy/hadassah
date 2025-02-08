import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMore, AiOutlineEllipsis } from "react-icons/ai";
import utils from "../utils";
// import { ModuleConfig } from "../types";

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  hideActionMenu?: boolean;
  config?: {};
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDelete, hideActionMenu, config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
      >
        <div className="flex justify-end items-center">
          {
            !utils.isMobile ? (
              <AiOutlineEllipsis className="text-gray-600 dark:text-gray-300" size={20} />
            ) : (
              <AiOutlineMore className="text-gray-600 dark:text-gray-300" size={20} />
            )
          }
        </div>
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                     shadow-lg rounded-lg z-10"
        >

          {(hideActionMenu ) &&
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Edit
            </button>
          }
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
