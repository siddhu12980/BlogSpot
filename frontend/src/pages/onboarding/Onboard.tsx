import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import config from "../../utils/config";
import { RiseLoader } from "react-spinners";


const Onboard = () => {
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [about, setAbout] = useState<string>("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const availableTopics = [
    "Technology",
    "Health",
    "Sports",
    "Music",
    "Travel",
    "Education",
    "Science",
    "Art",
  ];

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
    } else {
      window.location.href = "/";
    }

    return () => {
      setLoading(false);
    }

 
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setProfilePic(event.target.files[0]);
    }
  };

  const handleAboutChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAbout(event.target.value);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTopics((prev) =>
      prev.includes(tag)
        ? prev.filter((topic) => topic !== tag)
        : [...prev, tag]
    );
  };

  const handleImageUpload = async (file: File) => {
    const url = `${config.apiUrl}/api/v1/upload`;
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

        return key;
      } else {
        console.error("Upload failed:", response.statusText);
        return "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async () => {
    if (!profilePic || !about || selectedTopics.length === 0) {
      setError("Please complete all fields.");
      return;
    }

    try {
      const key: string = await handleImageUpload(profilePic);
      if (!key) {
        throw new Error("Image upload failed");
      }

      const formData = new FormData();
      formData.append("profilePicKey", key); // Fixed typo
      formData.append("about", about);
      formData.append("topics", JSON.stringify(selectedTopics));

      const response = await fetch(`${config.apiUrl}/api/v1/user/onboarding`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        setError(""); // Clear the error if successful
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <RiseLoader color="#000" loading={true} size={30} />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            Welcome! Complete Your Profile
          </h1>

          <div className="mb-6 flex justify-center items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
              {profilePic ? (
                <img
                  src={URL.createObjectURL(profilePic)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUpload className="text-gray-500 text-3xl" />
              )}
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">About You:</label>
            <textarea
              value={about}
              onChange={handleAboutChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Tell us something about yourself..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">
              Topics of Interest:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTagClick(topic)}
                  className={`px-4 py-2 rounded-full border-2 font-medium ${
                    selectedTopics.includes(topic)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-blue-500 border-blue-500"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Complete Profile
          </button>
        </div>
      )}
    </>
  );
};

export default Onboard;
