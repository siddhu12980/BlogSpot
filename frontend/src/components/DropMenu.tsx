import { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

const DropMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (!event.target.closest(".relative")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative inline-block text-left">
        <div>
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex w-full justify-center gap-x-1.5 outline-none  bg-white px-2 py-2 text-sm    hover:bg-gray-50"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            <FaEllipsisV size={18} className="text-gray-600" />
          </button>
        </div>

        {isOpen && (
          <div
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              <a
                tabIndex={-1}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                id="menu-item-0"
              >
                Edit
              </a>
              <a
                tabIndex={-1}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                id="menu-item-1"
              >
                Not Intrested
              </a>
            </div>
            <div className="py-1" role="none">
              <a
                tabIndex={-1}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                id="menu-item-2"
              >
                Archive
              </a>
              <a
                tabIndex={-1}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                id="menu-item-3"
              >
                Save for later
              </a>
            </div>
            <div className="py-1" role="none">
              <a
                tabIndex={-1}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                id="menu-item-4"
              >
                Share
              </a>
              <a
                tabIndex={-1}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                id="menu-item-5"
              >
                Add to favorites
              </a>
            </div>
            <div className="py-1" role="none">
              <a
                tabIndex={-1}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                id="menu-item-6"
              >
                Delete
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DropMenu;
