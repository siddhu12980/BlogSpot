interface BlogSidebarProps {
  username: string;
  book: string;
  title: string;
  profilePic: string;
}

const BlogSidebar = ({
  username,
  book,
  title,
  profilePic,
}: BlogSidebarProps) => {
  return (
    <div className=" p-4  ">
      <div className="flex items-center mb-2">
        <img
          src={profilePic}
          width={24}
          height={24}
          className="mr-4 w-8 h-8 rounded-full"
          alt={username}
        />
        <span>
          {username} - {book}
        </span>
      </div>
      <div className=" text-xl">
        <h2>{title}</h2>
      </div>
    </div>
  );
};

export default BlogSidebar;
