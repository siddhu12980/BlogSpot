import React from "react";

const BlogSidebarSkeleton = () => {
  return (
    <div className="p-4  rounded-lg mb-4 animate-pulse">
      <div className="bg-gray-200 h-6 w-3/4 mb-2"></div>
      <div className="bg-gray-200 h-4 w-full mb-2"></div>
      <div className="bg-gray-200 h-4 w-5/6 mb-2"></div>
      <div className="bg-gray-200 h-4 w-3/4"></div>
    </div>
  );
};

export default BlogSidebarSkeleton;
