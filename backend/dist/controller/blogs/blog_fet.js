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
exports.getPostsWithAuthors = exports.getAllPostsController = exports.getTopPostsController = exports.filterPostsController = exports.savePostController = exports.ratePostController = exports.getUserBlogsController = exports.getUserSavedPostsController = void 0;
const db_1 = __importDefault(require("../../db"));
const prisma = db_1.default;
const getUserSavedPostsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const userWithSavedPosts = yield prisma.user.findUnique({
            where: { id: userId },
            include: {
                savedPosts: true,
            },
        });
        if (!userWithSavedPosts) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ savedPosts: userWithSavedPosts.savedPosts });
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
exports.getUserSavedPostsController = getUserSavedPostsController;
const getUserBlogsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = res.locals.user.id;
        const blogs = yield prisma.post.findMany({
            where: {
                authorId,
            },
        });
        return res.status(200).json({ blogs });
    }
    catch (e) {
        return res.status(501).json({ error: e.message });
    }
});
exports.getUserBlogsController = getUserBlogsController;
const ratePostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blog_id, author_id } = req.body;
        const userId = res.locals.user.id;
        if (!blog_id) {
            return res.status(400).json({ error: "No BlogID Found" });
        }
        if (author_id === userId) {
            return res.status(403).json({ error: "You can't rate your own post" });
        }
        const blog = yield prisma.post.update({
            where: {
                id: blog_id,
            },
            data: {
                rating: {
                    increment: 1,
                },
            },
        });
        return res.status(200).json({ blog });
    }
    catch (e) {
        return res.status(501).json({ error: e.message });
    }
});
exports.ratePostController = ratePostController;
const savePostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.body;
        const userId = res.locals.user.id;
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        const post = yield prisma.post.findUnique({ where: { id: postId } });
        if (!user || !post) {
            return res.status(404).json({ error: "User or Post not found" });
        }
        const existingSavedPost = yield prisma.user.findFirst({
            where: {
                id: userId,
                savedPosts: {
                    some: {
                        id: postId,
                    },
                },
            },
        });
        if (existingSavedPost) {
            return res.status(400).json({ error: "Post is already saved" });
        }
        yield prisma.user.update({
            where: { id: userId },
            data: {
                savedPosts: {
                    connect: { id: postId },
                },
            },
        });
        return res.status(200).json({ message: "Post saved successfully" });
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
exports.savePostController = savePostController;
const filterPostsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Filter Post");
    const authorData = [];
    try {
        const tag = (_a = req.query.category) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
        const posts = yield prisma.post.findMany({
            where: {
                tag: {
                    has: tag,
                },
            },
        });
        for (let i = 0; i < posts.length; i++) {
            const data = yield prisma.user.findUnique({
                where: {
                    id: posts[i].authorId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePicKey: true,
                },
            });
            authorData[i] = [data, posts[i]];
        }
        return res.json(authorData);
    }
    catch (e) {
        return res.status(501).json({ error: e.message });
    }
});
exports.filterPostsController = filterPostsController;
const getTopPostsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = [];
        const topPosts = yield prisma.post.findMany({
            orderBy: {
                rating: 'desc'
            },
            take: 5,
        });
        for (let i = 0; i < topPosts.length; i++) {
            const data = yield prisma.user.findUnique({
                where: {
                    id: topPosts[i].authorId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePicKey: true,
                    about: true,
                },
            });
            post[i] = [data, topPosts[i]];
        }
        return res.json(post);
    }
    catch (e) {
        return res.status(501).json({ error: e.message });
    }
});
exports.getTopPostsController = getTopPostsController;
const getAllPostsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.get('prisma');
        const posts = yield prisma.post.findMany();
        const authorDataPromises = posts.map((post) => __awaiter(void 0, void 0, void 0, function* () {
            const authorData = yield prisma.user.findUnique({
                where: {
                    id: post.authorId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePicKey: true,
                    about: true,
                },
            });
            return [authorData, post];
        }));
        const authorData = yield Promise.all(authorDataPromises);
        return res.json(authorData);
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
exports.getAllPostsController = getAllPostsController;
const getPostsWithAuthors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const author_data = [];
    try {
        const posts = yield prisma.post.findMany();
        for (let i = 0; i < posts.length; i++) {
            const data = yield prisma.user.findUnique({
                where: {
                    id: posts[i].authorId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePicKey: true,
                    about: true
                }
            });
            if (!data) {
                throw new Error(`Author not found for post ${posts[i].id}`);
            }
            author_data[i] = [data, posts[i]];
        }
        res.status(200).json(author_data);
    }
    catch (error) {
        console.error('Error fetching posts with authors:', error);
        res.status(501).json({ error: error.message });
    }
});
exports.getPostsWithAuthors = getPostsWithAuthors;
