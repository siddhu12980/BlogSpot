import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { PacmanLoader } from "react-spinners";
import { FaPlus } from "react-icons/fa";

export const AuthorProfile = () => {
  const [data, setData] = useState([]);
  const [realData, setRealData] = useState<[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  return (
    <>
      <div>
        <nav className="bg-white text-black p-2 sticky top-0">
          <div className="flex justify-between">
            <div className="font-extrabold flex text-2xl">
              <div className="pt-3.5">BlogSpot</div>
              <div>
                <SearchBar />
              </div>
            </div>
            <div className="flex py-2">
              <div className="mr-4 py-1">
                <Link to={"/blog"}>
                  {" "}
                  <FiEdit size={25} />
                </Link>{" "}
              </div>
              <div className="mr-4 py-1">
                <IoNotificationsOutline size={30} />
              </div>
              <div className="py-1">
                <CgProfile size={30} />
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className="w-full bg-white flex flex-col lg:flex-row justify-center items-start">
        <div className="bg-white h-full w-full lg:w-[80%] lg:mx-auto lg:pl-[8%] lg:pr-[2%]">
          <div className="py-5">
            <nav className="bg-white text-sm font-normal text-black p-2 sticky top-0">
              <ul className="flex justify-evenly">
                <li>
                  <FaPlus />
                </li>
                <li>For you</li>
                <li>Following</li>
                <li>Startup</li>
                <li>Science</li>
                <li>Programming</li>
              </ul>
            </nav>
          </div>
          <div className="items-end">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <PacmanLoader />
              </div>
            ) : (
              <div>AUthor Data</div>
              //   realData.map((item, index) => (
              //     <BlogFeedItem
              //       key={index}
              //       user={item.name}
              //       title={item.title}
              //       blogContent={item.content}
              //     />
              //   ))
            )}
          </div>
        </div>
        <div className="bg-white py-5 w-full lg:w-[80%] lg:mx-auto lg:pr-[8%] lg:pl-[2%] hidden lg:block">
          <div className="flex flex-col">
            <div>
              <h1>Top Blogs</h1>
              {/* <div>
                <BlogSidebar
                  username="John Doe"
                  book="The Great Gatsby"
                  title="My Blog Post is the best blog post in the world"
                  profilePic="https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png"
                />
                <BlogSidebar
                  username="John Doe"
                  book="The Great Gatsby"
                  title="My Blog Post is the best blog post in the world"
                  profilePic="https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png"
                />
                <BlogSidebar
                  username="John Doe"
                  book="The Great Gatsby"
                  title="My Blog Post is the best blog post in the world"
                  profilePic="https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png"
                />
              </div> */}
            </div>
          </div>
          <div className="py-4">{/* <MediumModal /> */}</div>
          <div>{/* <RecommendedTopics /> */}</div>
          <div>{/* <WriterSuggest suggestions={sampleData} /> */}</div>
        </div>
      </div>
    </>
  );
};
