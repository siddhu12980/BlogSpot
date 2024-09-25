import { FiEdit } from "react-icons/fi";

export const AuthorComponent = ({ id , name}: { id: string, name:string }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setTimeout(() => {
        console.log(event.target.files);
      }, 1000);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <img
        src="https://i.imgur.com/q6D6587.jpg"
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
    </div>
  );
};

export default AuthorComponent;
