import React, { useState, useEffect } from "react";
import apiUrl from "../utils/config";
import { useNavigate } from "react-router-dom";

interface ProfilePictureUploadProps {
  onUpload: (file: File) => void;
}

const UploadProfile: React.FC = () => {
  const navigate = useNavigate();
  const handleImageUpload = async (file: File) => {
    const url = `${apiUrl.apiUrl}/upload`;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log(`Image uploaded successfully: ${file.name}`);
        navigate("/home");
      } else {
        console.error("Upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Upload onUpload={handleImageUpload} />
    </div>
  );
};

export default UploadProfile;

export const Upload: React.FC<ProfilePictureUploadProps> = ({ onUpload }) => {
  const [img, setImg] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (img && selectedImage) {
      onUpload(img);
    }
  }, [img, selectedImage, onUpload]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Profile Preview"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image
          </div>
        )}
      </div>
      <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Upload Profile Picture
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
