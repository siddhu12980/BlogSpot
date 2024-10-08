import { useEffect, useState, useMemo, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import config from "../../utils/config";
import { NavBar } from "../Navbar/NavBar";
import BlogFeedItem from "./component/BlogFeedItem";
import BlogSidebar from "./component/BlogSidebar";
import MediumModal from "./MediumModal";
import RecommendedTopics from "./component/RecommendedTopics";
import WriterSuggest from "./component/WriterSuggest";
import BlogFeedItemSkeleton from "./skeleton/BlogFeedItemSkeleton";
import BlogSidebarSkeleton from "./skeleton/BlogSidebarSkeleton";
import WriterSuggestSkeleton from "./skeleton/WriterSuggestSkeleton";
import Fuse from "fuse.js";
import { BlogData, Item } from "../../types/interfaces";

const Topic_list = ["science", "programming", "arts", "technology"];

type Data = Item[][];

export const Homepage = () => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [data, setData] = useState<Data>([]);
  const [realData, setRealData] = useState<BlogData[]>([]);
  const [topData, setTopData] = useState<Data>([]);
  const [realTopData, setRealTopData] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fuseOptions = {
    keys: ["title", "content"],
  };

  const handleSearch = (debouncedSearchTerm: string) => {
    if (debouncedSearchTerm && realData.length != 0) {
      const fuse = new Fuse(realData, fuseOptions);

      const results = fuse.search(debouncedSearchTerm).map(({ item }) => item);
      setRealData(results);
    } else {
      setRealData(transformedData);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      window.location.href = "/signin";
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [allResponse, topResponse, nameResponse] = await Promise.all([
          fetch(`${config.apiUrl}/api/v1/blog/all`, {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }),
          fetch(`${config.apiUrl}/api/v1/blog/top`, {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }),
          fetch(`${config.apiUrl}/api/v1/user/name`, {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }),
        ]);

        const [allData, topData, nameData] = await Promise.all([
          allResponse.json(),
          topResponse.json(),
          nameResponse.json(),
        ]);


        setData(allData);
        setTopData(topData);
        localStorage.setItem("userId", nameData.id);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const transformedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      id: item[0].id,
      about: item[0].about,
      name: item[0].name,
      profilePicKey: item[0].profilePicKey,
      post_id: item[1].id,
      title: item[1].title,
      content: item[1].content,
      published: item[1].published,
      createdAt: item[1].createdAt,
      post_banner: item[1].post_banner,
    }));
  }, [data]);

  const transformedDataTop = useMemo(() => {
    if (!topData || topData.length === 0) return [];
    return topData.map((item) => ({
      id: item[0].id,
      about: item[0].about,
      name: item[0].name,
      profilePicKey: item[0].profilePicKey,
      post_id: item[1].id,
      title: item[1].title,
      content: item[1].content,
      published: item[1].published,
      createdAt: item[1].createdAt,
      post_banner: item[1].post_banner,
    }));
  }, [topData]);

  useEffect(() => {
    setRealData(transformedData);
    setRealTopData(transformedDataTop);
  }, [transformedData, transformedDataTop]);

  const fetchPostsByTopic = useCallback(async (topic: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.apiUrl}/api/v1/blog/filter?category=${topic}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching posts by topic:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <div>
        <NavBar onSearch={handleSearch} />
      </div>
      <div className="w-full bg-white flex flex-col lg:flex-row justify-center items-start">
        <div className="bg-white h-full w-full lg:w-[80%] lg:mx-auto lg:pl-[8%] lg:pr-[2%]">
          <div className="py-5">
            <nav className="bg-white border-b-2 pb-4 shadow-md text-sm font-normal text-black p-2 sticky top-0">
              <ul className="flex justify-evenly">
                <li>
                  <FaPlus onClick={() => setRealData(transformedData)} />
                </li>
                <li onClick={() => setRefresh(!refresh)}>All</li>
                {Topic_list.map((topic, index) => (
                  <li
                    className=" cursor-pointer"
                    onClick={() => fetchPostsByTopic(topic.toLowerCase())}
                    key={index}
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="items-end">
            {loading ? (
              <div className="flex flex-col gap-4">
                <BlogFeedItemSkeleton />
                <BlogFeedItemSkeleton />
              </div>
            ) : realData.length === 0 ? (
              <div className="text-center text-gray-500">No blogs found</div>
            ) : (
              realData.map((item, index) => (
                <BlogFeedItem
                  profilePicKey={item.profilePicKey}
                  post_banner={item.post_banner}
                  key={index}
                  id={item.post_id}
                  authorId={item.id}
                  user={item.name}
                  title={item.title}
                  blogContent={item.content}
                  createdAt={item.createdAt}
                />
              ))
            )}
          </div>
        </div>
        <div className="bg-white py-5 w-full lg:w-[80%] lg:mx-auto lg:pr-[8%] lg:pl-[2%] hidden lg:block">
          <div className="flex flex-col">
            <div>
              <h1 className="  text-2xl pb-4">Top Blogs</h1>
              <div className="flex flex-col gap-4">
                {loading ? (
                  <div className="flex flex-col gap-4">
                    <BlogSidebarSkeleton />
                    <BlogSidebarSkeleton />
                  </div>
                ) : (
                  realTopData.map((item, index) => (
                    <BlogSidebar
                    profilePic={item.profilePicKey}
                                          user_id={item.id}
                      post_id={item.post_id}
                      key={index}
                      username={item.name}
                      title={item.title}
                      book={item.about}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="py-4">
            <MediumModal />
          </div>
          <div>
            <RecommendedTopics />
          </div>
          <h2 className="text-xl font-bold mb-4 p-4">Who to follow</h2>

          <div className=" flex flex-col gap-4">
            {loading ? (
              <div className="flex flex-col gap-4">
                <WriterSuggestSkeleton />
                <WriterSuggestSkeleton />
              </div>
            ) : (
              [
                ...new Set(
                  realTopData
                    .filter(
                      (item) => item.id !== localStorage.getItem("userId")
                    )
                    .map((item) => item.id)
                ),
              ].map((id, index) => {
                const item = realTopData.find((item) => item.id === id);
                return (
                  <WriterSuggest
                    key={index}
                    name={item!.name}
                    imageUrl={
                      item?.profilePicKey != null
                        ? item?.profilePicKey
                        : "https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg"
                    }
                    description={item?.about}
                    user_id={item?.id || ""}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};
