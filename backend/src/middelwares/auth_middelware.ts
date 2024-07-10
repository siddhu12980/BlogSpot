import { Hono } from "hono";
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

const auth_middelware = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    };
    Variables: {
        userId: string
    }
}>();

auth_middelware.use('/api/v1/blog/*', async (c, next) => {

    const jwt = c.req.header('Authorization');
    if (!jwt) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    const token = jwt.split(' ')[1];
    const payload: JWTPayload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    c.set('userId', String(payload.id))
    await next()
})

export default auth_middelware;