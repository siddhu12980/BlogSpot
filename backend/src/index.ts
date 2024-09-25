import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import AuthRoutes from './routes/user/user_auth_routes';
import blogRouter from './routes/blogs/blog_routes';
import blogFetRouter from './routes/blogs/blog_fet_routes';
import userRoutes from './routes/user/user';
import cors from 'cors';
import client from "./db"
import { authMiddleware } from './middleware/auth_middelware';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());


app.get("/", (req, res) => {
    res.json({
      msg: "healthy",
    });
  });

app.use("/api/v1/auth", AuthRoutes)

app.use("/api/v1/user",authMiddleware , userRoutes)
app.use("/api/v1/blog",  authMiddleware,blogFetRouter)

app.use("/api/v1/blog",  authMiddleware,blogRouter)

app.use("*", (req, res) => {
    res.json({
      msg: "invalid url",
    });
  });

  

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
