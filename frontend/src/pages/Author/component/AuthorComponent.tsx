import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import config from "../../../utils/config";

interface AuthorComponentProps {
  BannerKey: string;
  id: string;
}

export const AuthorComponent = ({ BannerKey, id }: AuthorComponentProps) => {
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [banner, setBannerPic] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setBannerPic(event.target.files[0]);
      setTimeout(() => {
        console.log(banner);
        handleSubmit();
      }, 1000);
    }
  };

  const handleImageUpload = async (file: File) => {
    const url = `${config.apiUrl}/upload`;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(url, {
        method: "PUT",
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

  const handleSubmit = async () => {
    if (!banner) {
      console.warn("No banner image selected.");
      return;
    }

    const key: string = await handleImageUpload(banner);
    console.log("Banner key:", key);

    if (key) {
      try {
        const response = await fetch(`${config.apiUrl}/api/v1/user/banner`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ bannerPicKey: key }),
        });

        if (response.ok) {
          console.log("Banner updated successfully");
          setBannerUrl(`${config.apiUrl}/image/${key}`); 
        } else {
          console.error("Banner update failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating banner:", error);
      }
    }
  };

  useEffect(() => {
    if (!BannerKey) {
      setBannerUrl("https://i.imgur.com/q6D6587.jpg");
    } else {
      setBannerUrl(`${config.apiUrl}/image/${BannerKey}`);
    }
  }, [BannerKey]);

  return (
    <div className="relative overflow-hidden">
      <img
        src={bannerUrl}
        alt="Header Image"
        className="w-full h-64 object-cover"
      />
      {localStorage.getItem("userId") == id ? (
        <div className="absolute z-10 bottom-0 right-0 bg-white p-1 rounded-full">
          <label htmlFor="file-input">
            <FiEdit size={22} className="text-blue-500 cursor-pointer" />
          </label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <></>
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <h1 className="text-3xl font-bold">Brad Yonaka</h1>
      </div>
    </div>
  );
};

export default AuthorComponent;
