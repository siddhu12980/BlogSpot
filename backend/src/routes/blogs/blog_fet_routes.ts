import express from 'express';
import {
    ratePostController,
    savePostController,
    filterPostsController,
    getTopPostsController,
    getPostsWithAuthors,
} from '../../controller/blogs/blog_fet';
import { getSavedPostsController } from '../../controller/user/user';


const blogFetRouter = express.Router();

blogFetRouter.post('/rate', ratePostController);
blogFetRouter.post('/save', savePostController);
blogFetRouter.get('/filter', filterPostsController);
blogFetRouter.get('/top', getTopPostsController);
blogFetRouter.get('/all', getPostsWithAuthors);
blogFetRouter.post('/saved-posts', getSavedPostsController);

export default blogFetRouter;
