import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput } from "@sidd123/common";

const auth = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    };
    Variables: {
        userId: string
        prisma: PrismaClient
    }
}>();

auth.post("/signup", async (c) => {
    try {
        const prisma = c.get("prisma")

        const body = await c.req.json();


        const { success } = signupInput.safeParse(body);

        if (!success) {
            return c.json({ error: "Type Validation Failed" }, 400);
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
        console.log(token)
        return c.json({ token }, 200)

    } catch (e: any) {
        console.log(e)
        return c.json({ error: e.message }, 400);
    }
});

auth.post("/signin", async (c) => {

    try {

        const body = await c.req.json();

        console.log(body);

        const { success } = signupInput.safeParse(body);

        if (!success) {
            return c.json({ error: "Type Validation Failed" }, 400);

        }


        const prisma = c.get("prisma")
        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
                password: body.password,
            },
        });
        console.log(user)


        if (!user) {
            return c.json({ error: 'Invalid email or Password' }, 401);
        }


        const payload = {
            email: user.email,
            id: user.id,
            name: user.name,
            exp: Math.floor(Date.now() / 1000) + 60 * 30, // Token expires in 5 minutes
        }
        console.log("**********************")

        console.log(payload)

        const token = await sign(payload, c.env?.JWT_SECRET)
        console.log("====================================")
        console.log(token)
        return c.json({ token }, 200);


    }
    catch (e: any) {
        console.log("+++++++++++++++++++++++++")

        console.log(e)
        return c.json({ error: e }, 400);
    }
});

export default auth;