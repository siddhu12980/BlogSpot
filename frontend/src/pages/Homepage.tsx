import { ChangeEvent, FormEvent, useRef, useState } from "react";
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
import DropMenu from "../components/DropMenu";
const sampleData = [
  {
    name: "Andrew Zuo",
    imageUrl:
      "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png",
    description: "https://stratum.web.app",
    link: "https://stratum.web.app",
    isPublication: false,
    onFollow: () => {
      console.log("Followed Andrew Zuo");
    },
  },
  {
    name: "Management Matters",
    imageUrl:
      "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png",
    description: "There's plenty out there for the C-suite. What about the...",
    link: "https://example.com/management-matters",
    isPublication: true,
    onFollow: () => {
      console.log("Followed Management Matters");
    },
  },
  {
    name: "Avi Siegel",
    imageUrl:
      "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png",
    description: "Applying real-world perspective to product...",
    link: "https://example.com/avi-siegel",
    isPublication: false,
    onFollow: () => {
      console.log("Followed Avi Siegel");
    },
  },
  {
    name: "Sarah Jones",
    imageUrl:
      "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png",
    description: "Marketing expert with a passion for data-driven results.",
    link: "https://example.com/sarah-jones",
    isPublication: false,
    onFollow: () => {
      console.log("Followed Sarah Jones");
    },
  },
  {
    name: "Tech Trends",
    imageUrl:
      "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png",
    description: "Stay up-to-date with the latest in technology.",
    link: "https://example.com/tech-trends",
    isPublication: true,
    onFollow: () => {
      console.log("Followed Tech Trends");
    },
  },
];

export const Homepage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
        <nav className="bg-slate-100 text-black p-2 sticky top-0">
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

      <div className=" w-full bg-white flex flex-col lg:flex-row justify-center items-start">
        {/* Blog div, visible on all screens */}
        <div className="bg-slate-200 h-full w-full lg:w-[80%] lg:mx-auto lg:pl-[8%] lg:pr-[2%]">
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
            <BlogFeedItem />
            <BlogFeedItem />
            <BlogFeedItem />
          </div>
        </div>

        {/* Extra div, hidden on small screens */}
        <div className="bg-slate-300 py-5  w-full lg:w-[80%] lg:mx-auto lg:pr-[8%] lg:pl-[2%] hidden lg:block">
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
