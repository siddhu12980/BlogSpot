import React, { useState, useEffect } from "react";
import apiUrl from "../utils/config";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadKey, setUploadKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    console.error("url",apiUrl.apiUrl)

    try {
      const response = await fetch(`${apiUrl.apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageKey = data.image.url.split("/").pop();
        setUploadKey(imageKey);
        setError(null);
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (!uploadKey) return;

      try {
        const response = await fetch(`${apiUrl.apiUrl}/image/${uploadKey}`);
        if (response.ok) {
          const blob = await response.blob();
          setImageUrl(URL.createObjectURL(blob));
          setError(null);
        } else {
          const errorMessage = await response.text();
          setError(errorMessage);
        }
      } catch (e) {
        setError((e as Error).message);
      }
    };

    fetchImage();
  }, [uploadKey]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Image Upload & Fetch</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload Image
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {imageUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Uploaded Image:</h2>
          <img src={imageUrl} alt="Uploaded" className="rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
