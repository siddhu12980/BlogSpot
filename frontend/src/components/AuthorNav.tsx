import React from "react";

export const AuthorNav = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" className="font-bold text-lg">
          Brad Yonaka
        </a>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Books
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Lists
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              About
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default AuthorNav;
