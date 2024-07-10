import { Hono } from "hono";

import blogs from "./routes/blogs";

// Create the main Hono app

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  };
  Variables: {
    userId: string
  }
}>();


app.use('/api/v1/signup', async (c, next) => {
  console.log('middleware 1 start')
  await next()
  console.log('middleware 1 end')
})



app.route("/api/v1", blogs)
app.route("/api/v1/blog", blogs)






export default app;
