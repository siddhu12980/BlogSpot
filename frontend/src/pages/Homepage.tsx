import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
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

interface BlogData {
  name: string;
  imageUrl: string;
  description: string;
  link: string;
  isPublication: boolean;
  onFollow: () => void;
}

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
  useEffect(() => {
    fetch(
      "http://localhost:8787/api/v1/all",

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => console.error("Error:", error));
  });

  const [data, setData] = useState<BlogData[]>([]);

  if (data !== null && data !== undefined) {
    let ans: BlogData[] = [];

    for (let i = 0; i < data.length; i++) {
      ans[i] = {
        name: data[i].name,
        imageUrl: data[i].imageUrl,
        description: data[i].description,
        link: data[i].link,
        isPublication: data[i].isPublication,
        onFollow: () => {
          console.log("Followed " + data[i].name);
        },
      };
    }
  }
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  //   const [textareaHeight, setTextareaHeight] = useState("auto");

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${e.target.scrollHeight - 16}px`;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill out all fields");
    console.log("Title:", title);
    console.log("Content:", content);
    // Add API call or other logic to save the blog post here
  };

  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <>
      <div>
        <nav className="bg-white text-black p-2 sticky top-0">
          <div className="flex justify-between">
            <div className=" font-extrabold flex text-2xl">
              <div className="pt-3.5">BlogSpot </div>
              <div>
                <SearchBar />
              </div>
            </div>

            <div className="flex py-2">
              <div className=" mr-4 py-1 ">
                <FiEdit size={25} />
              </div>
              <div className=" mr-4 py-1">
                <IoNotificationsOutline size={30} />
              </div>

              <div className=" py-1">
                <CgProfile size={30} />
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className=" w-full bg-white   flex flex-col lg:flex-row justify-center items-start">
        {/* Blog div, visible on all screens */}
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
            <BlogFeedItem user={""} title={""} blogContent={""} />
          </div>
        </div>

        {/* Extra div, hidden on small screens */}
        <div className="bg-white py-5  w-full lg:w-[80%] lg:mx-auto lg:pr-[8%] lg:pl-[2%] hidden lg:block">
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
