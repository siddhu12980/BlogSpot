export const AuthorComponent = () => {
  return (
    <div className="relative overflow-hidden">
      <img
        src="https://i.imgur.com/q6D6587.jpg"
        alt="Header Image"
        className="w-full h-64 object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <h1 className="text-3xl font-bold">Brad Yonaka</h1>
      </div>
    </div>
  );
};

export default AuthorComponent;
