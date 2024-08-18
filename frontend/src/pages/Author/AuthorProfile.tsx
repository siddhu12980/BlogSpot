import { useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";
import config from "../../utils/config";
import BlogFeedItem from "../Home/component/BlogFeedItem";
import { NavBar } from "../Navbar/NavBar";
import { useParams } from "react-router-dom";
import Featured from "../../components/Featured";
import AuthorComponent from "./component/AuthorComponent";
import AuthorNav from "./component/AuthorNav";
import Profile from "../../components/Profile";

interface BlogData {
  id: string;
  post_id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

interface AuthorData {
  id: string;
  name: string;
  email: string;
}
const sampleUserData = {
  name: "Jane Doe",
  followers: 1234,
  badges: ["Top Contributor", "MVP", "Most Active"],
  description:
    "Jane is a passionate software developer with a knack for solving complex problems. She enjoys contributing to open-source projects and mentoring junior developers.",
  following: [
    { name: "Alice Smith", count: 456 },
    { name: "Bob Johnson", count: 789 },
  ],
  lists: [
    { title: "Favorite Blogs", count: 5 },
    { title: "Must-Read Books", count: 3 },
  ],
};

export const AuthorProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState<BlogData[]>([]);
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/api/v1/user/author/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.json();
        setAuthor(result.author);
        setData(result.posts || []);
      } catch (e:any) {
        console.error("Error fetching data:", e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();

    // const fetchuserData = async () => {
    //   try {
    //     const response = await fetch(`${config.apiUrl}/api/v1/all/name`, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     });
    //     const result = await response.json();
    //     localStorage.setItem("userId", result.id);
    //   } catch (e:any) {
    //     console.error("Error fetching data:", e.message);
    //   }
    // }
  }, [id]);

  return (
    <>
      <NavBar />

      <div className="w-full bg-white flex flex-col lg:flex-row justify-center items-start">
        {/* Left Content */}
        <div className="bg-white h-full w-full lg:w-[40%] lg:ml-[15%] lg:mr-[5%]">
          <div className="py-5">
            <AuthorComponent />
            <Featured />
            <AuthorNav />
          </div>

          {/* Blog Feed */}
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <PacmanLoader />
              </div>
            ) : (
              data.map((item, index) => (
                <BlogFeedItem
                  key={item.id}
                  post_id={item.post_id}
                  id={item.id}
                  user={author?.name || "Unknown"}
                  title={item.title}
                  blogContent={item.content}
                  createdAt={item.createdAt}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="bg-white py-5 w-full lg:w-[30%] lg:mr-[15%] lg:ml-[5%] hidden lg:block">
          <div className="flex flex-col space-y-6">
            <Profile
              id={id}
              name={sampleUserData.name}
              followers={sampleUserData.followers}
              badges={sampleUserData.badges}
              description={sampleUserData.description}
              following={sampleUserData.following}
              lists={sampleUserData.lists}
            />
          </div>
        </div>
      </div>
    </>
  );
};
