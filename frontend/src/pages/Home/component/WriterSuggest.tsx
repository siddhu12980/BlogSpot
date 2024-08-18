// Import React

import { useNavigate } from "react-router-dom";

// Define the SuggestionCardProps interface
interface SuggestionCardProps {
  name: string;
  imageUrl: string;
  description?: string;
  user_id: string;
  onFollow?: () => void;
}

// Define the SuggestionCard functional component
const SuggestionCard = ({
  name,
  imageUrl,
  description,
  user_id,

  onFollow,
}: SuggestionCardProps) => {
  const navigation = useNavigate();
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <div
        onClick={() => navigation(`/author/${user_id}`)}
        className="flex flex-col"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">{name}</h3>

          <span className="text-xs text-gray-500">Publication</span>
        </div>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>
      <button
        className="ml-auto px-4 py-2 text-white bg-blue-500 rounded-md"
        onClick={onFollow}
      >
        Follow
      </button>
    </div>
  );
};

const WriterSuggest = ({
  name,
  user_id,
  description,
  onFollow,
}: SuggestionCardProps) => {
  // const handleFollow = (name: string) => {
  //   console.log(`Following ${name}`);
  // };

  return (
    <div className="p-4 bg-white bg-opacity-45 ">
      <h2 className="text-xl font-bold mb-4">Who to follow</h2>

      <SuggestionCard
        key={name}
        name={name}
        imageUrl="https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png"
        description={description}
        onFollow={onFollow}
        user_id={user_id}
      />
      <button className="mt-4 px-4 py-2 text-blue-500 bg-gray-100  rounded-md">
        See more suggestions
      </button>
    </div>
  );
};

export default WriterSuggest;
