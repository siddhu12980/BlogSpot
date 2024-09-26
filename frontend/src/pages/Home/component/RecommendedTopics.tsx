import { useState } from "react";
interface topicType {
  id: number;
  name: string;
}
const RecommendedTopics = () => {
  const [selectedTopic, setSelectedTopic] = useState({});
  const topics = [
    { id: 1, name: "Science" },
    { id: 2, name: "Food" },
    { id: 3, name: "Health" },
    { id: 4, name: "Technology" },
    { id: 5, name: "Travel" },
    // Add more topics as needed
  ];

  const handleTopicClick = (topic: topicType) => {
    setSelectedTopic(topic);
  };

  return (
    <div className="max-w-md  p-4">
      <h2 className="  text-lg font-bold mb-2">Recommended Topics</h2>
      <div className="flex flex-wrap justify-start   text-sm">
        {topics.map((topic) => (
          <button
            key={topic.id}
            className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 mx-2  rounded-xl px-4 my-2 ${
              selectedTopic === topic ? "bg-gray-400 text-white" : ""
            }`}
            onClick={() => handleTopicClick(topic)}
          >
            {topic.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecommendedTopics;
