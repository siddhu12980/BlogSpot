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


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400",
};

const handleRequest = async (c: any) => {
  const url = new URL(c.req.url);
  const apiUrl = url.searchParams.get("apiurl");

  if (!apiUrl) {
    return c.text("Missing apiurl parameter", 400);
  }

  const request = new Request(apiUrl, {
    method: c.req.method,
    headers: c.req.headers,
    body: c.req.body,
  });
  request.headers.set("Origin", new URL(apiUrl).origin);

  const response = await fetch(request);
  const newResponse = new Response(response.body, response);

  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.append("Vary", "Origin");

  return newResponse;
};

const handleOptions = async (c: any) => {
  if (
    c.req.header("Origin") &&
    c.req.header("Access-Control-Request-Method") &&
    c.req.header("Access-Control-Request-Headers")
  ) {
    return c.newResponse(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Headers": c.req.header("Access-Control-Request-Headers"),
      },
    });
  } else {
    return c.newResponse(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    });
  }
};

app.use("/corsproxy/*", async (c, next) => {
  if (c.req.method === "OPTIONS") {
    return handleOptions(c);
  } else if (["GET", "HEAD", "POST"].includes(c.req.method)) {
    return handleRequest(c);
  } else {
    return c.newResponse(null, { status: 405, statusText: "Method Not Allowed" });
  }
});






export default app;
