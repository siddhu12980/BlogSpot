import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RiseLoader } from "react-spinners";
import config from "../../utils/config";
import { NavBar } from "../Navbar/NavBar";

interface UserData {
  id: string;
  name: string;
  email: string;
  profilePicKey: string;
  about: string;
}
interface BlogPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  published: boolean;
  tag: string[];
  userId: string | null;
  post_banner: string;
}

const Blog = () => {
  const id = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<BlogPost>();
  const [user, setUser] = useState<UserData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${config.apiUrl}/api/v1/blog/${id.id}`, {
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
      <NavBar onSearch={() => console.log(data?.post_banner)} />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <RiseLoader color="#000" loading={true} size={30} />
        </div>
      ) : (
        <div className="h-screen w-full p-10 bg-slate-100 flex flex-row justify-between  ">
          <div className="w-3/5">
            <h1 className="sm:text-5xl py-5 font-extrabold">{data?.title}</h1>
            <p className="text-gray-600 text-opacity-90 py-3">
              {" "}
              Publish at {data?.createdAt}
            </p>

            {data?.post_banner && (
              <img
                className="w-[60%] h-96 object-cover"
                src={`${config.apiUrl}/image/${data?.post_banner}`}
                alt={data?.title}
              />
            )}

            <p className="sm:text-xl md:text-2xl">{data?.content}</p>
          </div>

          <div
            onClick={() => {
              navigate(`/author/${user?.id}`);
            }}
            className="w-2/5 flex py-5"
          >
            <p className="text-black flex gap-5 sm:text-2xl pt-10">
              <img
                className="rounded-full w-20 h-20"
                // src={`${config.apiUrl}/image/${user?.profilePicKey}`}
                src="https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg"
                alt={user?.id}
              />
              <div className="flex flex-col">
                <p>{user?.name}</p>
                <p> {user?.about}</p>
              </div>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;
