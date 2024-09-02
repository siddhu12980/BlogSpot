export interface BlogData {
  id: string;
  post_id: string;
  name: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  profilePicKey: string;
  about: string;
  post_banner:string;
}

export interface Item {
  id: string;
  about: string;
  post_id: string;
  name: string;
  title: string;
  content: string;
  imageUrl: string;
  description: string;
  published: boolean;
  link: string;
  createdAt: string;
  profilePicKey: string;
  post_banner:string
}
export interface searchprops {
  onSearch: (debouncedSearchTerm: string) => void;
}

export interface AuthorData {
  id: string;
  name: string;
  email: string;
  about: string;
  profilePicKey: string;
  tagsLiked: string[];
  bannerPicKey: string;
}

export interface SavedPostData {
  title: string;
  id: string;
  content: string;
  published: boolean;
  authorId: string;
  userId: string;
  createdAt: string;
  rating: number;
  tag: string[];
  post_banner: string;
}