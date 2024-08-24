import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import config from "../../utils/config";
import { NavBar } from "../Navbar/NavBar";
import AuthorComponent from "./component/AuthorComponent";
import Featured from "../Home/Featured";
import AuthorNav from "./component/AuthorNav";
import BlogFeedItem from "../Home/component/BlogFeedItem";
import Profile from "../Profile/Profile";

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
  about: string;
  profilePicKey: string;
  tagsLiked: string[];
  bannerPicKey: string;
}

const sampleUserData = {
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
  const [followedUser, setFollowedUser] = useState<string[]>([]);
  const [data, setData] = useState<BlogData[]>([]);
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const searchFollower = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/v1/user/relation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const res = await response.json();

      if (!res || !res.followedUsers) {
        console.log("No followed users found.");
        return;
      }

      const data = res.followedUsers.map(
        (user: { followingId: string }) => user.followingId
      );

      setFollowedUser(data);
    } catch (e) {
      console.error("Error fetching followed users:", e.message);
    }
  };

  useEffect(() => {
    searchFollower();

  }, [id]);

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
      } catch (e) {
        console.error("Error fetching data:", e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  return (
    <>
      <NavBar />

      <div className="w-full bg-white flex flex-col lg:flex-row justify-center items-start">
        {/* Left Content */}
        <div className="bg-white h-full w-full lg:w-[40%] lg:ml-[15%] lg:mr-[5%]">
          <div className="py-5">
            <AuthorComponent BannerKey={author?.bannerPicKey || ""} />
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
              Followed_user_Id={followedUser}
              ProfileKEy={author?.profilePicKey || ""}
              id={id}
              name={author?.name || "Unknown"}
              followers={followedUser.length}
              badges={author?.tagsLiked || []}
              description={author?.about || "No description available."}
              lists={sampleUserData.lists}
            />
          </div>
        </div>
      </div>
    </>
  );
};
