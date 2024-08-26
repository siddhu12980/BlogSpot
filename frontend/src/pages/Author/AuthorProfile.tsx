import { useParams } from "react-router-dom";
import config from "../../utils/config";
import { NavBar } from "../Navbar/NavBar";
import AuthorComponent from "./component/AuthorComponent";
import AuthorNav from "./component/AuthorNav";
import BlogFeedItem from "../Home/component/BlogFeedItem";
import Profile from "../Profile/Profile";
import BlogFeedItemSkeleton from "../Home/skeleton/BlogFeedItemSkeleton";
import { useQuery } from "@tanstack/react-query";

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

interface SavedPostData {
  title: string;
  id: string;
  content: string;
  published: boolean;
  authorId: string;
  userId: string;
  createdAt: string;
  rating: number;
  tag: string[];
}

const fetchAuthorData = async (id: string) => {
  const response = await fetch(`${config.apiUrl}/api/v1/user/author/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result = await response.json();

  return result;
};

const fetchSavedPosts = async (userId: string) => {
  const response = await fetch(`${config.apiUrl}/api/v1/blog/saved-posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const res = await response.json();

  if (!res || !res.savedPosts) {
    console.log("No saved posts found.");
    return [];
  }

  const transformedData = res.savedPosts.map((post) => ({
    title: post.title,
    ...post,
  }));

  return transformedData;
};

const fetchFollowedUsers = async () => {
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
    return [];
  }

  const data: string[] = res.followedUsers.map(
    (user: { followingId: string }) => user.followingId
  );
  return data;
};

export const AuthorProfile = () => {
  const { id } = useParams<string>();

  const {
    data: authorData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
  } = useQuery<{ author: AuthorData; posts: BlogData[] }>({
    queryKey: ["author", id],
    queryFn: () => fetchAuthorData(id!),
  });

  

  const {
    data: savedPostData = [],
    isLoading: isSavedLoading,
    isError: isSavedError,
  } = useQuery<SavedPostData[]>({
    queryKey: ["savedPosts", id],
    queryFn: () => fetchSavedPosts(id!),
  });

  const {
    data: followedUsersData = [],
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useQuery<string[]>({
    queryKey: ["search"],
    queryFn: fetchFollowedUsers,
  });

  const isLoading = isUserDataLoading || isSavedLoading || isSearchLoading;
  const isError = isUserDataError || isSavedError || isSearchError;

  if (isLoading) {
    return (
      <div>
        <BlogFeedItemSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div>Error occurred while fetching data.</div>;
  }

  if (!authorData) {
    return <div>No author data available.</div>;
  }

  return (
    <>
      <NavBar />
      <div className="w-full bg-white flex flex-col lg:flex-row justify-center items-start">
        {/* Left Content */}
        <div className="bg-white h-full w-full lg:w-[40%] lg:ml-[15%] lg:mr-[5%]">
          <div className="py-5">
            <AuthorComponent
              BannerKey={authorData.author.bannerPicKey}
              id={id || ""}
            />
            <AuthorNav />
          </div>

          {!!authorData.posts.length && (
            <div className="mt-8">
              {authorData.posts.map((item) => (
                <BlogFeedItem
                  key={item.id}
                  post_id={item.post_id}
                  id={item.id}
                  user={authorData.author.name || "Unknown"}
                  title={item.title}
                  blogContent={item.content}
                  createdAt={item.createdAt}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white py-5 w-full lg:w-[30%] lg:mr-[15%] lg:ml-[5%] hidden lg:block">
          <div className="flex flex-col space-y-6">
            <Profile
              Followed_user_Id={followedUsersData}
              ProfileKEy={authorData.author.profilePicKey}
              id={id}
              name={authorData.author.name}
              followers={followedUsersData.length}
              badges={authorData.author.tagsLiked}
              description={authorData.author.about}
              lists={savedPostData}
            />
          </div>
        </div>
      </div>
    </>
  );
};
