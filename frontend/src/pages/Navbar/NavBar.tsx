import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useState, useRef, useEffect } from "react";
import { searchprops } from "../../types/interfaces";


export const NavBar = ({ onSearch }: searchprops) => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileOptionClick = (option: string) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    if (option === "profile") {
      navigate(`/author/${userId}`);
    } else if (option === "logout") {
      localStorage.clear();
      navigate("/signin");
    }

    setIsProfileDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white text-black p-2 sticky top-0">
      <div className="flex justify-between">
        <div className="font-extrabold flex text-2xl">
          <div
            onClick={() => navigate(`/home`)}
            className="pt-3.5 cursor-pointer"
          >
            BlogSpot
          </div>
          <div>
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
        <div className="flex py-2">
          <div className="mr-4 py-1">
            <Link to={"/blog"}>
              <FiEdit size={25} />
            </Link>
          </div>
          <div className="mr-4 py-1">
            <IoNotificationsOutline size={30} />
          </div>
          <div className="relative py-1">
            <CgProfile
              size={30}
              onClick={handleProfileClick}
              className="cursor-pointer"
            />
            {isProfileDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg"
              >
                <div
                  onClick={() => handleProfileOptionClick("profile")}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                >
                  View Profile
                </div>
                <div
                  onClick={() => handleProfileOptionClick("logout")}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
