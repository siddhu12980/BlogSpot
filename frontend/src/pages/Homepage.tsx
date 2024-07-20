import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import SearchBar from "../components/SearchBar";
import BlogFeedItem from "../components/BlogFeedItem";
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

      <div className="h-screen w-full bg-white flex flex-col lg:flex-row justify-center items-start">
        {/* Blog div, visible on all screens */}
        <div className="bg-slate-200 h-screen w-full lg:w-[80%] lg:mx-auto lg:pl-[8%] lg:pr-[2%]">
          <div className="py-5">
            <nav className="bg-white text-sm font-normal text-black p-2 sticky top-0">
              <ul className="flex justify-evenly">
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
          </div>
        </div>

        {/* Extra div, hidden on small screens */}
        <div className="bg-slate-300 py-5 h-screen w-full lg:w-[80%] lg:mx-auto lg:pr-[8%] lg:pl-[2%] hidden lg:block">
          Extra
        </div>
      </div>
    </>
  );
};
