import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ActionMenu from "./ActionMenu";
interface CardProps {
  id: string;
  title: string;
  addedBy: string;
  location: string;
  size: string;
  projectstatus: string;
  projectPlanIncluded: string;
  costprojectestimation: string;
  imagesurl: string;
  name?: string;
  projectname?: string;
  onEdit: () => void;
  onDelete: () => void;
  expenses: number;
  earnings: number;
}

interface BlobItem {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  addedBy,
  location,
  size,
  projectstatus,
  projectPlanIncluded,
  costprojectestimation,
  imagesurl,
  name,
  projectname = '',
  onEdit,
  onDelete,
  expenses,
  earnings,
}) => {
  const navigate = useNavigate();
  const gallery = localStorage.getItem("gallery");
  const images: BlobItem[] = gallery ? JSON.parse(gallery) : [];
  const [isExpensesVisible, setIsExpensesVisible] = useState(false);
  const [isEarningsVisible, setIsEarningsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = projectname?.length > 15;

  const toggleText = () => {
    if (shouldTruncate) {
      setIsExpanded(!isExpanded);
    }
    handleOpenTracker();
  };

  const toggleExpensesVisibility = () =>
    setIsExpensesVisible(!isExpensesVisible);
  const toggleEarningsVisibility = () =>
    setIsEarningsVisible(!isEarningsVisible);

  const formatPlaceholder = (value: number | string | null | undefined) => {
    return value ? "*".repeat(value.toString().length) : "";
  };

  const handleOpenTracker = () => {
    navigate(`/projects/${id}`, {
      state: {
        id,
        title,
        addedBy,
        location,
        size,
        projectstatus,
        projectPlanIncluded,
        costprojectestimation,
        imagesurl,
        name,
        projectname
      },
    });
  };

  const imageSrc = imagesurl
    ? imagesurl
    : "https://nsra83gx72pwujdb.public.blob.vercel-storage.com/blob-2LLFFCrEiYgZ7ha8hV7zXIhbm5spC3";
  const isHavingProjectPlan = projectPlanIncluded === "Yes";
  return (
    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md flex flex-col">
      <div className="w-full mb-4">
        {images.length > 0 ? (
          <Carousel images={images} />
        ) : (
          <img
            src={imageSrc}
            alt="Project"
            className="
        w-full h-auto object-cover rounded-lg mb-4
        sm:max-w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto"
            onClick={handleOpenTracker}
          />
        )}
      </div>
      <div className="flex">
        <div className="w-1/2 p-1">
          <div className="flex-1">
            <div>
              <h3
                className={`mt-2 text-lg font-semibold cursor-pointer ${!isExpanded && shouldTruncate ? 'truncate' : ''} w-full`}
                onClick={toggleText}
              >
                {projectname}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Added by: {name}, {location}
              </p>
              <p>Size {size} acres</p>
              <p className="text-green-500 font-bold">{projectstatus}</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Project plan included:{" "}
                <span
                  className={
                    isHavingProjectPlan ? "text-green-500" : "text-red-500"
                  }
                >
                  {projectPlanIncluded}
                </span>
              </p>
              <button
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleOpenTracker}
              >
                Open Tracker
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/2 p-4 flex flex-col">
          <div className="flex justify-end">
            <ActionMenu onEdit={onEdit} onDelete={() => onDelete()} hideActionMenu={true} />
          </div>
          <div className="mb-4 mt-4">
            <p className="text-gray-600 dark:text-gray-400">Total Expenses</p>
            <div className="flex items-center">
              <p className="text-red-500 text-2xl font-semibold mr-2 font-mono">
                {isExpensesVisible
                  ? `KES ${expenses || 0}`
                  : `KES ${formatPlaceholder(expenses || 0)}`}
              </p>
              <button
                onClick={toggleExpensesVisibility}
                className="focus:outline-none"
              >
                {isExpensesVisible ? (
                  <FaEyeSlash className="text-gray-600 dark:text-gray-400 text-xl" />
                ) : (
                  <FaEye className="text-gray-600 dark:text-gray-400 text-xl" />
                )}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400">Total Earnings</p>
            <div className="flex items-center">
              <p className="text-green-500 text-2xl font-semibold mr-2 font-mono">
                {isEarningsVisible
                  ? `KES ${earnings || 0}`
                  : `KES ${formatPlaceholder(earnings || 0)}`}
              </p>
              <button
                onClick={toggleEarningsVisibility}
                className="focus:outline-none"
              >
                {isEarningsVisible ? (
                  <FaEyeSlash className="text-gray-600 dark:text-gray-400 text-xl" />
                ) : (
                  <FaEye className="text-gray-600 dark:text-gray-400 text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
