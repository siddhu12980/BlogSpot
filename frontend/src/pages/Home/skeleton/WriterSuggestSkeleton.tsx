import React from "react";

const WriterSuggestSkeleton = () => {
  return (
    <div className="p-4  mb-4 flex items-center animate-pulse">
      <div className="bg-gray-200 h-12 w-12 rounded-full mr-4"></div>
      <div className="flex-1">
        <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
        <div className="bg-gray-200 h-4 w-5/6"></div>
      </div>
    </div>
  );
};

export default WriterSuggestSkeleton;
