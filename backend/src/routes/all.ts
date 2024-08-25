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
    var author_data = [];
    try {

        const prisma = c.get('prisma');
        const posts = await prisma.post.findMany({
        });

        for (let i = 0; i < posts.length; i++) {

            const data = await prisma.user.findUnique({
                where: {
                    id: posts[i].authorId
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            });


            author_data[i] = [data, posts[i]];
        }


        return c.json(author_data, 200);
    }
    catch (e: any) {
        return c.json({ error: e.message }, 501);
    }
})


all.get('/name', async (c) => {
    try {

        const prisma = c.get('prisma');
        console.log(c.get("userId"));
        const user_id = c.get("userId");
        const user_data = await prisma.user.findUnique(
            {
                where: {
                    id: user_id
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                }

            }
        );

        return c.json(user_data, 200);

    }
    catch (e: any) {
        return c.json({ error: e.message }, 501);
    }
})

all.get("/top", async (c) => {
    try {
        const prisma = c.get("prisma");

        const post = [];
        const top_posts = await prisma.post.findMany({
            orderBy: {
                rating: 'desc'
            },
            take: 5
        });

        for (let i = 0; i < top_posts.length; i++) {
            const data = await prisma.user.findUnique({
                where: {
                    id: top_posts[i].authorId
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            });
            post[i] = [data, top_posts[i]];
        }


        return c.json(post, 200);
    }
    catch (e: any) {
        return c.json({ error: e.message }, 501);
    }
})

all.get('/filter', async (c) => {
    var author_data = [];

    try {

        const prisma = c.get('prisma');
        const tag = c.req.query("category")?.toLowerCase();
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
                    id: posts[i].authorId
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            });


            author_data[i] = [data, posts[i]];
        }


        return c.json(author_data, 200);
    }
    catch (e: any) {
        return c.json({ error: e.message }, 501);
    }
})





export default all;
