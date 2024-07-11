import { Hono } from 'hono';
import { verify } from 'hono/jwt';
import type { Context, Next } from 'hono';
import type { JWTPayload } from 'hono/utils/jwt/types';
import { createMiddleware } from 'hono/factory';

const auth_middleware = createMiddleware(async (c, next) => {
    console.log('--------------Blog middleware---------------');
    const jwt = c.req.header('Authorization');
    if (!jwt) {
        c.status(401);
        return c.json({ error: 'unauthorized' });
    }
    const token = jwt.split(' ')[1];
    let payload: JWTPayload | null;
    try {
        payload = await verify(token, c.env.JWT_SECRET);
    } catch (e) {
        c.status(401);
        return c.json({ error: 'unauthorized' });
    }
    if (!payload) {
        c.status(401);
        return c.json({ error: 'unauthorized' });
    }
    c.set('userId', String(payload.id));
    console.log(payload.id);
    await next();
})

export default auth_middleware;
