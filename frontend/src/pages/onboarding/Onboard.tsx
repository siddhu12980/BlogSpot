import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";

const Onboard = () => {
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
      prev.includes(tag) ? prev.filter((topic) => topic !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!profilePic || !about || selectedTopics.length === 0) {
      setError("Please complete all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", profilePic);
    formData.append("about", about);
    formData.append("topics", JSON.stringify(selectedTopics));

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Redirect to home or dashboard page after successful onboarding
        window.location.href = "/home";
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome! Complete Your Profile</h1>

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
        <label className="block text-lg font-medium mb-2">Topics of Interest:</label>
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
  );
};

export default Onboard;
