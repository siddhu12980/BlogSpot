import { useCallback, useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import config from "../../utils/config";
import { queryClient } from "../../App";

//add profile pic change feature
interface UserProps {
  name: string;
  id?: string;
  followers: number;
  badges: string[];
  description: string;
  lists: {
    title: string;
    id: string;
    content: string;
    published: boolean;
    authorId: string;
    userId: string;
    createdAt: string;
    rating: number;
    tag: string[];
    post_banner: string;
  }[];
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
  Followed_user_Id,
}: UserProps) => {
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState(description);
  const [pp, setpp] = useState<File | null>(null);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    const url = `${config.apiUrl}/api/v1/user/about`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ about: newBio }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Bio updated successfully:", data);
      } else {
        console.error("Failed to update bio:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating bio:", error);
    } finally {
      setIsEditing(false);
    }
  }, [newBio]);

  const handleFollowClick = useCallback(async () => {
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
        console.log(await response.json());
        console.log("Followed User");
      } else {
        console.error("Failed to follow user:", response.statusText);
      }
      queryClient.invalidateQueries({ queryKey: [] });
    } catch (error) {
      console.error("Error following user:", error);
    }
  }, []);

  const fillFollowerData = useCallback(async () => {
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
        const followedUsersData = data.followedUsersData.map(
          (user: {
            id: string;
            name: string;
            followerCount: number;
            profilePicKey: string;
          }) => ({
            id: user.id,
            name: user.name,
            count: user.followerCount,
            profilePicKey: user.profilePicKey,
          })
        );
        setFollowedUsers(followedUsersData);
      } else {
        console.error("Failed to fetch follower data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching follower data:", error);
    }
  }, [id]);

  const handelProfileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setpp(selectedFile);

      console.log(selectedFile);
      await handleSubmitProfile(pp || selectedFile);
    } else {
      console.log("No image changed");
    }
  };

  const handleImageUpload = async (file: File) => {
    const url = `${config.apiUrl}/upload`;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const res = await response.json();
        const data = res["image"].url;
        const key = data.split("/").pop();
        console.log(`Image uploaded successfully: ${file.name}`);
        console.log("Image key:", key);
        return key;
      } else {
        console.error("Upload failed:", response.statusText);
        return "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  const handleSubmitProfile = async (file: File) => {
    if (!file) {
      console.warn("No image selected.");
      return;
    }

    const key: string = await handleImageUpload(file);
    console.log("Profile pic key:", key);

    if (key) {
      try {
        const response = await fetch(`${config.apiUrl}/api/v1/user/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ profilePicKey: key }),
        });

        if (response.ok) {
          console.log("Profile updated successfully");
          setProfilePicUrl(`${config.apiUrl}/image/${key}`);
        } else {
          console.error("Profile update failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  useEffect(() => {
    setProfilePicUrl(`${config.apiUrl}/image/${ProfileKEy}`);
    fillFollowerData();
  }, [ProfileKEy, fillFollowerData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <img
            src={profilePicUrl || "https://i.imgur.com/V1iU36A.jpg"}
            alt={name}
            className="w-24 h-24 border border-x-cyan-100 rounded-full"
          />
          {localStorage.getItem("userId") == id ? (
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
              <label htmlFor="file-input-profile">
                <FiEdit size={22} className="text-blue-500 cursor-pointer" />
              </label>
              <input
                id="file-input-profile"
                type="file"
                onChange={handelProfileChange}
                className="hidden"
              />
            </div>
          ) : (
            <></>
          )}
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

        {id !== localStorage.getItem("userId") && (
          <button
            onClick={handleFollowClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            {Followed_user_Id.some((user) => user === id)
              ? "UnFollow"
              : "Follow"}
          </button>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Following</h2>
        {followedUsers.length == 0 ? (
          <p className="pt-2">Now Followed Users</p>
        ) : (
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
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Favourite Blogs</h2>
        {lists.length == 0 ? (
          <p className="pt-2"> No Favourite Blogs Saved</p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {lists.map((list) => (
              <li
                key={list.id}
                onClick={() => {
                  window.location.href = `/blog/${list.id}`;
                }}
                className="bg-white rounded-md shadow-md p-4"
              >
                <img
                  src={
                    list.post_banner != ""
                      ? `${config.apiUrl}/image/${list.post_banner}`
                      : "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png"
                  }
                  alt={list.title}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />

                <h3 className="text-lg font-bold">{list.title}</h3>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
