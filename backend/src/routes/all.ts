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


all.get('/', async (c) => {
    try {

        const prisma = c.get('prisma');
        const posts = await prisma.post.findMany({
        });


        return c.json(posts, 200);
    }
    catch (e: any) {
        return c.json({ error: e.message }, 501);
    }
})

export default all;
