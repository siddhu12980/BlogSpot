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
exports.getSavedPostsController = exports.updateAboutController = exports.getProfileListController = exports.followRelationController = exports.followUserController = exports.getAuthorWithPostsController = exports.getUserDetailsController = void 0;
const db_1 = __importDefault(require("../../db"));
const prisma = db_1.default;
const getUserDetailsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.user.id;
        const userData = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                profilePicKey: true,
                about: true,
            },
        });
        return res.json(userData);
    }
    catch (e) {
        console.error(e);
        return res.status(501).json({ error: e.message });
    }
});
exports.getUserDetailsController = getUserDetailsController;
const getAuthorWithPostsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const author = yield prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                about: true,
                profilePicKey: true,
                tagsLiked: true,
                bannerPicKey: true,
            },
        });
        const posts = yield prisma.post.findMany({
            where: { authorId: id },
        });
        return res.status(200).json({ author, posts });
    }
    catch (e) {
        return res.status(501).json({ error: e.message });
    }
});
exports.getAuthorWithPostsController = getAuthorWithPostsController;
const followUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const followId = req.params.id;
    const myId = res.locals.user.id;
    try {
        const user = yield prisma.user.findUnique({
            where: { id: followId },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.id === myId) {
            return res.status(400).json({ error: "You can't follow yourself" });
        }
        const existingFollow = yield prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: myId,
                    followingId: followId,
                },
            },
        });
        if (existingFollow) {
            yield prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: myId,
                        followingId: followId,
                    },
                },
            });
            const updatedUser = yield prisma.user.findUnique({
                where: { id: myId },
            });
            return res.json({ message: "User unfollowed successfully", updatedUser });
        }
        else {
            yield prisma.follows.create({
                data: {
                    followerId: myId,
                    followingId: followId,
                },
            });
            const updatedUser = yield prisma.user.findUnique({
                where: { id: myId },
            });
            return res.json({ message: "User followed successfully", updatedUser });
        }
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    }
});
exports.followUserController = followUserController;
const followRelationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const myId = res.locals.user.id;
    try {
        const followedUsers = yield prisma.follows.findMany({
            where: {
                followerId: myId,
            },
            select: {
                followingId: true,
            },
        });
        return res.json({ followedUsers });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.followRelationController = followRelationController;
const getProfileListController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.params.id;
    try {
        const followedUsers = yield prisma.follows.findMany({
            where: {
                followerId: user_id,
            },
            select: {
                followingId: true,
            },
        });
        const followedUsersData = yield Promise.all(followedUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const userDetails = yield prisma.user.findUnique({
                where: {
                    id: user.followingId,
                },
                select: {
                    profilePicKey: true,
                    name: true,
                    id: true,
                    _count: {
                        select: { followers: true },
                    },
                },
            });
            return {
                profilePicKey: userDetails === null || userDetails === void 0 ? void 0 : userDetails.profilePicKey,
                id: userDetails === null || userDetails === void 0 ? void 0 : userDetails.id,
                name: userDetails === null || userDetails === void 0 ? void 0 : userDetails.name,
                followerCount: (_a = userDetails === null || userDetails === void 0 ? void 0 : userDetails._count) === null || _a === void 0 ? void 0 : _a.followers,
            };
        })));
        console.log("Followed Users ", followedUsersData);
        return res.json({ followedUsersData });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getProfileListController = getProfileListController;
const updateAboutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = res.locals.user.id;
        ;
        const body = req.body;
        const { about } = body;
        const author = yield prisma.user.update({
            where: { id },
            data: { about },
        });
        return res.status(200).json({ author });
    }
    catch (error) {
        return res.status(501).json({ error: error.message });
    }
});
exports.updateAboutController = updateAboutController;
const getSavedPostsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = res.locals.user.id;
        ;
        const savedPosts = yield prisma.user.findUnique({
            where: { id },
            select: {
                savedPosts: true,
            },
        });
        return res.status(200).json({ savedPosts });
    }
    catch (error) {
        return res.status(501).json({ error: error.message });
    }
});
exports.getSavedPostsController = getSavedPostsController;
