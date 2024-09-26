import { useCallback, useEffect, useState } from "react";
import {  FiEdit } from "react-icons/fi";
import config from "../../utils/config";
import { queryClient } from "../../App";
import uploadImage from "../../helpers/uploder";
import { toast, Toaster } from "sonner";
import { MdDelete } from "react-icons/md";

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
    post_banner: string | null;
  }[];
  ProfileKEy: string | null;
  Followed_user_Id: string[];
}

interface FollowedUser {
  id: string;
  name: string;
  count: number;
  profilePicKey: string | null;
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
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState(description);


const handleSavePostDelete = async (id:string) => {
  try{
    const url = `${config.apiUrl}/api/v1/user/savedpost/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      toast.success("Post Deleted");
    queryClient.invalidateQueries({ queryKey: ["savedPosts"] });

    } else {
      console.error("Failed to delete post:", response.statusText);
      toast.error("Failed to delete post");
    }
  }
  catch (error) {
    console.error("Error deleting post:", error);
  }

}




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
        toast.success("Bio updated successfully");
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
        toast.success("User followed  successfully");
      } else {
        console.error("Failed to follow user:", response.statusText);
        toast.error("Failed to follow user");
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

      console.log("selected Files", selectedFile);
      await HandleProfileUpload(selectedFile);
    } else {
      console.log("No image changed");
    }
  };

  const HandleProfileUpload = async (file: File) => {
    const userId = localStorage.getItem("userId") || "";
    if (!userId) {
      console.error("User not logged in");
      window.location.href = "/signin";
      return;
    }
    uploadImage(file, (imageUrl: string) => {
      if (!imageUrl) {
        toast.error("Image Upload Failed");
        return;
      }

      uploadProfileKey(imageUrl);
    }, (errorMessage: string) => {
      toast.error(errorMessage);
    }
    );
  };

  const uploadProfileKey = async (key: string) => {
    const url = `${config.apiUrl}/api/v1/user/profile`;


    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        profilePicKey: key,
        userId: localStorage.getItem("userId"),
      }),
    });

    const result = await response.json();


    if (response.ok) {
      toast.success("Profile Picture Updated");
    } else {
      toast.error("Profile Picture Update Failed");
      console.error("Error:", result.error);
    }
  };

  useEffect(() => {
    fillFollowerData();
  }, [ProfileKEy, fillFollowerData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <img
            src={
              ProfileKEy != null
                ? ProfileKEy
                : "https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg"
            }
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
                      user.profilePicKey != null
                        ? user.profilePicKey
                        : "https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg"
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
      <div className="mt-8 px-4 sm:px-6 lg:px-8   w-full">
        <h2 className="text-2xl font-bold mb-4">Favourite Blogs</h2>

        {lists.length === 0 ? (
          <p className="pt-2 text-gray-500">No Favourite Blogs Saved</p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {lists.map((list) => (
              <li
                key={list.id}
               
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 cursor-pointer"
              >
                <div className=" w-full">
                <img

onClick={() => {
  window.location.href = `/blog/${list.id}`;
}}

                
                  src={
                    list.post_banner ||
                    "https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png"
                  }
                  alt={list.title}
                  className="w-full h-32 sm:h-40 object-cover rounded-md mb-3"
                />
                <div className=" flex flex-col md:flex-row  justify-between  ">
                <h3 className="text-lg font-semibold text-gray-800">
                  {list.title}
                </h3>


                <MdDelete size={22} onClick={()=>{
                  handleSavePostDelete(list.id)
                }}   />

                </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Toaster />
    </div>
  );
};

export default Profile;
