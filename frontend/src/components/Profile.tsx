import React from "react";

interface UserProps {
  name: string;
  followers: number;
  badges: string[];
  description: string;
  following: { name: string; count: number }[];
  lists: { title: string; count: number }[];
}

export const Profile = ({
  name,
  followers,
  badges,
  description,
  following,
  lists,
}: UserProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <img
          src="https://i.imgur.com/V1iU36A.jpg"
          alt={name}
          className="w-24 h-24 rounded-full"
        />
        <h1 className="text-2xl font-bold mt-4">{name}</h1>
        <p className="text-gray-600 text-lg mt-2">{followers} Followers</p>
        <div className="flex gap-2 mt-4">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`bg-blue-100 text-blue-500 font-medium text-sm px-2 py-1 rounded-full`}
            >
              {badge}
            </span>
          ))}
        </div>
        <p className="text-gray-700 mt-4">{description}</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
          Follow
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Following</h2>
        <ul className="mt-4">
          {following.map((user) => (
            <li
              key={user.name}
              className="flex justify-between items-center py-2"
            >
              <div className="flex items-center">
                <img
                  src="https://i.imgur.com/V1iU36A.jpg"
                  alt={user.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-gray-800">{user.name}</span>
              </div>
              <span className="text-gray-600">{user.count}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Lists</h2>
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {lists.map((list) => (
            <li key={list.title} className="bg-white rounded-md shadow-md p-4">
              <img
                src="https://i.imgur.com/V1iU36A.jpg"
                alt={list.title}
                className="w-full h-24 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-bold">{list.title}</h3>
              <p className="text-gray-600">{list.count} stories</p>
            </li>
          ))}
        </ul>
      </div>
      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
        View All
      </button>
    </div>
  );
};

export default Profile;
