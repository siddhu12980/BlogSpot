import { Hono } from "hono";

import blogs from "./routes/blogs";
import user from "./routes/user";
import auth_middleware from "./middelwares/auth_middelware";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  };

  Variables: {
    userId: string,
  }
}>();



app.use("/api/v1/blogs/*", auth_middleware)
app.route("/api/v1/user", user)
app.route("/api/v1/blog", blogs)






export default app;
