import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

const blogs = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
        prisma: PrismaClient;
    };
}>();

blogs.get("/:id", async (c) => {
    try {
        const id = c.req.param("id");
        console.log(id)
        console.log(c.get("userId"));

        const prisma = c.get("prisma");

        const blog = await prisma.post.findUnique({
            where: {
                authorId: c.get("userId"),
                id: (id).toString(),
            },
            cacheStrategy: { swr: 60 * 3, ttl: 60 },

        })

        if (!blog) {
            return c.json({ error: "No blog found" })
        }


        return c.json({ blog });

    }
    catch (e: any) {
        c.json({
            error: e.message
        })
    }


});

blogs.post("/", async (c) => {
    try {
        const prisma = c.get("prisma");

        const authorId = c.get("userId");

        const body = await c.req.json();

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
                authorId,
            },
        });

        return c.json({ blog });
    } catch (e: any) {
        return c.json({ error: e.message });
    }
});

blogs.get("/", async (c) => {
    try {
        const prisma = c.get("prisma");

        const blogs = await prisma.post.findMany({
            where: {
                authorId: c.get("userId"),
            },
        });

        return c.json({ blogs });
    } catch (e: any) {
        return c.json({ error: e.message });
    }



});

blogs.put("/", async (c) => {
    try {
        const prisma = c.get("prisma")

        const body = await c.req.json();

        const blog = await prisma.post.update({
            where: {
                id: body.id,
                authorId: c.get("userId"),
            },
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
            },
        });

        if (!blog) {
            return c.json({ error: "No blog found" })
        }

        return c.json({ blog });


    }
    catch (e: any) {
        return c.json({ error: e.message })
    }
});




export default blogs;
