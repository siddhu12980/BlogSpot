"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_1 = require("../../controller/blogs/blog");
const blog_fet_1 = require("../../controller/blogs/blog_fet");
const blogRouter = express_1.default.Router();
blogRouter.get('/:id', blog_1.getBlogController);
blogRouter.post('/', blog_1.createBlogController);
blogRouter.put('/', blog_1.updateBlogController);
blogRouter.delete('/:id', blog_1.deleteBlogController);
blogRouter.post("/saved-posts", blog_fet_1.getUserSavedPostsController);
exports.default = blogRouter;
