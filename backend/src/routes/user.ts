import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput } from "@sidd123/common";

const user = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    };
    Variables: {
        userId: string
        prisma: PrismaClient
    }
}>();

user.post("/signup", async (c) => {
    try {
        const prisma = c.get("prisma")

        const body = await c.req.json();

        const { success } = signupInput.safeParse(body);

        if (!success) {
            return c.json({ error: "Type Validation Failed" });

        }

        // const hashedPassword = await bcrypt.hash(body.password, 10);

        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name,
            },
        });

        const payload = {
            email: user.email,
            id: user.id,
            name: user.name,
            exp: Math.floor(Date.now() / 1000) + 60 * 30, // Token expires in 5 minutes
        }
        const token = await sign(payload, c.env?.JWT_SECRET)

        return c.json({ token })

    } catch (e: any) {
        return c.json({ error: e.message });
    }
});

user.post("/signin", async (c) => {

    try {
        const body = await c.req.json();

        const { success } = signupInput.safeParse(body);

        if (!success) {
            return c.json({ error: "Type Validation Failed" });

        }


        const prisma = c.get("prisma")
        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
                password: body.password,
            },
        });

        if (!user) {
            return c.json({ error: 'Invalid email or Password' });
        }


        const payload = {
            email: user.email,
            id: user.id,
            name: user.name,
            exp: Math.floor(Date.now() / 1000) + 60 * 30, // Token expires in 5 minutes
        }

        const token = await sign(payload, c.env?.JWT_SECRET)

        return c.json({ token });


    }
    catch (e: any) {
        return c.json({ error: e.message });
    }
});

export default user;