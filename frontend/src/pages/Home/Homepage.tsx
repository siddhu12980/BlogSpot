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

interface BlogData {
  id: string;
  post_id: string;
  name: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

interface Item {
  id: string;
  post_id: string;
  name: string;
  title: string;
  content: string;
  imageUrl: string;
  description: string;
  published: boolean;
  link: string;
  createdAt: string;
}

const Topic_list = ["science", "programming", "arts", "technology"];

type Data = Item[][];

export const Homepage = () => {
  const [data, setData] = useState<Data>([]);
  const [realData, setRealData] = useState<BlogData[]>([]);
  const [topData, setTopData] = useState<Data>([]);
  const [realTopData, setRealTopData] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allResponse, topResponse, nameResponse] = await Promise.all([
          fetch(`${config.apiUrl}/api/v1/all`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }),
          fetch(`${config.apiUrl}/api/v1/all/top`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }),
          fetch(`${config.apiUrl}/api/v1/all/name`, {
            method: "GET",
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
        setError("Failed to fetch data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      id: item[0].id,
      name: item[0].name,
      post_id: item[1].id,
      title: item[1].title,
      content: item[1].content,
      published: item[1].published,
      createdAt: item[1].createdAt,
    }));
  }, [data]);

  const transformedDataTop = useMemo(() => {
    if (!topData || topData.length === 0) return [];
    return topData.map((item) => ({
      id: item[0].id,
      name: item[0].name,
      post_id: item[1].id,
      title: item[1].title,
      content: item[1].content,
      published: item[1].published,
      createdAt: item[1].createdAt,
    }));
  }, [topData]);

  useEffect(() => {
    setRealData(transformedData);
    setRealTopData(transformedDataTop);
    console.log(transformedDataTop);
  }, [transformedData, transformedDataTop]);

  const fetchPostsByTopic = useCallback(async (topic: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.apiUrl}/api/v1/all/filter?category=${topic}`,
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
      setError("Failed to fetch posts by topic");
      console.error("Error fetching posts by topic:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="w-full bg-white flex flex-col lg:flex-row justify-center items-start">
        <div className="bg-white h-full w-full lg:w-[80%] lg:mx-auto lg:pl-[8%] lg:pr-[2%]">
          <div className="py-5">
            <nav className="bg-white text-sm font-normal text-black p-2 sticky top-0">
              <ul className="flex justify-evenly">
                <li>
                  <FaPlus />
                </li>
                {Topic_list.map((topic, index) => (
                  <li
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
            ) : (
              realData.map((item, index) => (
                <BlogFeedItem
                  key={index}
                  post_id={item.post_id}
                  id={item.id}
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
              <h1>Top Blogs</h1>
              <div>
                {loading ? (
                  <div className="flex flex-col gap-4">
                    <BlogSidebarSkeleton />
                    <BlogSidebarSkeleton />
                  </div>
                ) : (
                  realTopData.map((item, index) => (
                    <BlogSidebar
                      user_id={item.id}
                      post_id={item.post_id}
                      key={index}
                      username={item.name}
                      title={item.title}
                      book="The Great Gatsby"
                      profilePic="https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png"
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
          <div>
            {loading ? (
              <div className="flex flex-col gap-4">
                <WriterSuggestSkeleton />
                <WriterSuggestSkeleton />
              </div>
            ) : (
              realTopData.map((item, index) => (
                <WriterSuggest
                  key={index}
                  name={item.name}
                  imageUrl="https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png"
                  description="The Great Gatsby"
                  user_id={item.id}
                  onFollow={() => {
                    console.log("Followed John Smith");
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
