const WriteMed = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Recommended topics</h2>
      <div className="flex flex-wrap gap-2">
        <button className="bg-gray-100 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Nodejs
        </button>
        <button className="bg-gray-100 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Philosophy
        </button>
        <button className="bg-gray-100 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          DeFi
        </button>
        <button className="bg-gray-100 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          UI
        </button>
        <button className="bg-gray-100 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          NLP
        </button>
        <button className="bg-gray-100 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Economics
        </button>
        <button className="bg-gray-100 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          World
        </button>
      </div>
      <a href="#" className="text-blue-500 hover:underline mt-4">
        See more topics
      </a>
    </div>
  );
};

export default WriteMed;
