import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import config from "../../utils/config";
import { toast, Toaster } from "sonner";
import { IoIosAddCircleOutline } from "react-icons/io";

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
  const [postBannerkey, setPostBannerkey] = useState<string | null>(null);

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
        post_banner: postBannerkey,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast.success("Post Created  SucessFully");
      })
      .catch((error) => console.error("Error:", error));
    toast.error("Error While Creating Post");
  };

  const ref = useRef<HTMLTextAreaElement>(null);

  const [data, setDatas] = useState<Data>();

  useEffect(() => {
    fetch(`${config.apiUrl}/api/v1/all/name`, {
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

  const handelBannerInput = () => {
    console.log("Banner Input");
  };
  const handelInputchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageUpload(e.target.files[0]).then((key) => {
        console.log("Key", key);
        setPostBannerkey(key);
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    const url = `${config.apiUrl}/upload`;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const res = await response.json();
        const data = res["image"].url;
        const key = data.split("/").pop();
        console.log(`Image uploaded successfully: ${file.name}`);
        console.log("Image key:", key);

        return key;
      } else {
        console.error("Upload failed:", response.statusText);
        return "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <>
      <div>
        <nav className="bg-white text-black p-4 sticky top-0">
          <div className="flex justify-between">
            <div className=" font-extrabold text-2xl">
              <Link to={"/home"}>BlogSpot</Link>

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
              <div className="flex items-center">
                <div className="relative inline-block">
                  <button
                    onClick={handelBannerInput}
                    className="py-2 text-slate-400"
                  >
                    <IoIosAddCircleOutline size={44} />
                  </button>
                  <input
                    type="file"
                    onChange={handelInputchange}
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
        <Toaster />
      </div>
    </>
  );
};
