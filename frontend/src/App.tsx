import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Auth/Signup";
import Signin from "./pages/Auth/Signin";
import Blog from "./pages/Blog/Blog";
import { CreateBlog } from "./pages/Blog/CreateBlog";
import { Homepage } from "./pages/Home/Homepage";
import { AuthorProfile } from "./pages/Author/AuthorProfile";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/blog" element={<CreateBlog />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/author/:id" element={<AuthorProfile />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
