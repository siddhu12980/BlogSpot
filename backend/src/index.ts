import { Hono } from "hono";
import blogs from "./routes/blogs";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createMiddleware } from "hono/factory";
import all from "./routes/all";
import { nanoid } from "nanoid";
import { cors } from 'hono/cors'
import auth from "./routes/auth";
import user from "./routes/user";
import { JWTPayload } from "hono/utils/jwt/types";
import { verify } from "hono/jwt";


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
    MY_BUCKET: R2Bucket
  };

  Variables: {
    userId: string,
    prisma: PrismaClient,
  }
}>();

app.use('/api/v1/*', cors())
app.use('/*', cors())


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

app.put("/upload", async (c, next) => {
  try {
    const key = nanoid(10)
    const formData = await c.req.parseBody()
    const file = formData['file']
    if (file instanceof File) {
      const fileBuffer = await file.arrayBuffer()

      const fullName = file.name
      const ext = fullName.split('.').pop()
      const path = `images/${key}.${ext}`

      await c.env.MY_BUCKET.put(path, fileBuffer)

      return c.json({
        'image': {
          'url': `${path}`
        }
      }, 200)
    } else {
      return c.text('Invalid file', 400)
    }
  }
  catch (e: any) {
    return c.json({ error: e.message }, 501);
  }

})

app.get("/image/:key", async (c, next) => {
  try {
    const key = c.req.param("key");
    const image = await c.env.MY_BUCKET.get(`images/${key}`);

    if (image) {
      // Return the image as a response
      return new Response(image.body, {
        headers: {
          "Content-Type": image.httpMetadata?.contentType || "application/octet-stream",
        },
        status: 200,
      });
    } else {
      // If the image is not found
      return c.text("Image not found", 404);
    }
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

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

app.use("/api/v1/all/*", async (c, next) => {

  console.log('--------------all middleware---------------');
  console.log(c.get("userId"));

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



app.route("/api/v1/auth", auth)
app.route("/api/v1/blog", blogs)
app.route("/api/v1/all", all)
app.route("/api/v1/user", user)


export default app;

