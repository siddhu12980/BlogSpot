import { Request, Response } from 'express';

import client from "../../db"

const prisma = client;
export const getUserDetailsController = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;

        const userData = await prisma.user.findUnique({
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
    } catch (e: any) {
        console.error(e);   
        return res.status(501).json({ error: e.message });
    }
};



export const getAuthorWithPostsController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;  

        const author = await prisma.user.findUnique({
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

        const posts = await prisma.post.findMany({
            where: { authorId: id },
        });


        return res.status(200).json({ author, posts });
    } catch (e: any) {
        return res.status(501).json({ error: e.message });
    }
};


export const followUserController = async (req: Request, res: Response) => {
    const followId = req.params.id;
    const myId = res.locals.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: followId },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.id === myId) {
            return res.status(400).json({ error: "You can't follow yourself" });
        }

        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: myId,
                    followingId: followId,
                },
            },
        });

        if (existingFollow) {
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: myId,
                        followingId: followId,
                    },
                },
            });

            const updatedUser = await prisma.user.findUnique({
                where: { id: myId },
            });

            return res.json({ message: "User unfollowed successfully", updatedUser });
        } else {
            await prisma.follows.create({
                data: {
                    followerId: myId,
                    followingId: followId,
                },
            });

            const updatedUser = await prisma.user.findUnique({
                where: { id: myId },
            });

            return res.json({ message: "User followed successfully", updatedUser });
        }
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    }
};


export const followRelationController = async (req: Request, res: Response) => {
    const myId = res.locals.user.id;

    try {
        const followedUsers = await prisma.follows.findMany({
            where: {
                followerId: myId,
            },
            
            select: {
                followingId: true,
            },
        });

        return res.json({ followedUsers });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};


export const getProfileListController = async (req: Request, res: Response) => {
    const user_id = req.params.id;

    try {
        const followedUsers = await prisma.follows.findMany({
            where: {
                followerId: user_id,
            },
            select: {
                followingId: true,
            },
        });

        const followedUsersData = await Promise.all(
            followedUsers.map(async (user) => {
                const userDetails = await prisma.user.findUnique({
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
                    profilePicKey: userDetails?.profilePicKey,
                    id: userDetails?.id,
                    name: userDetails?.name,
                    followerCount: userDetails?._count?.followers,
                };
            })
        );

        console.log("Followed Users ",followedUsersData); 

        return res.json({ followedUsersData });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};


export const updateAboutController = async (req: Request, res: Response) => {
    try {
        const id = res.locals.user.id;;
        const body = req.body;
        const { about } = body;

        const author = await prisma.user.update({
            where: { id },
            data: { about },
        });

        return res.status(200).json({ author });
    } catch (error: any) {
        return res.status(501).json({ error: error.message });
    }
};

export const getSavedPostsController = async (req: Request, res: Response) => {
    try {
        const id = res.locals.user.id;;
        const savedPosts = await prisma.user.findUnique({
            where: { id },
            select: {
                savedPosts: true,
            },
        });      

        return res.status(200).json({ savedPosts });
    } catch (error: any) {
        return res.status(501).json({ error: error.message });
    }
};