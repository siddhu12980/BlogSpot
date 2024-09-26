import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import config from "../../utils/config";
import { toast, Toaster } from "sonner";
import { IoIosAddCircleOutline } from "react-icons/io";
import uploadImage from "../../helpers/uploder";

const Topic_list = ["science", "programming", "arts", "technology"];

interface Data {
  id: string;
  name: string;
  email: string;
  profilePicKey: string;
  about: string;
}
export const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [post_banner, setpost_banner] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // State for selected tags

  const handleTagClick = (tag: string) => {

    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag) // Remove tag if already selected
        : [...prevTags, tag] // Add tag if not selected
    );

  };

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
    if (!title || !content) return toast.error("Please fill out all fields");

    fetch(`${config.apiUrl}/api/v1/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        content,
        post_banner,
        tag: selectedTags
      }),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Post Created  SucessFully");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Error While Creating Post");
      });
  };

  const ref = useRef<HTMLTextAreaElement>(null);

  const [data, setDatas] = useState<Data>();

  useEffect(() => {
    fetch(`${config.apiUrl}/api/v1/user/name`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((datas) => {
        setDatas(datas);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handelPostPicUpload = async (file: File) => {
    uploadImage(file, (imageUrl: string ) => {
      setpost_banner(imageUrl);
      toast.success("Post Image Uploaded");
    }, (errorMessage: string) => {
      toast.error(errorMessage);
    }
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      handelPostPicUpload(file);
    }
  };

  return (
    <>
      <div>
        <nav className="bg-white text-black p-4 sticky top-0">
          <div className="flex justify-between">
            <div className=" font-extrabold text-2xl">
              <Link to={"/"}>BlogSpot</Link>

              <span className=" text-sm pb-1/2 font-normal opacity-50 p-2">
                Draft in {data?.name}
              </span>
            </div>
            <div className="flex py-2">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded mr-4"
              >
                Publish
              </button>
              <div className=" mr-4 py-1 "></div>
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
        <div className=" flex flex-row justify-between ">

        <div className="w-3/5 flex flex-col    overflow-y-auto">
          <div className="p-3 ">
            <form onSubmit={handleSubmit} className="">
              <div className="flex items-center">
                <div className="relative inline-block">
                  <button className="py-2 text-slate-400">
                    <IoIosAddCircleOutline size={44} />
                  </button>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="| Title"
                  className="w-full p-4 pl-10 text-5xl focus:outline-none outline-none text-gray-800"
                />
              </div>

             
          


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

        <div className="1/5  mt-5 ">
                <h3 className="text-lg font-bold p-2">Select Tags:</h3>
                <div className="flex flex-col ">
                  {Topic_list.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`cursor-pointer px-3 py-1  hover:bg-gray-300 rounded-lg mr-2 mb-2 ${
                        selectedTags.includes(tag)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }

                      
                      
                      `}


                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

        </div>
        <Toaster />
      </div>
    </>
  );
};
