import { PrismaClient } from "@prisma/client/edge";
import { createPostInput, updatePostInput } from "@sidd123/common";
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
        const prisma = c.get("prisma");
        const user = await prisma.user.findUnique({
            where: {
                id: c.get("userId"),

            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        const blog = await prisma.post.findUnique({
            where: {
                // authorId: c.get("userId"),
                id: (id).toString(),
            },
            // cacheStrategy: { swr: 60 * 3, ttl: 60 },
        })
        if (!blog) {
            return c.json({ error: "No blog found" }, 404);
        }
        return c.json({ blog, user }, 200);
    }
    catch (e: any) {
        c.json({
            error: e.message
        }, 501);
    }
});

blogs.post("/", async (c) => {
    try {
        const prisma = c.get("prisma");
        const authorId = c.get("userId");

        const body = await c.req.json();
        const { success } = createPostInput.safeParse(body);

        if (!success) {
            return c.json({ error: " Post Type Validation Failed" }, 400);
        }

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
                authorId,
            },
        });

        return c.json({ blog }, 200);
    } catch (e: any) {
        return c.json({ error: e.message }, 501);
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

        return c.json({ blogs }, 200);
    } catch (e: any) {
        return c.json({ error: e.message }, 501);
    }

});

blogs.put("/", async (c) => {
    try {
        const prisma = c.get("prisma")

        const body = await c.req.json();

        const { success } = updatePostInput.safeParse(body);

        if (!success) {
            return c.json({ error: "Update Post Type Validation Failed" }, 400);

        }
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
            return c.json({ error: "No blog found" }, 404);
        }

        return c.json({ blog }, 200);


    }
    catch (e: any) {
        return c.json({ error: e.message }, 501);
    }
});




export default blogs;
