"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_fet_1 = require("../../controller/blogs/blog_fet");
const user_1 = require("../../controller/user/user");
const blogFetRouter = express_1.default.Router();
blogFetRouter.post('/rate', blog_fet_1.ratePostController);
blogFetRouter.post('/save', blog_fet_1.savePostController);
blogFetRouter.get('/filter', blog_fet_1.filterPostsController);
blogFetRouter.get('/top', blog_fet_1.getTopPostsController);
blogFetRouter.get('/all', blog_fet_1.getPostsWithAuthors);
blogFetRouter.post('/saved-posts', user_1.getSavedPostsController);
exports.default = blogFetRouter;
