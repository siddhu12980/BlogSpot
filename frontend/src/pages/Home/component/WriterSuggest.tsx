import { useNavigate } from "react-router-dom";

interface SuggestionCardProps {
  name: string;
  imageUrl: string;
  description?: string;
  user_id: string;
}

const SuggestionCard = ({
  name,
  imageUrl,
  description,
  user_id,
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
    </div>
  );
};

const WriterSuggest = ({ name, user_id, description,imageUrl }: SuggestionCardProps) => {
  return (
    <div className="p-4 bg-white bg-opacity-45 ">
      <SuggestionCard
        key={name}
        name={name}
        imageUrl={imageUrl}
        description={description}
        user_id={user_id}
      />
    </div>
  );
};

export default WriterSuggest;
