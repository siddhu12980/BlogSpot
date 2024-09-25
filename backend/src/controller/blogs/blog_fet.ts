import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import client from "../../db"
import { clear } from 'console';

const prisma = client;


export const getUserSavedPostsController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        const userWithSavedPosts = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                savedPosts: true,
            },
        });

        if (!userWithSavedPosts) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ savedPosts: userWithSavedPosts.savedPosts });

    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
};



export const getUserBlogsController = async (req: Request, res: Response) => {
    try {
        const authorId = res.locals.user.id;

        const blogs = await prisma.post.findMany({
            where: {
                authorId,
            },
        });

        return res.status(200).json({ blogs });

    } catch (e: any) {
        return res.status(501).json({ error: e.message });
    }
};

export const ratePostController = async (req: Request, res: Response) => {
    try {
        const { blog_id, author_id } = req.body;
        const userId = res.locals.user.id;

        if (!blog_id) {
            return res.status(400).json({ error: "No BlogID Found" });
        }

        if (author_id === userId) {
            return res.status(403).json({ error: "You can't rate your own post" });
        }

        const blog = await prisma.post.update({
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

    } catch (e: any) {
        return res.status(501).json({ error: e.message });
    }
};

export const savePostController = async (req: Request, res: Response) => {
    try {
        const { postId } = req.body;
        const userId = res.locals.user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!user || !post) {
            return res.status(404).json({ error: "User or Post not found" });
        }

        const existingSavedPost = await prisma.user.findFirst({
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

        await prisma.user.update({
            where: { id: userId },
            data: {
                savedPosts: {
                    connect: { id: postId },
                },
            },
        });

        return res.status(200).json({ message: "Post saved successfully" });

    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
};


export const filterPostsController = async (req: Request, res: Response) => {
    console.log("Filter Post");  

    const authorData: Array<any> = [];


    try {
        const tag = req.query.category?.toString().toLowerCase();

        const posts = await prisma.post.findMany({
            where: {
                tag: {
                    has: tag,
                },
            },
        });

        for (let i = 0; i < posts.length; i++) {
            const data = await prisma.user.findUnique({
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
    } catch (e: any) {
        return res.status(501).json({ error: e.message });
    }
};

export const getTopPostsController = async (req: Request, res: Response) => {
    try {
        const topPosts = await prisma.post.findMany({
            orderBy: {
                rating: 'desc'
            },
            take: 10, 
        });

        const uniqueUsersMap = new Map<string, any>();

        for (const post of topPosts) {
            const user = await prisma.user.findUnique({
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

            if (!uniqueUsersMap.has(user!.id)) {
                uniqueUsersMap.set(user!.id, {
                    user: user,
                    post: post,
                });
            }
        }

        const responseArray = Array.from(uniqueUsersMap.values()).map(item => [
            { 
                id: item.user.id,
                about: item.user.about,
                name: item.user.name,
                profilePicKey: item.user.profilePicKey,
            },
            { 
                id: item.post.id,
                title: item.post.title,
                content: item.post.content,
                published: item.post.published,
                createdAt: item.post.createdAt,
                post_banner: item.post.post_banner,
            }
        ]);

        return res.json(responseArray);
    } catch (e: any) {
        return res.status(501).json({ error: e.message });
    }
};




export const getAllPostsController = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany();

        const authorDataPromises = posts.map(async (post: any) => {
            const authorData = await prisma.user.findUnique({
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
        });

        const authorData = await Promise.all(authorDataPromises);
        return res.json(authorData);
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
};

export const getPostsWithAuthors = async (req: Request, res: Response): Promise<void> => {
    const author_data = [];
  
    try {
      const posts = await prisma.post.findMany();
  
      for (let i = 0; i < posts.length; i++) {
        const data = await prisma.user.findUnique({
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
    } catch (error) {
      console.error('Error fetching posts with authors:', error);
      res.status(501).json({ error: (error as Error).message });
    }
  };