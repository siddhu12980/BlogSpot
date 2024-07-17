const Blog = () => {
  const data = {
    title: "This is a dummy blog title , that was ment to be long",
    content:
      "The rapid pace of technological advancements has transformed the way we live and work. From artificial intelligence and machine learning to the Internet of Things (IoT) and cloud computing, innovative technologies are revolutionizing industries and improving our daily lives. With the rise of 5G networks and edge computing, we can expect even faster and more seamless interactions with our devices and the world around us. As technology continues to evolve, it's exciting to think about the possibilities that the future holds - from smart cities and autonomous vehicles to personalized healthcare and beyond ",
    author: "User 1 ",
    date: "June 12",
  };

  return (
    <>
      <div className=" h-screen w-full p-10  bg-slate-400 flex flex-row justify-between items-center">
        <div className="w-3/5">
          <div className=" sm:text-5xl py-5 font-extrabold ">{data.title}</div>
          <div className=" text-opacity-30 py-3   text-gray-900">
            Posted on {data.date}
          </div>
          <div className="sm:text-xl md:text-2xl ">{data.content}</div>
        </div>
        <div className="w-2/5">
          <div>author</div>
          <div>{data.author}</div>
        </div>
      </div>
    </>
  );
};

export default Blog;
