import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

export const NavBar = () => {
  const nagivate = useNavigate();
  return (
    <>
      <nav className="bg-white text-black p-2 sticky top-0">
        <div className="flex justify-between">
          <div className="font-extrabold flex text-2xl">
            <div  onClick={() => nagivate(`/home`)} className="pt-3.5 cursor-pointer">
              BlogSpot
            </div>
            <div>
              <SearchBar />
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
            <div className="py-1">
              <CgProfile size={30} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
