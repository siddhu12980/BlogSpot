import { useEffect, useState, useMemo } from "react";
import { CgProfile } from "react-icons/cg";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import SearchBar from "../components/SearchBar";
import BlogFeedItem from "../components/BlogFeedItem";
import { FaPlus } from "react-icons/fa";
import BlogSidebar from "../components/BlogSidebar";
import RecommendedTopics from "../components/RecommendedTopics";
import MediumModal from "../components/MediumModal";
import WriterSuggest from "../components/WriterSuggest";
import { PacmanLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";

interface BlogData {
  id: string;
  post_id: string;
  name: string;
  title: string;
  content: string;
  isPublication: boolean;
}

interface Item {
  id: string;
  post_id: string;
  name: string;
  title: string;
  content: string;
  imageUrl: string;
  description: string;
  isPublication: boolean;
  link: string;
}

type Data = Item[][];

const sampleData = [
  {
    name: "John Doe",
    imageUrl:
      "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png",
    description: "The Great Gatsby",
    link:
      "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png",
    isPublication: false,
    onFollow: () => {
      console.log("Followed John Doe");
    },
  },
  {
    name: "Jane Doe",
    imageUrl:
      "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png",
    description: "The Great Gatsby",
    link:
      "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png",
    isPublication: false,
    onFollow: () => {
      console.log("Followed Jane Doe");
    },
  },
  {
    name: "John Smith",
    imageUrl:
      "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png",
    description: "The Great Gatsby",
    link:
      "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png",
    isPublication: false,
    onFollow: () => {
      console.log("Followed John Smith");
    },
  },
];

export const Homepage = () => {
  const [data, setData] = useState<Data>([]);
  const [realData, setRealData] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:8787/api/v1/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((datas) => {
        setData(datas);
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));
  }, []);

  const transformedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      id: item[0].id,
      name: item[0].name,
      post_id: item[1].id,
      title: item[1].title,
      content: item[1].content,
      isPublication: item[1].isPublication,
    }));
  }, [data]);

  useEffect(() => {
    setRealData(transformedData);
    console.log(realData);
  }, [transformedData]);

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
              <div className="flex justify-center items-center h-screen">
                <PacmanLoader />
              </div>
            ) : (
              realData.map((item, index) => (
                <BlogFeedItem
                  key={index}
                  post_id={item.post_id}
                  id={item.id}
                  user={item.name}
                  title={item.title}
                  blogContent={item.content}
                />
              ))
            )}
          </div>
        </div>
        <div className="bg-white py-5 w-full lg:w-[80%] lg:mx-auto lg:pr-[8%] lg:pl-[2%] hidden lg:block">
          <div className="flex flex-col">
            <div>
              <h1>Top Blogs</h1>
              <div>
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
              </div>
            </div>
          </div>
          <div className="py-4">
            <MediumModal />
          </div>
          <div>
            <RecommendedTopics />
          </div>
          <div>
            <WriterSuggest suggestions={sampleData} />
          </div>
        </div>
      </div>
    </>
  );
};
