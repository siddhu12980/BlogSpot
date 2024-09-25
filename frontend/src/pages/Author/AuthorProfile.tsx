import { useParams } from "react-router-dom";
import config from "../../utils/config";
import { NavBar } from "../Navbar/NavBar";
import AuthorComponent from "./component/AuthorComponent";
import AuthorNav from "./component/AuthorNav";
import BlogFeedItem from "../Home/component/BlogFeedItem";
import Profile from "../Profile/Profile";
import BlogFeedItemSkeleton from "../Home/skeleton/BlogFeedItemSkeleton";
import { useQuery } from "@tanstack/react-query";
import { AuthorData, SavedPostData } from "../../types/interfaces";

interface BlogData {
  authorId: string;
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  post_banner: string;
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

  console.log("author details", result);

  return result;
};

const fetchSavedPosts = async (userId: string) => {
  console.log("Fetching saved posts for user", userId);
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
  console.log(" transformed Data ", res.savedPosts.savedPosts);

  const transformedData = res.savedPosts.savedPosts.map((post: BlogData) => ({
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

  console.log("Followed Users", data);
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
      <NavBar
        onSearch={() => {
          console.log("No Search");
        }}
      />
      <div className="w-full bg-white flex flex-col lg:flex-row justify-center items-start">
        {/* Left Content */}
        <div className="bg-white h-full w-full lg:w-[40%] lg:ml-[15%] lg:mr-[5%]">
          <div className="py-5">
            {authorData.author && (
              <>
                <AuthorComponent
                  id={id || ""}
                  name={authorData.author.name || ""}
                />
                <AuthorNav />
              </>
            )}
          </div>

          {!!authorData.posts.length && (
            <div className="mt-8">
              {authorData.posts.map((item) => (
                <BlogFeedItem
                  key={item.id}
                  id={item.id}
                  authorId={item.authorId}
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
            {authorData.author && (
              <Profile
                Followed_user_Id={followedUsersData}
                ProfileKEy=""
                id={id}
                name={authorData.author.name || "Unknown"}
                followers={followedUsersData.length}
                badges={authorData.author.tagsLiked}
                description={authorData.author.about}
                lists={savedPostData}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
