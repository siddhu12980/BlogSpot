import { FaStar, FaComment, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import config from "../../../utils/config";
import DropMenu from "../../Navbar/DropMenu";

interface data {
  user: string;
  title: string;
  blogContent: string;
  createdAt: string;
  id: string;
  post_id: string;
}
const BlogFeedItem = (data: data) => {
  const nagivate = useNavigate();

  function createDate(dates: string) {
    const dateStr = dates;
    const date = new Date(dateStr);
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return formattedDate;
  }

  async function handeleStart(id: string, authorId: string) {
    console.log(id);
    fetch(`${config.apiUrl}/api/v1/blog/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        blog_id: id,
        author_id: authorId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handleSavePost(postId: string) {
    fetch(`${config.apiUrl}/api/v1/blog/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ postId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handelAuthorpage() {
    nagivate(`/author/${data.id}`);
  }

  return (
    <div className="flex flex-col mb-4 p-4 bg-white  ">
      {/* User Profile Pic and Username */}
      <div className="flex items-center mb-2">
        <img
          src="https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png"
          alt="User Profile Pic"
          className="w-10 h-10 rounded-full mr-2"
        />
        <span onClick={handelAuthorpage} className="text-sm cursor-pointer font-bold">
          {data.user}
        </span>
      </div>

      <div
        className="flex cursor-pointer flex-col lg:flex-row items-start mb-2"
      >
        <div className="lg:w-3/5 w-full lg:mr-4 mb-4 lg:mb-0">
          <h2 
        onClick={() => nagivate(`/blog/${data.post_id}`)}

           className="text-xl lg:text-2xl font-bold mb-2">{data.title}</h2>
          <p
        onClick={() => nagivate(`/blog/${data.post_id}`)}
           
           className="text-base lg:text-lg mb-4">{data.blogContent}</p>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
            <div className="flex flex-1 items-center mb-2 lg:mb-0">
              <span className="text-sm text-gray-600 mr-2">
                {createDate(data.createdAt)}
              </span>

              <FaStar
                onClick={() => handeleStart(data.post_id, data.id)}
                size={18}
                className="text-gray-600 mr-2"
              />
              <FaComment size={18} className="text-gray-600 mr-2" />
            </div>

            <div className="flex items-center flex-shrink-0">
              <FaSave
                onClick={() => handleSavePost(data.post_id)}
                size={18}
                className="text-gray-600 mr-2"
              />
              <DropMenu  />
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