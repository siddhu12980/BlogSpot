import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import useDebounce from "../../hooks/useDebounce"; // Assuming you have a custom hook for debouncing
import { searchprops } from "../../types/interfaces";


const SearchBar = ({ onSearch }: searchprops) => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="flex items-center ml-2 bg-white rounded-lg py-2 px-4 w-70">
      <span className="text-gray-500 cursor-pointer">
        <FaSearch size={18} />
      </span>
      <input
        type="search"
        placeholder="Search..."
        className="bg-transparent w-full py-2 px-4 text-gray-700 focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
