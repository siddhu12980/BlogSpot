import { RxAvatar } from "react-icons/rx";

const Blog = () => {
  const data = {
    title: "This is a dummy blog title , that was ment to be long",
    content:
      "The rapid pace of technological advancements has transformed the way we live and work. The rapid pace of technological advancements has transformed the way we live and The rapid pace of technological advancements has transformed the way we live and workThe rapid pace of technological advancements has transformed the way we live and work  The rapid pace of technological advancements has transformed the way we live and workThe rapid pace of technological advancements has transformed the way we live and workThe rapid pace of technological advancements has transformed the way we live and workThe rapid pace of technological advancements has transformed the way we live and workThe rapid pace of technological advancements has transformed the way we live and workThe rapid pace of technological advancements has transformed the way we live and workThe rapid pace of technological advancements has transformed the way we live and workThe rapid pace of technological advancements has transformed the way we live and workThe rapid pace of technological advancements has transformed the way we live and work The rapid pace of technological advancements has transformed the way we live and workThe rapid pace of technological advancements has transformed the way we live and workThe rapid pace of technological advancements has transformed the way we live and work      \n  \n \nwork.From artificial intelligence and machine learning to the Internet of Things (IoT) and cloud computing, innovative technologies are revolutionizing industries and improving our daily lives. With the rise of 5G networks and edge computing, we can expect even faster and more seamless interactions with our devices and the world around us. As technology continues to evolve, it's exciting to think about the possibilities that the future holds - from smart cities and autonomous vehicles to personalized healthcare and beyond ",
    author: "User 1 ",
    date: "June 12",
    authorData: "this is the author data",
  };

  return (
    <>
      <div className="h-full w-full p-10 bg-slate-300 flex flex-row justify-between items-start ">
        <div className="w-3/5">
          <h1 className="sm:text-5xl py-5 font-extrabold">{data.title}</h1>
          <p className="text-gray-600 text-opacity-90 py-3">
            {" "}
            Publish at {data.date}
          </p>
          <p className="sm:text-xl md:text-2xl">{data.content}</p>
        </div>
        <div className="w-2/5 flex flex-col items-center py-5">
          <p className="text-black sm:text-2xl py-5  ">Author:</p>

          <div className="flex ">
            <div>
              <RxAvatar size={20} />
            </div>

            <div className="px-2">
              <p className="font-bold">{data.author}</p>
              <p className="text-gray-600">{data.authorData}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
