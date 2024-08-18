import { FiEdit } from "react-icons/fi";

export const AuthorComponent = () => {
  const handelBannerChange = () => {
    console.log("Change Banner");
  };
  return (
    <div className="relative overflow-hidden">
      {/* <div className="relative w-24 h-24"> */}
        <img
          src="https://i.imgur.com/q6D6587.jpg"
          alt="Header Image"
          className="w-full h-64 object-cover"
        />
        <div className="absolute z-10 bottom-0 right-0 bg-white p-1 rounded-full">
          <FiEdit size={22}  onClick={handelBannerChange} className="text-blue-500" />
        </div>
      {/* </div> */}

      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <h1 className="text-3xl font-bold">Brad Yonaka</h1>
      </div>
    </div>
  );
};

export default AuthorComponent;
