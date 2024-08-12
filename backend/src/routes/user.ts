import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { sign } from "hono/jwt";
import { signupInput } from "@sidd123/common";

const user = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
        prisma: PrismaClient;
    };
}>();

user.get("/author/:id", async (c) => {
    try {
        const id = c.req.param("id");
        const prisma = c.get("prisma");

        const author = await prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        const posts = await prisma.post.findMany({
            where: {
                authorId: id,
            },
        });

        return c.json({ author, posts }, 200);
    } catch (e: any) {
        return c.json({ error: e.message }, 501);
    }
});

export default user;
