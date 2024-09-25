"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogController = exports.deleteBlogController = exports.createBlogController = exports.getBlogController = void 0;
const common_1 = require("@sidd123/common");
const db_1 = __importDefault(require("../../db"));
const prisma = db_1.default;
const getBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield prisma.user.findUnique({
            where: {
                id: res.locals.user.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                profilePicKey: true,
                about: true,
            },
        });
        const blog = yield prisma.post.findUnique({
            where: {
                id: id,
            },
        });
        if (!blog) {
            return res.status(404).json({ error: "No blog found" });
        }
        return res.status(200).json({ blog, user });
    }
    catch (e) {
        return res.status(501).json({ error: e.message });
    }
});
exports.getBlogController = getBlogController;
const createBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = res.locals.user.id;
        const body = req.body;
        const { success } = common_1.createPostInput.safeParse(body);
        if (!success) {
            return res.status(400).json({ error: "Post Type Validation Failed" });
        }
        const blog = yield prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
                post_banner: body.post_banner,
                authorId,
            },
        });
        return res.status(200).json({ blog });
    }
    catch (e) {
        return res.status(501).json({ error: e.message });
    }
});
exports.createBlogController = createBlogController;
const deleteBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = res.locals.user.id;
        const id = req.params.id;
        const blog = yield prisma.post.findUnique({
            where: {
                id: id,
                authorId,
            },
        });
        if (!blog) {
            return res.status(404).json({ message: "No blog found" });
        }
        yield prisma.post.delete({
            where: {
                id: id,
                authorId,
            },
        });
        return res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (e) {
        return res.status(501).json({ error: e.message });
    }
});
exports.deleteBlogController = deleteBlogController;
// put :id to update a specific blog
const updateBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { success } = common_1.updatePostInput.safeParse(body);
        if (!success) {
            return res.status(400).json({ error: "Update Post Type Validation Failed" });
        }
        const blog = yield prisma.post.update({
            where: {
                id: body.id,
                authorId: res.locals.user.id,
            },
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
            },
        });
        if (!blog) {
            return res.status(404).json({ error: "No blog found" });
        }
        return res.status(200).json({ blog });
    }
    catch (e) {
        return res.status(501).json({ error: e.message });
    }
});
exports.updateBlogController = updateBlogController;
