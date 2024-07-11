import { Hono } from "hono";
import blogs from "./routes/blogs";
import user from "./routes/user";
import { verify } from 'hono/jwt';
import type { JWTPayload } from 'hono/utils/jwt/types';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createMiddleware } from "hono/factory";


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  };

  Variables: {
    userId: string,
    prisma: PrismaClient,
  }
}>();


const prismaMiddleware = createMiddleware(async (c, next) => {
  console.log('--------------Prisma middleware---------------');
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  c.set('prisma', prisma);
  await next();
}
)

app.use("*", prismaMiddleware);

app.use("/api/v1/blog/*", async (c, next) => {

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
  await next();
})



app.route("/api/v1/user", user)
app.route("/api/v1/blog", blogs)
app.route("/api/v1/all", blogs)







export default app;
