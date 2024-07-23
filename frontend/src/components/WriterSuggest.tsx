// Import React

// Define the SuggestionCardProps interface
interface SuggestionCardProps {
  name: string;
  imageUrl: string;
  description?: string;
  link?: string;
  isPublication?: boolean;
  onFollow: () => void;
}

// Define the SuggestionCard functional component
const SuggestionCard = ({
  name,
  imageUrl,
  description,
  link,
  isPublication,
  onFollow,
}: SuggestionCardProps) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">{name}</h3>
          {isPublication && (
            <span className="text-xs text-gray-500">Publication</span>
          )}
        </div>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
        {link && (
          <a href={link} className="text-blue-500 text-sm">
            {link}
          </a>
        )}
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

// Define the WriterSuggest functional component
const WriterSuggest = ({
  suggestions,
}: {
  suggestions: SuggestionCardProps[];
}) => {
  const handleFollow = (name: string) => {
    console.log(`Following ${name}`);
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Who to follow</h2>
      {suggestions.map((suggestion) => (
        <SuggestionCard
          key={suggestion.name}
          {...suggestion}
          onFollow={() => handleFollow(suggestion.name)}
        />
      ))}
      <button className="mt-4 px-4 py-2 text-blue-500 bg-gray-100 rounded-md">
        See more suggestions
      </button>
    </div>
  );
};

export default WriterSuggest;
