import { FiEdit } from "react-icons/fi";
import config from "../../../utils/config";
import { toast, Toaster } from "sonner";
import uploadImage from "../../../helpers/uploder";
export const AuthorComponent = ({ id, name,authorBanner }: { id: string; name: string,authorBanner:string | null }) => {

  const handleBannerPicUpload = async (file: File) => {
    const userId = localStorage.getItem("userId") || "";
    uploadImage(file, userId,(imageUrl: string) => {
      uploadBannerKey(imageUrl);
    }, (errorMessage: string) => {
      toast.error(errorMessage);
    }
    );
  };

  const uploadBannerKey = async (key: string) => {
    const url = `${config.apiUrl}/api/v1/user/banner`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        bannerPicKey: key,
        userId: localStorage.getItem("userId"),
      }),
    });

    const result = await response.json();
    if (response.ok) {
      toast.success("Banner Updated");
    } else {
      toast.error("Banner Update Failed");
      console.error("Error:", result.msg);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      handleBannerPicUpload(file);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <img
        src={authorBanner ||"https://i.imgur.com/q6D6587.jpg"} 
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
        <h1 className="text-3xl font-bold">{name}</h1>
      </div>
      <Toaster />
    </div>
  );
};

export default AuthorComponent;
