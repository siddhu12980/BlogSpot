import { Request, Response } from 'express';
import { createPostInput, updatePostInput } from "@sidd123/common";

import client from "../../db"

const prisma = client;

export const getBlogController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const user = await prisma.user.findUnique({
            where: {
                id:  res.locals.user.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                profilePicKey: true,
                about: true,
            },
        });

        const blog = await prisma.post.findUnique({
            where: {
                id: id,
            },
        });

        if (!blog) {
            return res.status(404).json({ error: "No blog found" });
        }

        return res.status(200).json({ blog, user });

    } catch (e: any) {
        return res.status(501).json({ error: e.message });
    }
};


export const createBlogController = async (req: Request, res: Response) => {
    try {
        const authorId = res.locals.user.id;

        const body = req.body;
        const { success } = createPostInput.safeParse(body);

        if (!success) {
            return res.status(400).json({ error: "Post Type Validation Failed" });
        }

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
                post_banner: body.post_banner,
                authorId,
            },
        });


        return res.status(200).json({ blog });

    } catch (e: any) {
        return res.status(501).json({ error: e.message });
    }
};


export const deleteBlogController = async (req: Request, res: Response) => {
    try {
        const authorId = res.locals.user.id;
        const id = req.params.id;

        const blog = await prisma.post.findUnique({
            where: {
                id: id,
                authorId,
            },
        });

        if (!blog) {
            return res.status(404).json({ message: "No blog found" });
        }

        await prisma.post.delete({
            where: {
                id: id,
                authorId,
            },
        });

        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (e: any) {
        return res.status(501).json({ error: e.message });
    }
};

 // put :id to update a specific blog
export const updateBlogController = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const { success } = updatePostInput.safeParse(body);

        if (!success) {
            return res.status(400).json({ error: "Update Post Type Validation Failed" });
        }

        const blog = await prisma.post.update({
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

    } catch (e: any) {
        return res.status(501).json({ error: e.message });
    }
};