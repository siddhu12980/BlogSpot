import {
  FaStar,
  FaThumbsUp,
  FaComment,
  FaThumbsDown,
  FaSave,
  FaEllipsisV,
} from "react-icons/fa";

const BlogFeedItem = () => {
  return (
    <div className="flex flex-col mb-4 p-4 bg-white shadow-md rounded-md">
      {/* User Profile Pic and Username */}
      <div className="flex items-center mb-2">
        <img
          src="https://via.placeholder.com/50"
          alt="User Profile Pic"
          className="w-10 h-10 rounded-full mr-2"
        />
        <span className="text-sm font-bold">John Doe</span>
      </div>

      {/* Content and Image */}
      <div className="flex flex-col lg:flex-row items-start mb-2">
        <div className="lg:w-3/5 w-full lg:mr-4 mb-4 lg:mb-0">
          <h2 className="text-xl lg:text-2xl font-bold mb-2">
            This is a sample blog title
          </h2>
          <p className="text-base lg:text-lg mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
            amet nulla auctor, vestibulum magna sed, convallis ex.
          </p>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
            <span className="text-sm text-gray-600 mb-2 lg:mb-0">
              Published on 2022-01-01
            </span>
            <div className="flex items-center justify-between w-full lg:w-auto">
              <div className="flex items-center">
                <FaStar size={18} className="text-gray-600 mr-2" />
                <FaThumbsUp size={18} className="text-gray-600 mr-2" />
                <FaComment size={18} className="text-gray-600 mr-2" />
              </div>
              <div className="flex items-center">
                <FaThumbsDown size={18} className="text-gray-600 mr-2" />
                <FaSave size={18} className="text-gray-600 mr-2" />
                <FaEllipsisV size={18} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>
        <img
          src="https://via.placeholder.com/100"
          alt="Blog Image"
          className="lg:w-2/5 w-full h-40 lg:h-20 rounded-md object-cover"
        />
      </div>
    </div>
  );
};

export default BlogFeedItem;
