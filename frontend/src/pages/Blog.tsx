import { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { RiseLoader } from "react-spinners";

interface UserData {
  id: string;
  name: string;
  email: string;
}
interface BlogPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string; // ISO 8601 date string
  published: boolean;
  tag: string[];
  userId: string | null;
}

const Blog = () => {
  const id = useParams();
  const [data, setData] = useState<BlogPost>();
  const [user, setUser] = useState<UserData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8787/api/v1/blog/${id.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((datas) => {
        console.log(datas.blog);
        setData(datas?.blog);
        setUser(datas?.user);
        setLoading(false);
      })
      .catch((error) => console.error("Error:", error.message));
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <RiseLoader color="#000" loading={true} size={30} />
        </div>
      ) : (
        <div className="h-screen w-full p-10 bg-slate-300 flex flex-row justify-between items-start ">
          <div className="w-3/5">
            <h1 className="sm:text-5xl py-5 font-extrabold">{data?.title}</h1>
            <p className="text-gray-600 text-opacity-90 py-3">
              {" "}
              {/* Publish at {data.date} */}
            </p>
            <p className="sm:text-xl md:text-2xl">{data?.content}</p>
          </div>
          <div className="w-2/5 flex flex-col items-center py-5">
            <p className="text-black sm:text-2xl py-5  ">
              Author: {user?.name}
            </p>

            <div className="flex ">
              <div>
                <RxAvatar size={20} />
              </div>

              <div className="px-2">
                {/* <p className="font-bold">{data.author}</p> */}
                {/* <p className="text-gray-600">{data.authorData}</p> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;
