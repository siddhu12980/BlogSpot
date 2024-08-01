import {
  FaStar,
  FaThumbsUp,
  FaComment,
  FaThumbsDown,
  FaSave,
} from "react-icons/fa";
import DropMenu from "./DropMenu";

interface data {
  user: string;
  title: string;
  blogContent: string;
}
const BlogFeedItem = (data: data) => {
  return (
    <div className="flex flex-col mb-4 p-4 bg-white  ">
      {/* User Profile Pic and Username */}
      <div className="flex items-center mb-2">
        <img
          src="https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png"
          alt="User Profile Pic"
          className="w-10 h-10 rounded-full mr-2"
        />
        <span className="text-sm font-bold">{data.user}</span>
      </div>

      {/* Content and Image */}
      <div className="flex flex-col lg:flex-row items-start mb-2">
        <div className="lg:w-3/5 w-full lg:mr-4 mb-4 lg:mb-0">
          <h2 className="text-xl lg:text-2xl font-bold mb-2">{data.title}</h2>
          <p className="text-base lg:text-lg mb-4">{data.blogContent}</p>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
            <div className="flex flex-1 items-center mb-2 lg:mb-0">
              <span className="text-sm text-gray-600 mr-2">2022-01-01</span>
              <FaStar size={18} className="text-gray-600 mr-2" />
              <FaThumbsUp size={18} className="text-gray-600 mr-2" />
              <FaComment size={18} className="text-gray-600 mr-2" />
            </div>

            <div className="flex items-center flex-shrink-0">
              <FaThumbsDown size={18} className="text-gray-600 mr-2" />
              <FaSave size={18} className="text-gray-600 mr-2" />
              <DropMenu />
            </div>
          </div>
        </div>
        <img
          src="https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png"
          alt="Blog Image"
          className="lg:w-2/5 w-full h-40 lg:h-20 rounded-md object-cover"
        />
      </div>
    </div>
  );
};

export default BlogFeedItem;
