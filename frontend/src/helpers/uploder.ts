import config from "../utils/config";
import convertToBase64 from "../utils/converter";

const uploadImage = async (
    file: File,
    uploadCallback: (imageUrl: string) => void,
    errorCallback: (errorMessage: string) => void 
) => {
    try {
        const base64File = await convertToBase64(file);
        const url = `${config.apiUrl}/upload`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ file: base64File }),
        });

        const result = await response.json();

        if (response.ok) {
            uploadCallback(result.imageUrl);
        } else {
            console.error("Error:", result.message);
            errorCallback(result.message || "Failed to upload image."); 
        }
    } catch (error) {
        console.error("Error uploading image frontend:", (error as Error).message);
        errorCallback(" error occurred while uploading the image, Check image size and format"); 
    }
};

export default uploadImage;
