import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <div className="flex items-center ml-2 bg-slate-100 rounded-lg py-2 px-4 w-70">
      <span className="text-gray-500 cursor-pointer">
        <FaSearch size={18} />
      </span>
      <input
        type="search"
        placeholder="Search..."
        className="bg-transparent w-full py-2 px-4 text-gray-700 focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
