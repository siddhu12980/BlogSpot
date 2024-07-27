import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'

const all = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
        prisma: PrismaClient;
    };
}>();


all.get('/api/v1/all', async (c) => {
    const prisma = c.get('prisma');

    const posts = await prisma.post.findMany({
    });


    return c.json(posts);
})