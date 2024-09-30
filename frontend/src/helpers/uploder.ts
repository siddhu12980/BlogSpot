import config from "../utils/config";
import convertToBase64 from "../utils/converter";

const uploadImage = async (
    file: File,
    uploadCallback: (imageUrl: string) => void,
    errorCallback: (errorMessage: string) => void 
) => {
    try {
        console.log("Starting image upload...");

        // Convert file to base64
        const base64File = await convertToBase64(file);
        console.log("Converted file to base64:", base64File.substring(0, 50) + "..."); 

        const url = `${config.apiUrl}/api/v1/upload`;
        console.log("API URL for upload:", url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ file: base64File }),
        });

        console.log("Response received from server:", response);

        const result = await response.json();
        console.log("Parsed response JSON:", result);

        if (response.ok) {
            console.log("Upload successful, image URL:", result.imageUrl);
            uploadCallback(result.imageUrl);
        } else {
            console.error("Upload error:", result.message);
            errorCallback(result.message || "Failed to upload image.");
        }
    } catch (error) {
        console.error("Unexpected error during upload:", error);
        errorCallback("An error occurred while uploading the image. Please check the image size and format.");
    }
};

export default uploadImage;
