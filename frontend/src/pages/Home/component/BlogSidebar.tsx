import { useNavigate } from "react-router-dom";

interface BlogSidebarProps {
  user_id: string;
  post_id: string;
  username: string;
  book: string;
  title: string;
  profilePic: string | null;
}

const BlogSidebar = ({
  user_id,
  post_id,
  username,
  book,
  title,
  profilePic,
}: BlogSidebarProps) => {
  const navigation = useNavigate();
  return (
    <div className=" p-4  border-b-2 border-l-2  shadow-sm  ">
      <div className="flex items-center mb-2">
        <img
          onClick={() => navigation(`/author/${user_id}`)}
          src={
            profilePic ||
            "https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg"
          }
          width={24}
          height={24}
          className="mr-4 w-8 h-8 rounded-full"
          alt={username}
        />
        <span>
          {username} - {book}
        </span>
      </div>
      <div onClick={() => navigation(`/blog/${post_id}`)} className=" text-xl">
        <h2>{title}</h2>
      </div>
    </div>
  );
};

export default BlogSidebar;
