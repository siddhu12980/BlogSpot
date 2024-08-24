import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import config from "../../utils/config";

interface UserProps {
  name: string;
  id?: string;
  followers: number;
  badges: string[];
  description: string;
  lists: { title: string; count: number }[];
  ProfileKEy: string;
  Followed_user_Id: string[];
}

interface FollowedUser {
  id: string;
  name: string;
  count: number;
  profilePicKey: string;
}

export const Profile = ({
  id,
  name,
  followers,
  badges,
  description,
  lists,
  ProfileKEy,
}: UserProps) => {
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState(description);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    console.log("New bio submitted:", newBio);

    const url = `${config.apiUrl}/api/v1/user/about`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          about: newBio,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Bio updated successfully:", data);
      } else {
        console.error("Failed to update bio:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating bio:", error);
    }

    setIsEditing(false); // Exit edit mode
  };

  const handleFollowClick = async () => {
    const url = `${config.apiUrl}/api/v1/user/follow/${id}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        console.log("Followed User");
        fillFollowerData(); // Refresh the follower data after following
      } else {
        console.error("Failed to follow user:", response.statusText);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const fillFollowerData = async () => {
    const url = `${config.apiUrl}/api/v1/user/profilelist/${id}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        const followedUsersData = data.followedUsersData.map((user: any) => ({
          id: user.id,
          name: user.name,
          count: user.followerCount,
          profilePicKey: user.profilePicKey,
        }));

        setFollowedUsers(followedUsersData);
      } else {
        console.error("Failed to fetch follower data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching follower data:", error);
    }
  };

  useEffect(() => {
    setProfilePicUrl(`${config.apiUrl}/image/${ProfileKEy}`);
    fillFollowerData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <img
            onClick={() => console.log("Change Author Profile Picture")}
            src={profilePicUrl || "https://i.imgur.com/V1iU36A.jpg"}
            alt={name}
            className="w-24 h-24 rounded-full"
          />
          <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
            <FiEdit className="text-blue-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-4">{name}</h1>
        <p className="text-gray-600 text-lg mt-2">{followers} Followers</p>
        <div className="flex gap-2 mt-4">
          {badges.map((badge) => (
            <span
              key={badge}
              className="bg-blue-100 text-blue-500 font-medium text-sm px-2 py-1 rounded-full"
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="flex items-center mt-4">
          {id === localStorage.getItem("userId") && !isEditing && (
            <FiEdit
              className="text-gray-500 cursor-pointer mr-2"
              onClick={handleEditClick}
            />
          )}
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="text"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 mr-2"
              />
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          ) : (
            <p className="text-gray-700">{description}</p>
          )}
        </div>

        {id !== localStorage.getItem("userId") ? (
          <button
            onClick={handleFollowClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            {followedUsers.some((user) => user.id === id) ? (
              <>UnFollow</>
            ) : (
              <>Follow</>
            )}
          </button>
        ) : null}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Following</h2>
        <ul className="mt-4">
          {followedUsers.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center py-2"
            >
              <div className="flex items-center">
                <img
                  src={
                    `${config.apiUrl}/image/${user.profilePicKey}` ||
                    "https://i.imgur.com/V1iU36A.jpg"
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-gray-800">{user.name}</span>
              </div>
              <span className="text-gray-600">{user.count} Followers</span>
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
                src={"https://i.imgur.com/V1iU36A.jpg"} // Reuse the profilePicUrl
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
