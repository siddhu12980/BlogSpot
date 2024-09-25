import express from 'express';
import {
    getBlogController,
    createBlogController,
    updateBlogController,
    deleteBlogController,
} from '../../controller/blogs/blog';
import { getUserSavedPostsController } from '../../controller/blogs/blog_fet';

const blogRouter = express.Router();

blogRouter.get('/:id', getBlogController);
blogRouter.post('/', createBlogController);
blogRouter.put('/', updateBlogController);
blogRouter.delete('/:id', deleteBlogController);
blogRouter.post("/saved-posts",getUserSavedPostsController)

export default blogRouter;
