import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
export const CreateBlog = () => {
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
        <nav className="bg-white text-black p-4 sticky top-0">
          <div className="flex justify-between">
            <div className=" font-extrabold text-2xl">
              BlogSpot{" "}
              <span className=" text-sm pb-1/2 font-normal opacity-50">
                Draft in username
              </span>
            </div>
            <div className="flex py-2">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded mr-4"
              >
                Publish
              </button>
              <div className=" mr-4 py-1 ">
                <BsThreeDots size={30} />
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
      <div className="h-screen w-full bg-white flex justify-center items-start">
        <div className="w-3/5 flex flex-col   overflow-y-auto">
          <div className="p-3">
            <form onSubmit={handleSubmit} className="">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder=" Title"
                className="w-full p-4 pl-10 text-5xl focus:outline-none outline-none text-gray-800"
              />
            </form>
          </div>
          <div className="flex-1 p-4">
            <textarea
              ref={ref}
              rows={1}
              value={content}
              onChange={handleContentChange}
              placeholder="Tell Your Story"
              className="w-full p-2 pl-10 text-3xl   outline-none text-gray-700 resize-none"
              style={{ height: 200, overflowY: "hidden" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
